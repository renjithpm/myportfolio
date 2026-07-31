import type { Metadata } from 'next';
import { CourseDetailPage } from '@/features/learn/pages/course-detail-page';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, ' '),
  };
}

export default async function CourseSlugPage({ params }: Props) {
  const { slug } = await params;
  return <CourseDetailPage slug={slug} />;
}
