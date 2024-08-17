import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { ListResponseDto } from 'src/shared/dtos/list-response.dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { ResponseOrderDto } from './dto/response-order.dto';

@Controller('orders')
@UseGuards(RolesGuard)
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ type: ResponseOrderDto })
  async create(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ): Promise<ResponseOrderDto> {
    return await this.ordersService.create(createOrderDto);
  }

  @Get()
  @Roles(['admin'])
  @ApiResponse({ type: ListResponseDto<ResponseOrderDto> })
  async findAll(): Promise<ListResponseDto<ResponseOrderDto>> {
    return await this.ordersService.findAll();
  }
}
