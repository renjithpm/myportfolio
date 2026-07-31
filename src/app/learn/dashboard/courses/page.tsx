import type { Metadata } from 'next';
import { MyCoursesDashboard } from '@/features/learn/pages/my-courses-page';

export const metadata: Metadata = { title: 'My Courses' };

export default function MyCoursesPage() {
  return <MyCoursesDashboard />;
}
