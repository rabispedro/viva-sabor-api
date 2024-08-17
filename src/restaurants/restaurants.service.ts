import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
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

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,

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

    return new ListResponseDto<ResponseRestaurantDto>(
      [...response],
      100,
      0,
      10,
    );
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
        nomeFantasia: name,
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

    return new ListResponseDto<ResponseRestaurantDto>(
      [...response],
      100,
      0,
      10,
    );
  }

  async update(
    id: UUID,
    updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<UUID> {
    const restaurant: Restaurant =
      await this.restaurantRepository.save(updateRestaurantDto);

    if (!restaurant)
      throw new BadRequestException('Restaurant could not be updated');

    return id;
  }

  async changeActive(id: UUID, flag: boolean): Promise<ResponseRestaurantDto> {
    let restaurant: Restaurant | null =
      await this.restaurantRepository.findOneBy({ id: id });

    if (!restaurant)
      throw new NotFoundException('User with this id could not be found');

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
      throw new BadRequestException('User could not be deleted');

    return id;
  }

  async restore(id: UUID): Promise<UUID> {
    const result = (
      await this.restaurantRepository.restore({
        id: id,
      })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('User could not be restored');

    return id;
  }

  async uploadImage(
    id: UUID,
    imageFile: Express.Multer.File,
  ): Promise<ResponseRestaurantDto> {
    let restaurant: Restaurant | null =
      await this.restaurantRepository.findOneBy({ id: id });

    if (!restaurant)
      throw new NotFoundException('Restaurant could not update image');

    const imageId: UUID = crypto.randomUUID();
    const imageType: string = FileUtils.extractFileTypeFromMime(
      imageFile.mimetype,
    );
    const imageName: string = `${imageId}.${imageType}`;

    await BucketUtils.setupBucket(this.restaurantsBucket, 'restaurants');
    await this.restaurantsBucket.putObject(
      'restaurants',
      imageName,
      imageFile.buffer,
    );

    const imagePath = `${process.env.BUCKET_HOST}:${process.env.BUCKET_PORT}/restaurants/${imageName}`;

    restaurant = await this.restaurantRepository.save({
      ...restaurant,
      imageUrl: imagePath,
    });

    return RestaurantsMapper.mapToDto(restaurant);
  }

  async uploadBannerImage(
    id: UUID,
    bannerImageFile: Express.Multer.File,
  ): Promise<ResponseRestaurantDto> {
    let restaurant: Restaurant | null =
      await this.restaurantRepository.findOneBy({ id: id });

    if (!restaurant)
      throw new NotFoundException('Restaurant could not update banner image');

    const bannerImageId: UUID = crypto.randomUUID();
    const bannerImageType: string = FileUtils.extractFileTypeFromMime(
      bannerImageFile.mimetype,
    );
    const bannerImageName: string = `${bannerImageId}.${bannerImageType}`;

    await BucketUtils.setupBucket(this.restaurantsBucket, 'restaurants');
    await this.restaurantsBucket.putObject(
      'restaurants',
      bannerImageName,
      bannerImageFile.buffer,
    );

    const imagePath = `${process.env.BUCKET_HOST}:${process.env.BUCKET_PORT}/restaurants/${bannerImageName}`;

    restaurant = await this.restaurantRepository.save({
      ...restaurant,
      bannerImageUrl: imagePath,
    });

    return RestaurantsMapper.mapToDto(restaurant);
  }
}
