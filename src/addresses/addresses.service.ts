import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { UUID } from 'crypto';
import { ResponseAddressDto } from './dto/response-address.dto';
import { AddressesMapper } from './mappers/address.mapper';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
  ) {}
  async findAllByUserId(
    userId: UUID,
  ): Promise<ListResponseDto<ResponseAddressDto>> {
    const addresses: Address[] = await this.addressesRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: {
        users: true,
      },
      cache: true,
    });

    if (!addresses || addresses.length === 0)
      throw new NotFoundException('Addresses could not be found');

    const response: ResponseAddressDto[] = addresses.map((address: Address) =>
      AddressesMapper.mapToDto(address),
    );

    return new ListResponseDto<ResponseAddressDto>(response, 100, 0, 10);
  }

  async findAllByRestaurantId(
    restaurantId: UUID,
  ): Promise<ListResponseDto<ResponseAddressDto>> {
    const addresses: Address[] = await this.addressesRepository.find({
      where: {
        restaurants: {
          id: restaurantId,
        },
      },
      relations: {
        restaurants: true,
      },
      cache: true,
    });

    if (!addresses || addresses.length === 0)
      throw new NotFoundException('Addresses could not be found');

    const response: ResponseAddressDto[] = addresses.map((address: Address) =>
      AddressesMapper.mapToDto(address),
    );

    return new ListResponseDto<ResponseAddressDto>(response, 100, 0, 10);
  }

  async update(id: UUID, updateAddressDto: UpdateAddressDto): Promise<UUID> {
    const result: number | null | undefined = (
      await this.addressesRepository.update(id, updateAddressDto)
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Address could not be updated');

    return id;
  }

  async softDelete(id: UUID): Promise<UUID> {
    const result: number | null | undefined = (
      await this.addressesRepository.softDelete({
        id: id,
      })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Address could not be deleted');

    return id;
  }

  async restore(id: UUID): Promise<UUID> {
    const result: number | null | undefined = (
      await this.addressesRepository.restore({
        id: id,
      })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Address could not be restored');

    return id;
  }

  async changeActive(id: UUID, flag: boolean): Promise<ResponseAddressDto> {
    let address: Address | null = await this.addressesRepository.findOne({
      where: {
        id: id,
      },
      cache: true,
    });

    if (!address)
      throw new NotFoundException('Address with this id could not be found');

    address = await this.addressesRepository.save({
      ...address,
      isActive: flag,
    });

    return AddressesMapper.mapToDto(address);
  }
}
