import { ResponseDishDto } from '../dto/response-dish.dto';
import { Dish } from '../entities/dish.entity';

export class DishesMapper {
  static mapToDto(dish: Dish): ResponseDishDto {
    return {
      ...dish,
      price: dish.price / 100.0,
      discount: (dish.discount ?? 0) / 100.0,
    } as unknown as ResponseDishDto;
  }

  static mapToEntity(dish: ResponseDishDto): Dish {
    return { ...dish } as unknown as Dish;
  }
}
