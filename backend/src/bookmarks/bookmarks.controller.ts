import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';
import { IsNotEmpty, IsString } from 'class-validator';

class ToggleBookmarkDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;
}

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  findByUser(@CurrentUser() user: AuthenticatedUser) {
    return this.bookmarksService.findByUser(user.id);
  }

  @Post()
  toggle(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ToggleBookmarkDto,
  ): Promise<{ bookmarked: boolean }> {
    return this.bookmarksService.toggle(user.id, dto.courseId);
  }
}
