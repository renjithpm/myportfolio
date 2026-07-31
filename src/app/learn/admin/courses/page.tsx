import type { Metadata } from 'next';
import { AdminCoursesPage } from '@/features/learn/pages/admin-courses-page';

export const metadata: Metadata = { title: 'Manage Courses' };

export default function AdminCourses() {
  return <AdminCoursesPage />;
}
