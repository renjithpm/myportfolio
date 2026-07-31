export type Role = 'USER' | 'ADMIN';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CourseStatus = 'DRAFT' | 'PUBLISHED';
export type LessonType = 'VIDEO' | 'PDF' | 'ARTICLE' | 'DOWNLOADABLE' | 'EXTERNAL_LINK';
export type PurchaseStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PlanTier = 'FREE' | 'BASIC' | 'PRO' | 'PREMIUM';
export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export type SubStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  durationMinutes?: number;
  resourceUrl?: string;
  downloadAllowed: boolean;
  previewEnabled: boolean;
  order: number;
  moduleId: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order: number;
  courseId: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  bannerImage?: string;
  instructor: string;
  difficulty: Difficulty;
  durationHours: number;
  language: string;
  price: number;
  discountPrice?: number;
  currency: string;
  isFree: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  status: CourseStatus;
  categoryId?: string;
  category?: Category;
  tags: Tag[];
  modules: CourseModule[];
  _count?: { purchases: number; modules: number };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  difficulty?: Difficulty | '';
  isFree?: boolean | '';
  search?: string;
  sort?: 'newest' | 'oldest' | 'popular' | 'price-asc' | 'price-desc';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PlanTier;
  monthlyPrice: number;
  annualPrice: number;
  downloadAllowed: boolean;
  premiumAccess: boolean;
  description?: string;
  features: string[];
}

export interface Subscription {
  id: string;
  planId: string;
  billingCycle: BillingCycle;
  status: SubStatus;
  startedAt: string;
  expiresAt?: string;
  plan: SubscriptionPlan;
}

export interface Purchase {
  id: string;
  courseId: string;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  invoiceNumber: string;
  purchasedAt?: string;
  course: Course;
}

export interface PurchaseInitiateResponse {
  purchaseId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  appliedDiscount: number;
  razorpayOrderId: string;
  razorpayKey: string;
}

export interface ConfirmPurchasePayload {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface Offer {
  id: string;
  name: string;
  offerType: 'PERCENTAGE' | 'FIXED';
  percentDiscount?: number;
  fixedDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AdminDashboard {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalUsers: number;
  totalSubscribers: number;
  todaySales: number;
  monthlySales: number;
  revenueByMonth: { month: string; revenue: number }[];
  topSellingCourses: Course[];
  recentPurchases: Purchase[];
  popularCategories: (Category & { _count: { courses: number } })[];
}

export interface UserDashboard {
  purchasedCourses: Purchase[];
  subscription?: Subscription;
  inProgressCourses: Course[];
  completedCourses: Course[];
  bookmarkedCourses: Course[];
}

export interface CourseProgress {
  completedLessons: string[];
  totalLessons: number;
  percentComplete: number;
}

export interface CouponValidateResponse {
  valid: boolean;
  discountAmount: number;
}

export interface UploadResponse {
  url: string;
  key: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
