import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { UUID } from 'crypto';
import { ResponseAddressDto } from './dto/response-address.dto';
import { AddressesMapper } from './mappers/address.mapper';

@Injectable()
export class AddressesService {
  constructor(
    @Inject()
    private readonly addressesRepository: Repository<Address>,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
  ): Promise<ResponseAddressDto> {
    const address: Address = this.addressesRepository.create(createAddressDto);
    await this.addressesRepository.save(address);

    return AddressesMapper.map(address);
  }

  async findAllByUserId(
    id: UUID,
  ): Promise<ListResponseDto<ResponseAddressDto>> {
    const addresses: Address[] = await this.addressesRepository.find({
      where: {
        users: {
          id: id,
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
      AddressesMapper.map(address),
    );

    return new ListResponseDto<ResponseAddressDto>([...response], 100, 0, 10);
  }

  async findAllByRestaurantId(
    id: UUID,
  ): Promise<ListResponseDto<ResponseAddressDto>> {
    const addresses: Address[] = await this.addressesRepository.find({
      where: {
        restaurants: {
          id: id,
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
      AddressesMapper.map(address),
    );

    return new ListResponseDto<ResponseAddressDto>([...response], 100, 0, 10);
  }

  async update(id: UUID, updateAddressDto: UpdateAddressDto): Promise<UUID> {
    const address: Address =
      await this.addressesRepository.save(updateAddressDto);

    if (!address) throw new BadRequestException('Address could not be updated');

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
}
