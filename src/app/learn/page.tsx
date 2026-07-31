import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LearnHomePage } from '@/features/learn/pages/home-page';

export const metadata: Metadata = {
  title: 'LearnHub — Learn from the best',
  description: 'Explore premium online courses taught by industry experts.',
};

export default function LearnHome() {
  return <LearnHomePage />;
}
