import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { ResponseOrderDto } from './dto/response-order.dto';
import { OrdersMapper } from './mappers/orders.mapper';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<ResponseOrderDto> {
    const order = new this.orderModel(createOrderDto);
    await order.save();

    return OrdersMapper.mapToDto(order);
  }

  async findAll(): Promise<ListResponseDto<ResponseOrderDto>> {
    const orders: Order[] = await this.orderModel.find().exec();

    if (!orders || orders.length === 0)
      throw new NotFoundException('Orders could not be found');

    const response: ResponseOrderDto[] = orders.map((order: Order) =>
      OrdersMapper.mapToDto(order),
    );

    return new ListResponseDto<ResponseOrderDto>(response, 100, 0, 10);
  }
}
