import { PrismaClient, Difficulty, CourseStatus, LessonType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const COURSES = [
  {
    title: 'React & Next.js 14 Masterclass',
    subtitle: 'Build production-ready web apps from scratch',
    slug: 'react-nextjs-14-masterclass',
    description:
      'Master React 18 and Next.js 14 App Router with hands-on projects. Learn server components, streaming, data fetching patterns, authentication, and deployment. By the end you will have shipped three real-world applications.',
    shortDescription: 'Master React 18 and Next.js 14 with real-world projects.',
    instructor: 'Renjith PM',
    difficulty: Difficulty.INTERMEDIATE,
    durationHours: 28,
    price: 2499,
    discountPrice: 1499,
    currency: 'INR',
    isFeatured: true,
    isBestseller: true,
    thumbnail: 'https://picsum.photos/seed/reactnext/800/450',
    modules: [
      {
        title: 'React Fundamentals Refresher',
        order: 1,
        lessons: [
          { title: 'Course Overview & Setup', type: LessonType.VIDEO, durationMinutes: 8, previewEnabled: true, order: 1 },
          { title: 'JSX, Components & Props', type: LessonType.VIDEO, durationMinutes: 22, order: 2 },
          { title: 'State & useEffect Deep Dive', type: LessonType.VIDEO, durationMinutes: 35, order: 3 },
          { title: 'Custom Hooks Pattern', type: LessonType.VIDEO, durationMinutes: 28, order: 4 },
        ],
      },
      {
        title: 'Next.js 14 App Router',
        order: 2,
        lessons: [
          { title: 'Pages vs App Router Explained', type: LessonType.VIDEO, durationMinutes: 18, previewEnabled: true, order: 1 },
          { title: 'Server Components & Client Components', type: LessonType.VIDEO, durationMinutes: 32, order: 2 },
          { title: 'Layouts, Loading & Error UI', type: LessonType.VIDEO, durationMinutes: 24, order: 3 },
          { title: 'Data Fetching & Caching Strategies', type: LessonType.VIDEO, durationMinutes: 40, order: 4 },
          { title: 'Route Handlers & Server Actions', type: LessonType.VIDEO, durationMinutes: 30, order: 5 },
        ],
      },
      {
        title: 'Authentication & Database',
        order: 3,
        lessons: [
          { title: 'NextAuth.js Setup', type: LessonType.VIDEO, durationMinutes: 26, order: 1 },
          { title: 'Prisma ORM Integration', type: LessonType.VIDEO, durationMinutes: 34, order: 2 },
          { title: 'Protected Routes & Middleware', type: LessonType.VIDEO, durationMinutes: 22, order: 3 },
        ],
      },
      {
        title: 'Deployment & Performance',
        order: 4,
        lessons: [
          { title: 'Optimising Images & Fonts', type: LessonType.VIDEO, durationMinutes: 18, order: 1 },
          { title: 'Deploy to Vercel', type: LessonType.VIDEO, durationMinutes: 15, previewEnabled: true, order: 2 },
          { title: 'Core Web Vitals & Lighthouse', type: LessonType.VIDEO, durationMinutes: 20, order: 3 },
        ],
      },
    ],
  },
  {
    title: 'Node.js & NestJS Backend Development',
    subtitle: 'Enterprise-grade REST APIs with TypeScript',
    slug: 'nodejs-nestjs-backend',
    description:
      'Learn to build scalable, secure backend services using Node.js and NestJS. Covers REST API design, JWT auth, Prisma ORM, role-based access control, file uploads, email, testing, and Docker deployment.',
    shortDescription: 'Build scalable REST APIs with NestJS, Prisma, and PostgreSQL.',
    instructor: 'Renjith PM',
    difficulty: Difficulty.INTERMEDIATE,
    durationHours: 24,
    price: 2199,
    discountPrice: 1299,
    currency: 'INR',
    isFeatured: true,
    thumbnail: 'https://picsum.photos/seed/nodejs/800/450',
    modules: [
      {
        title: 'NestJS Foundations',
        order: 1,
        lessons: [
          { title: 'NestJS Architecture Overview', type: LessonType.VIDEO, durationMinutes: 15, previewEnabled: true, order: 1 },
          { title: 'Modules, Controllers & Services', type: LessonType.VIDEO, durationMinutes: 28, order: 2 },
          { title: 'Dependency Injection Pattern', type: LessonType.VIDEO, durationMinutes: 22, order: 3 },
          { title: 'Pipes, Guards & Interceptors', type: LessonType.VIDEO, durationMinutes: 35, order: 4 },
        ],
      },
      {
        title: 'Database with Prisma',
        order: 2,
        lessons: [
          { title: 'Schema Design & Migrations', type: LessonType.VIDEO, durationMinutes: 30, order: 1 },
          { title: 'CRUD Operations & Relations', type: LessonType.VIDEO, durationMinutes: 38, order: 2 },
          { title: 'Pagination & Filtering', type: LessonType.VIDEO, durationMinutes: 25, order: 3 },
        ],
      },
      {
        title: 'Authentication & Security',
        order: 3,
        lessons: [
          { title: 'JWT Access & Refresh Tokens', type: LessonType.VIDEO, durationMinutes: 32, previewEnabled: true, order: 1 },
          { title: 'Role-Based Access Control', type: LessonType.VIDEO, durationMinutes: 28, order: 2 },
          { title: 'Rate Limiting & Helmet', type: LessonType.VIDEO, durationMinutes: 18, order: 3 },
        ],
      },
      {
        title: 'Production & Testing',
        order: 4,
        lessons: [
          { title: 'Unit & Integration Testing', type: LessonType.VIDEO, durationMinutes: 40, order: 1 },
          { title: 'Dockerising the App', type: LessonType.VIDEO, durationMinutes: 22, order: 2 },
          { title: 'Deploy to Railway/Render', type: LessonType.VIDEO, durationMinutes: 18, order: 3 },
        ],
      },
    ],
  },
  {
    title: 'React Native: Cross-Platform Mobile Apps',
    subtitle: 'iOS & Android development with Expo',
    slug: 'react-native-cross-platform',
    description:
      'Build beautiful, performant iOS and Android apps with React Native and Expo. Master navigation, animations, native APIs, push notifications, offline storage, and publish your app to both stores.',
    shortDescription: 'Build iOS & Android apps with React Native and Expo.',
    instructor: 'Renjith PM',
    difficulty: Difficulty.BEGINNER,
    durationHours: 32,
    price: 2799,
    discountPrice: 1799,
    currency: 'INR',
    isFeatured: true,
    isBestseller: true,
    thumbnail: 'https://picsum.photos/seed/mobile/800/450',
    modules: [
      {
        title: 'Getting Started with Expo',
        order: 1,
        lessons: [
          { title: 'Setup & First App', type: LessonType.VIDEO, durationMinutes: 12, previewEnabled: true, order: 1 },
          { title: 'Core Components & Styling', type: LessonType.VIDEO, durationMinutes: 30, order: 2 },
          { title: 'Flexbox Layout in React Native', type: LessonType.VIDEO, durationMinutes: 26, order: 3 },
        ],
      },
      {
        title: 'Navigation & State',
        order: 2,
        lessons: [
          { title: 'Expo Router File-Based Navigation', type: LessonType.VIDEO, durationMinutes: 35, previewEnabled: true, order: 1 },
          { title: 'Tab & Drawer Navigation', type: LessonType.VIDEO, durationMinutes: 28, order: 2 },
          { title: 'Zustand for State Management', type: LessonType.VIDEO, durationMinutes: 32, order: 3 },
        ],
      },
      {
        title: 'Native Features',
        order: 3,
        lessons: [
          { title: 'Camera & Image Picker', type: LessonType.VIDEO, durationMinutes: 24, order: 1 },
          { title: 'Push Notifications with Expo', type: LessonType.VIDEO, durationMinutes: 30, order: 2 },
          { title: 'Offline Storage with MMKV', type: LessonType.VIDEO, durationMinutes: 22, order: 3 },
          { title: 'Maps & Location', type: LessonType.VIDEO, durationMinutes: 28, order: 4 },
        ],
      },
      {
        title: 'Animations & Publishing',
        order: 4,
        lessons: [
          { title: 'Reanimated 3 Fundamentals', type: LessonType.VIDEO, durationMinutes: 38, order: 1 },
          { title: 'Gesture Handler', type: LessonType.VIDEO, durationMinutes: 26, order: 2 },
          { title: 'Build & Submit to App Stores', type: LessonType.VIDEO, durationMinutes: 20, order: 3 },
        ],
      },
    ],
  },
  {
    title: 'TypeScript: From Zero to Advanced',
    subtitle: 'Type-safe JavaScript for enterprise development',
    slug: 'typescript-zero-to-advanced',
    description:
      'Go from JavaScript developer to TypeScript expert. Learn type inference, generics, utility types, decorators, and advanced patterns used in real codebases. Includes TypeScript with React, Node.js, and API design.',
    shortDescription: 'Master TypeScript types, generics, and advanced patterns.',
    instructor: 'Renjith PM',
    difficulty: Difficulty.BEGINNER,
    durationHours: 18,
    price: 1799,
    discountPrice: 999,
    currency: 'INR',
    thumbnail: 'https://picsum.photos/seed/typescript/800/450',
    modules: [
      {
        title: 'TypeScript Basics',
        order: 1,
        lessons: [
          { title: 'Why TypeScript?', type: LessonType.VIDEO, durationMinutes: 10, previewEnabled: true, order: 1 },
          { title: 'Primitive Types & Type Inference', type: LessonType.VIDEO, durationMinutes: 22, order: 2 },
          { title: 'Interfaces vs Type Aliases', type: LessonType.VIDEO, durationMinutes: 25, order: 3 },
          { title: 'Union, Intersection & Literal Types', type: LessonType.VIDEO, durationMinutes: 28, order: 4 },
        ],
      },
      {
        title: 'Functions & Classes',
        order: 2,
        lessons: [
          { title: 'Typed Functions & Overloads', type: LessonType.VIDEO, durationMinutes: 30, order: 1 },
          { title: 'Classes & Access Modifiers', type: LessonType.VIDEO, durationMinutes: 28, order: 2 },
          { title: 'Decorators in Depth', type: LessonType.VIDEO, durationMinutes: 35, order: 3 },
        ],
      },
      {
        title: 'Generics & Utility Types',
        order: 3,
        lessons: [
          { title: 'Generics Explained Simply', type: LessonType.VIDEO, durationMinutes: 32, previewEnabled: true, order: 1 },
          { title: 'Conditional & Mapped Types', type: LessonType.VIDEO, durationMinutes: 38, order: 2 },
          { title: 'Built-in Utility Types', type: LessonType.VIDEO, durationMinutes: 25, order: 3 },
          { title: 'Template Literal Types', type: LessonType.VIDEO, durationMinutes: 22, order: 4 },
        ],
      },
    ],
  },
  {
    title: 'Full Stack with GraphQL & Apollo',
    subtitle: 'Build a real-time social platform end-to-end',
    slug: 'fullstack-graphql-apollo',
    description:
      'Design and build a full-stack application using GraphQL, Apollo Server, React, and PostgreSQL. Learn schemas, resolvers, mutations, subscriptions, caching, and how to replace REST with a flexible query layer.',
    shortDescription: 'Build a full-stack app with GraphQL, Apollo, and React.',
    instructor: 'Renjith PM',
    difficulty: Difficulty.ADVANCED,
    durationHours: 22,
    price: 2999,
    discountPrice: 1999,
    currency: 'INR',
    isFeatured: true,
    thumbnail: 'https://picsum.photos/seed/graphql/800/450',
    modules: [
      {
        title: 'GraphQL Fundamentals',
        order: 1,
        lessons: [
          { title: 'REST vs GraphQL', type: LessonType.VIDEO, durationMinutes: 14, previewEnabled: true, order: 1 },
          { title: 'Schema Definition Language', type: LessonType.VIDEO, durationMinutes: 26, order: 2 },
          { title: 'Queries, Mutations & Subscriptions', type: LessonType.VIDEO, durationMinutes: 32, order: 3 },
        ],
      },
      {
        title: 'Apollo Server',
        order: 2,
        lessons: [
          { title: 'Setting Up Apollo Server 4', type: LessonType.VIDEO, durationMinutes: 20, previewEnabled: true, order: 1 },
          { title: 'Resolvers & DataSources', type: LessonType.VIDEO, durationMinutes: 35, order: 2 },
          { title: 'Authentication in GraphQL', type: LessonType.VIDEO, durationMinutes: 30, order: 3 },
          { title: 'N+1 Problem & DataLoader', type: LessonType.VIDEO, durationMinutes: 28, order: 4 },
        ],
      },
      {
        title: 'Apollo Client & React',
        order: 3,
        lessons: [
          { title: 'Apollo Client Setup', type: LessonType.VIDEO, durationMinutes: 18, order: 1 },
          { title: 'useQuery & useMutation Hooks', type: LessonType.VIDEO, durationMinutes: 30, order: 2 },
          { title: 'Real-time with Subscriptions', type: LessonType.VIDEO, durationMinutes: 35, order: 3 },
          { title: 'Cache Management', type: LessonType.VIDEO, durationMinutes: 28, order: 4 },
        ],
      },
    ],
  },
];

async function main() {
  console.log('Seeding demo courses...');

  // ensure admin user exists
  const adminEmail = 'admin@demo.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hash = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: { name: 'Renjith PM', email: adminEmail, passwordHash: hash, role: 'ADMIN' },
    });
    console.log(`Created admin user: ${adminEmail} / Admin@123`);
  }

  for (const data of COURSES) {
    const { modules, ...courseData } = data;

    const existing = await prisma.course.findUnique({ where: { slug: courseData.slug } });
    if (existing) {
      console.log(`Skipping "${courseData.title}" — already exists`);
      continue;
    }

    const course = await prisma.course.create({
      data: {
        ...courseData,
        status: CourseStatus.PUBLISHED,
      },
    });

    for (const mod of modules) {
      const { lessons, ...modData } = mod;
      const createdMod = await prisma.courseModule.create({
        data: { ...modData, courseId: course.id },
      });

      for (const lesson of lessons) {
        await prisma.lesson.create({
          data: {
            ...lesson,
            moduleId: createdMod.id,
            downloadAllowed: false,
            previewEnabled: lesson.previewEnabled ?? false,
          },
        });
      }
    }

    console.log(`Created: ${courseData.title}`);
  }

  console.log('Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
