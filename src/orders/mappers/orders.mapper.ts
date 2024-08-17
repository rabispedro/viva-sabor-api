import { ResponseOrderDto } from '../dto/response-order.dto';
import { Order } from '../schemas/order.schema';

export class OrdersMapper {
  static mapToDto(order: Order): ResponseOrderDto {
    return { ...order['_doc'] } as unknown as ResponseOrderDto;
  }

  static mapToSchema(order: ResponseOrderDto): Order {
    return { ...order } as unknown as Order;
  }
}
