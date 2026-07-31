import { z } from 'zod';

export const lessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'PDF', 'ARTICLE', 'DOWNLOADABLE', 'EXTERNAL_LINK']),
  durationMinutes: z.coerce.number().min(0).optional(),
  resourceUrl: z.string().optional(),
  downloadAllowed: z.boolean().default(false),
  previewEnabled: z.boolean().default(false),
  order: z.coerce.number().min(0).default(0),
});

export const moduleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'Title required'),
  description: z.string().optional(),
  order: z.coerce.number().min(0).default(0),
  lessons: z.array(lessonSchema).default([]),
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  subtitle: z.string().max(300).optional(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug: lowercase letters, numbers and hyphens only')
    .optional(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  shortDescription: z.string().max(200).optional(),
  thumbnail: z.string().optional(),
  bannerImage: z.string().optional(),
  instructor: z.string().min(2, 'Instructor name required'),
  difficulty: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  durationHours: z.coerce.number().min(0, 'Must be 0 or more'),
  language: z.string().min(2).default('English'),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  discountPrice: z.coerce.number().min(0).optional(),
  currency: z.string().length(3).default('AED'),
  isFree: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  categoryId: z.string().optional(),
  modules: z.array(moduleSchema).default([]),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
export type ModuleFormValues = z.infer<typeof moduleSchema>;
export type LessonFormValues = z.infer<typeof lessonSchema>;
