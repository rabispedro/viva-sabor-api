import {
  BadRequestException,
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
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RestaurantsMapper } from 'src/restaurants/mappers/restaurants.mapper';
import { ResponseRestaurantDto } from 'src/restaurants/dto/response-restaurant.dto';

@Injectable()
export class AddressesService {
  constructor(
    private readonly restaurantsService: RestaurantsService,

    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
  ) {}

  async createToRestaurant(
    restaurantId: UUID,
    createAddressDto: CreateAddressDto,
  ): Promise<ResponseAddressDto> {
    const restaurant: ResponseRestaurantDto =
      await this.restaurantsService.findOneById(restaurantId);
    const address: Address = this.addressesRepository.create(createAddressDto);

    address.restaurants.push(RestaurantsMapper.mapToEntity(restaurant));
    await this.addressesRepository.save(address);

    return AddressesMapper.mapToDto(address);
  }

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

    return new ListResponseDto<ResponseAddressDto>([...response], 100, 0, 10);
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
