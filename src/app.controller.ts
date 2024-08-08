import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from './shared/decorators/public-route.decorator';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  @PublicRoute()
  @ApiResponse({ type: String })
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
