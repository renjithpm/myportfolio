'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdminGuard } from '@/features/learn/components/admin-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DifficultyBadge } from '@/features/learn/components/difficulty-badge';
import { useAdminCourses } from '@/features/learn/hooks/use-admin';
import { coursesService } from '@/features/learn/services/courses.service';
import { courseKeys } from '@/features/learn/hooks/use-courses';

export function AdminCoursesPage() {
  return (
    <AdminGuard>
      <Content />
    </AdminGuard>
  );
}

function Content() {
  const { data: courses, isLoading } = useAdminCourses();
  const qc = useQueryClient();
  const [search, setSearch] = React.useState('');

  const { mutateAsync: deleteCourse } = useMutation({
    mutationFn: (id: string) => coursesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.adminList() }),
  });

  const { mutateAsync: togglePublish } = useMutation({
    mutationFn: (id: string) => coursesService.publish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.adminList() }),
  });

  const filtered = courses?.filter(
    (c) =>
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button asChild variant="gradient" size="sm">
          <Link href="/learn/admin/courses/new">
            <Plus className="size-4 mr-1.5" />
            New Course
          </Link>
        </Button>
      </div>

      <Input
        placeholder="Search by title or instructor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Students</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No courses found
                </TableCell>
              </TableRow>
            )}
            {filtered?.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {course.thumbnail && (
                      <div className="relative size-10 overflow-hidden rounded flex-shrink-0">
                        <Image
                          src={course.thumbnail}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate max-w-48">{course.title}</p>
                      <p className="text-xs text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DifficultyBadge difficulty={course.difficulty} />
                </TableCell>
                <TableCell className="text-sm">
                  {course.isFree ? (
                    <span className="text-emerald-500 font-medium">Free</span>
                  ) : (
                    `${course.currency} ${course.price}`
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {course._count?.purchases ?? 0}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-8"
                    >
                      <Link href={`/learn/admin/courses/${course.id}/edit`}>
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() =>
                        void togglePublish(course.id).then(() =>
                          toast.success('Status updated.'),
                        )
                      }
                      title={
                        course.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'
                      }
                    >
                      {course.status === 'PUBLISHED' ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                      <span className="sr-only">
                        {course.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (!confirm(`Delete "${course.title}"?`)) return;
                        try {
                          await deleteCourse(course.id);
                          toast.success('Course deleted.');
                        } catch (e) {
                          toast.error(
                            e instanceof Error ? e.message : 'Delete failed.',
                          );
                        }
                      }}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
