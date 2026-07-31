'use client';

import * as React from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AdminGuard } from '@/features/learn/components/admin-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories, categoryKeys } from '@/features/learn/hooks/use-categories';
import { categoriesService } from '@/features/learn/services/categories.service';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <Content />
    </AdminGuard>
  );
}

function Content() {
  const { data: categories, isLoading } = useCategories();
  const qc = useQueryClient();

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: (v: FormValues) => categoriesService.create(v),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });

  const { mutateAsync: remove } = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await create(data);
      toast.success('Category created.');
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to create.');
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">Categories</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cat-name">Name</Label>
                <Input id="cat-name" {...register('name')} placeholder="React Fundamentals" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cat-slug">Slug</Label>
                <Input id="cat-slug" {...register('slug')} placeholder="react-fundamentals" />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Input id="cat-desc" {...register('description')} placeholder="Optional" />
            </div>
            <Button type="submit" size="sm" disabled={isCreating}>
              {isCreating ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Plus className="size-4 mr-1.5" />}
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {categories?.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No categories yet.</p>
          )}
          {categories?.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.slug}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive"
                onClick={async () => {
                  if (!confirm(`Delete "${cat.name}"?`)) return;
                  try {
                    await remove(cat.id);
                    toast.success('Deleted.');
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'Delete failed.');
                  }
                }}
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
