import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { InitiatePurchaseDto } from './dto/initiate-purchase.dto';
import { ConfirmPurchaseDto } from './dto/confirm-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  initiate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: InitiatePurchaseDto,
  ) {
    return this.purchasesService.initiate(user.id, dto);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string, @Body() dto: ConfirmPurchaseDto) {
    return this.purchasesService.confirm(id, dto);
  }

  @Get()
  findMyPurchases(@CurrentUser() user: AuthenticatedUser) {
    return this.purchasesService.findByUser(user.id);
  }
}
