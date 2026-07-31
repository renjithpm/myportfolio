import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDashboardService } from './user-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@Controller('user/dashboard')
@UseGuards(JwtAuthGuard)
export class UserDashboardController {
  constructor(private readonly userDashboardService: UserDashboardService) {}

  @Get()
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.userDashboardService.getDashboard(user.id);
  }
}
