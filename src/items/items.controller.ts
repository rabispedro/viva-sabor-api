import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';
// import { CacheInterceptor } from 'src/shared/interceptors/cache.interceptor';
import { ItemsService } from './items.service';

@Controller('items')
// @UseInterceptors(CacheInterceptor)
@ApiTags('items')
@UseGuards(RolesGuard)
@ApiBearerAuth()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
}
