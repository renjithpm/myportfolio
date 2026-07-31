import type { Metadata } from 'next';
import { BookmarksPage } from '@/features/learn/pages/bookmarks-page';

export const metadata: Metadata = { title: 'Bookmarks' };

export default function Bookmarks() {
  return <BookmarksPage />;
}
