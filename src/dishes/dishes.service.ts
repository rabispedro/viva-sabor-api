import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { UUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { ILike, Repository } from 'typeorm';
import { DishesMapper } from './mappers/dishes.mapper';
import { ResponseDishDto } from './dto/response-dish.dto';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishesRepository: Repository<Dish>,
  ) {}

  async create(createDishDto: CreateDishDto): Promise<ResponseDishDto> {
    const dish: Dish = this.dishesRepository.create(createDishDto);
    await this.dishesRepository.save(dish);

    return DishesMapper.mapToDto(dish);
  }

  async findAllByRestaurant(
    restaurantId: UUID,
  ): Promise<ListResponseDto<ResponseDishDto>> {
    const dishes: Dish[] = await this.dishesRepository.find({
      where: {
        restaurant: {
          id: restaurantId,
        },
      },
      relations: {
        restaurant: true,
      },
      cache: true,
    });

    if (!dishes || dishes.length === 0)
      throw new NotFoundException('Dishes could not be found');

    const response: ResponseDishDto[] = dishes.map((dish: Dish) =>
      DishesMapper.mapToDto(dish),
    );

    return new ListResponseDto<ResponseDishDto>([...response], 100, 0, 10);
  }

  async findAllByNameOrDescription(
    query: string,
  ): Promise<ListResponseDto<ResponseDishDto>> {
    const dishes: Dish[] = await this.dishesRepository.find({
      where: [
        {
          name: ILike(query),
        },
        {
          description: ILike(query),
        },
      ],
      relations: {
        restaurant: true,
      },
      cache: true,
    });

    if (!dishes || dishes.length === 0)
      throw new NotFoundException('Dishes could not be found');

    const response: ResponseDishDto[] = dishes.map((dish: Dish) =>
      DishesMapper.mapToDto(dish),
    );

    return new ListResponseDto<ResponseDishDto>([...response], 100, 0, 10);
  }

  async update(id: UUID, updateDishDto: UpdateDishDto): Promise<UUID> {
    const dish: Dish = await this.dishesRepository.save(updateDishDto);

    if (!dish) throw new BadRequestException('Dish could not be updated');

    return id;
  }

  async softDelete(id: UUID): Promise<UUID> {
    const result: number | null | undefined = (
      await this.dishesRepository.softDelete({ id: id })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Dish could not be deleted');

    return id;
  }

  async restore(id: UUID): Promise<UUID> {
    const result: number | null | undefined = (
      await this.dishesRepository.restore({ id: id })
    ).affected;

    if (!result || result === 0)
      throw new BadRequestException('Dish could not be restored');

    return id;
  }
}
