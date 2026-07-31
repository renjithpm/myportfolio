import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@Controller()
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('coupons/validate')
  @UseGuards(JwtAuthGuard)
  validate(
    @Body() dto: ValidateCouponDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.couponsService.validate(dto, user.id);
  }

  @Post('coupons')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @Get('admin/coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.couponsService.findAll();
  }

  @Patch('admin/coupons/:code/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  toggleActive(@Param('code') code: string) {
    return this.couponsService.toggleActive(code);
  }
}
