import { ResponseRestaurantDto } from '../dto/response-restaurant.dto';
import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantsMapper {
  static mapToDto(restaurant: Restaurant): ResponseRestaurantDto {
    return { ...restaurant } as unknown as ResponseRestaurantDto;
  }

  static mapToEntity(restaurant: ResponseRestaurantDto): Restaurant {
    return { ...restaurant } as unknown as Restaurant;
  }
}
