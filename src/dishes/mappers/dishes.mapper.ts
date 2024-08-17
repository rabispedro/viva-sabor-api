import { ResponseDishDto } from '../dto/response-dish.dto';
import { Dish } from '../entities/dish.entity';

export class DishesMapper {
  static mapToDto(dish: Dish): ResponseDishDto {
    return { ...dish } as unknown as ResponseDishDto;
  }

  static mapToEntity(dish: ResponseDishDto): Dish {
    return { ...dish } as unknown as Dish;
  }
}
