import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { GithubModule } from './github/github.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { CoursesModule } from './courses/courses.module';
import { CourseModulesModule } from './course-modules/course-modules.module';
import { LessonsModule } from './lessons/lessons.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { OffersModule } from './offers/offers.module';
import { CouponsModule } from './coupons/coupons.module';
import { ProgressModule } from './progress/progress.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { UploadsModule } from './uploads/uploads.module';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    PrismaModule,
    ContactModule,
    GithubModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    TagsModule,
    CoursesModule,
    CourseModulesModule,
    LessonsModule,
    PurchasesModule,
    SubscriptionsModule,
    OffersModule,
    CouponsModule,
    ProgressModule,
    BookmarksModule,
    UploadsModule,
    AdminDashboardModule,
    UserDashboardModule,
    PaymentsModule,
  ],
})
export class AppModule {}
