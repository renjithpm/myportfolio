import type { Metadata } from 'next';
import { CoursePlayerPage } from '@/features/learn/pages/course-player-page';

interface Props {
  params: Promise<{ courseId: string }>;
}

export const metadata: Metadata = { title: 'Course Player' };

export default async function PlayerPage({ params }: Props) {
  const { courseId } = await params;
  return <CoursePlayerPage courseId={courseId} />;
}
