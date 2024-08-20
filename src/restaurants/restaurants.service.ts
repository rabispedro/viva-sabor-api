import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { ILike, Repository } from 'typeorm';
import { RestaurantsMapper } from './mappers/restaurants.mapper';
import { ResponseRestaurantDto } from './dto/response-restaurant.dto';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { UUID } from 'crypto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Client } from 'minio';
import { FileUtils } from 'src/shared/utils/file.utils';
import { BucketUtils } from 'src/shared/utils/bucket.utils';
import { CreateRestaurantAddressDto } from './dto/create-restaurant-address.dto';
import { Address } from 'src/addresses/entities/address.entity';
import { CreateRestaurantDishDto } from './dto/create-restaurant-dish.dto';
import { Dish } from 'src/dishes/entities/dish.entity';
import { CreateRestaurantEmployeeDto } from './dto/create-restaurant-employee.dto';
import { User } from 'src/users/entities/user.entity';
import { ResponseRoleDto } from 'src/roles/dto/response-role.dto';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,

    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,

    @InjectRepository(Dish)
    private readonly dishesRepository: Repository<Dish>,

    @InjectRepository(User)
    private readonly employeesRepository: Repository<User>,

    private readonly rolesService: RolesService,

    @Inject(MINIO_CONNECTION)
    private readonly restaurantsBucket: Client,
  ) {}

  async create(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<ResponseRestaurantDto> {
    const restaurant: Restaurant =
      this.restaurantRepository.create(createRestaurantDto);
    await this.restaurantRepository.save(restaurant);

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async findAll(): Promise<ListResponseDto<ResponseRestaurantDto>> {
    const restaurants: Restaurant[] = await this.restaurantRepository.find({
      relations: {
        addresses: true,
        dishes: true,
        employees: true,
      },
      cache: true,
    });

    if (!restaurants || restaurants.length === 0)
      throw new NotFoundException('Restaurants could not be found');

    const response: ResponseRestaurantDto[] = restaurants.map(
      (restaurant: Restaurant) => RestaurantsMapper.mapToDto(restaurant),
    );

    return new ListResponseDto<ResponseRestaurantDto>(response, 100, 0, 10);
  }

  async findOneById(id: UUID): Promise<ResponseRestaurantDto> {
    const restaurant: Restaurant | null =
      await this.restaurantRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          addresses: true,
          dishes: true,
          employees: true,
        },
        cache: true,
      });

    if (!restaurant)
      throw new NotFoundException('Restaurant with this id could not be found');

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async findAllByName(
    name: string,
  ): Promise<ListResponseDto<ResponseRestaurantDto>> {
    const restaurants: Restaurant[] = await this.restaurantRepository.find({
      where: {
        nomeFantasia: ILike(`%${name}%`),
      },
      relations: {
        addresses: true,
        dishes: true,
        employees: true,
      },
      cache: true,
    });

    if (!restaurants || restaurants.length === 0)
      throw new NotFoundException('Restaurants could not be found');

    const response: ResponseRestaurantDto[] = restaurants.map(
      (restaurant: Restaurant) => RestaurantsMapper.mapToDto(restaurant),
    );

    return new ListResponseDto<ResponseRestaurantDto>(response, 100, 0, 10);
  }

  async update(
    id: UUID,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<UUID> {
    const result: number | null | undefined = (
      await this.restaurantRepository.update(id, updateRestaurantDto)
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Restaurant could not be updated');

    return id;
  }

  async changeActive(id: UUID, flag: boolean): Promise<ResponseRestaurantDto> {
    let restaurant: Restaurant | null = await this.restaurantRepository.findOne(
      {
        where: { id: id },
        cache: true,
      },
    );

    if (!restaurant)
      throw new NotFoundException('Restaurant with this id could not be found');

    restaurant = await this.restaurantRepository.save({
      ...restaurant,
      isActive: flag,
    });

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async softDelete(id: UUID): Promise<UUID> {
    const result: number | null | undefined = (
      await this.restaurantRepository.softDelete({
        id: id,
      })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Restaurant could not be deleted');

    return id;
  }

  async restore(id: UUID): Promise<UUID> {
    const result = (
      await this.restaurantRepository.restore({
        id: id,
      })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Restaurant could not be restored');

    return id;
  }

  async uploadImage(
    id: UUID,
    imageFile: Express.Multer.File,
  ): Promise<ResponseRestaurantDto> {
    let restaurant: Restaurant | null = await this.restaurantRepository.findOne(
      {
        where: {
          id: id,
        },
        cache: true,
      },
    );

    if (!restaurant)
      throw new NotFoundException('Restaurant could not update image');

    const imageId: UUID = crypto.randomUUID();
    const imageType: string = FileUtils.extractFileTypeFromMime(
      imageFile.mimetype,
    );
    const imageName: string = `${imageId}.${imageType}`;
    const imagePrefix: string = `${process.env.BUCKET_HOST}:${process.env.BUCKET_PORT}/restaurants`;

    await BucketUtils.setupBucket(this.restaurantsBucket, 'restaurants');

    if (!!restaurant.imageUrl)
      await this.restaurantsBucket.removeObject(
        'restaurants',
        restaurant.imageUrl.replace(`${imagePrefix}/`, ''),
      );

    await this.restaurantsBucket.putObject(
      'restaurants',
      imageName,
      imageFile.buffer,
    );

    restaurant = await this.restaurantRepository.save({
      ...restaurant,
      imageUrl: `${imagePrefix}/${imageName}`,
    });

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async uploadBannerImage(
    id: UUID,
    bannerImageFile: Express.Multer.File,
  ): Promise<ResponseRestaurantDto> {
    let restaurant: Restaurant | null = await this.restaurantRepository.findOne(
      {
        where: {
          id: id,
        },
        cache: true,
      },
    );

    if (!restaurant)
      throw new NotFoundException('Restaurant could not update banner image');

    const bannerImageId: UUID = crypto.randomUUID();
    const bannerImageType: string = FileUtils.extractFileTypeFromMime(
      bannerImageFile.mimetype,
    );
    const bannerImageName: string = `${bannerImageId}.${bannerImageType}`;
    const bannerImagePrefix = `${process.env.BUCKET_HOST}:${process.env.BUCKET_PORT}/restaurants`;

    await BucketUtils.setupBucket(this.restaurantsBucket, 'restaurants');

    if (!!restaurant.bannerImageUrl)
      await this.restaurantsBucket.removeObject(
        'restaurants',
        restaurant.bannerImageUrl.replace(`${bannerImagePrefix}/`, ''),
      );

    await this.restaurantsBucket.putObject(
      'restaurants',
      bannerImageName,
      bannerImageFile.buffer,
    );

    restaurant = await this.restaurantRepository.save({
      ...restaurant,
      bannerImageUrl: `${bannerImagePrefix}/${bannerImageName}`,
    });

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async addAddress(
    id: UUID,
    createRestaurantAddressDto: CreateRestaurantAddressDto,
  ): Promise<ResponseRestaurantDto> {
    const restaurant: Restaurant | null =
      await this.restaurantRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          addresses: true,
        },
        cache: true,
      });

    if (!restaurant)
      throw new NotFoundException('Restaurant with this id could not be found');

    const address: Address = this.addressesRepository.create(
      createRestaurantAddressDto,
    );

    if (!restaurant.addresses) restaurant.addresses = [address];
    else restaurant.addresses.push(address);

    await this.restaurantRepository.save(restaurant);

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async addDish(
    id: UUID,
    createRestaurantDishDto: CreateRestaurantDishDto,
  ): Promise<ResponseRestaurantDto> {
    const restaurant: Restaurant | null =
      await this.restaurantRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          dishes: true,
        },
        cache: true,
      });

    if (!restaurant)
      throw new NotFoundException('Restaurant with this id could not be found');

    const dish: Dish = this.dishesRepository.create(createRestaurantDishDto);

    if (!restaurant.dishes) restaurant.dishes = [dish];
    else restaurant.dishes.push(dish);

    await this.restaurantRepository.save(restaurant);

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async addEmployee(
    id: UUID,
    createRestaurantEmployeeDto: CreateRestaurantEmployeeDto,
  ): Promise<ResponseRestaurantDto> {
    const restaurant: Restaurant | null =
      await this.restaurantRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          addresses: true,
        },
        cache: true,
      });

    if (!restaurant)
      throw new NotFoundException('Restaurant with this id could not be found');

    const role: ResponseRoleDto =
      await this.rolesService.findOneByName('employee');

    const employee: User = this.employeesRepository.create({
      ...createRestaurantEmployeeDto,
      roles: [role],
    });

    if (!restaurant.employees) restaurant.employees = [employee];
    else restaurant.employees.push(employee);

    await this.restaurantRepository.save(restaurant);

    return RestaurantsMapper.mapToDto(restaurant);
  }
}
