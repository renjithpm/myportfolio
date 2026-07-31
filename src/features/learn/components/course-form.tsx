'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadField } from './upload-field';
import { ModuleEditor } from './module-editor';
import { courseSchema, type CourseFormValues } from '@/features/learn/schemas/course.schema';
import { coursesService } from '@/features/learn/services/courses.service';
import { courseKeys } from '@/features/learn/hooks/use-courses';
import { useCategories } from '@/features/learn/hooks/use-categories';
import type { Course } from '@/features/learn/types';

interface CourseFormProps {
  initialData?: Course;
}

const STEPS = [
  { label: 'Details' },
  { label: 'Content' },
  { label: 'Pricing' },
] as const;

const STEP_REQUIRED_FIELDS: Record<number, (keyof CourseFormValues)[]> = {
  0: ['title', 'description', 'instructor', 'difficulty'],
  1: [],
  2: ['price', 'currency'],
};

const SET_OPTS = { shouldValidate: true, shouldDirty: true } as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: categories } = useCategories();
  const isEdit = !!initialData;

  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    mode: 'onChange',
    defaultValues: initialData
      ? {
          title: initialData.title,
          subtitle: initialData.subtitle ?? '',
          description: initialData.description,
          shortDescription: initialData.shortDescription ?? '',
          instructor: initialData.instructor,
          difficulty: initialData.difficulty,
          durationHours: initialData.durationHours,
          language: initialData.language,
          price: initialData.price,
          discountPrice: initialData.discountPrice,
          currency: initialData.currency,
          isFree: initialData.isFree,
          isFeatured: initialData.isFeatured,
          isBestseller: initialData.isBestseller,
          categoryId: initialData.categoryId ?? '',
          thumbnail: initialData.thumbnail ?? '',
          bannerImage: initialData.bannerImage ?? '',
          modules: initialData.modules.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description ?? '',
            order: m.order,
            lessons: m.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              description: l.description ?? '',
              type: l.type,
              durationMinutes: l.durationMinutes ?? 0,
              resourceUrl: l.resourceUrl ?? '',
              downloadAllowed: l.downloadAllowed,
              previewEnabled: l.previewEnabled,
              order: l.order,
            })),
          })),
        }
      : {
          title: '',
          subtitle: '',
          description: '',
          shortDescription: '',
          instructor: '',
          difficulty: 'BEGINNER',
          durationHours: 0,
          language: 'English',
          price: 0,
          discountPrice: undefined,
          currency: 'AED',
          isFree: false,
          isFeatured: false,
          isBestseller: false,
          categoryId: '',
          thumbnail: '',
          bannerImage: '',
          modules: [],
        },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: CourseFormValues) =>
      isEdit && initialData
        ? coursesService.update(initialData.id, data)
        : coursesService.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: courseKeys.all });
      void qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const onSubmit = async (data: CourseFormValues) => {
    try {
      await mutateAsync(data);
      toast.success(isEdit ? 'Course updated.' : 'Course created.');
      router.push('/learn/admin/courses');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save course.');
    }
  };

  const handleFinalSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) {
      const errors = form.formState.errors;
      const firstKey = Object.keys(errors)[0];
      const firstErr = firstKey ? (errors as Record<string, { message?: string }>)[firstKey] : null;
      toast.error(
        firstKey
          ? `"${firstKey}" — ${firstErr?.message ?? 'invalid value'}`
          : 'Please fill in all required fields.',
      );
      return;
    }
    // Parse through Zod to coerce number strings → actual numbers
    const parsed = courseSchema.safeParse(form.getValues());
    if (!parsed.success) {
      toast.error('Validation error — check all fields and try again.');
      return;
    }
    await onSubmit(parsed.data);
  };

  const goNext = async () => {
    const fields = STEP_REQUIRED_FIELDS[step];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (!valid) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const err = form.formState.errors;

  return (
    <div className="space-y-8">
      {/* ── Stepper ──────────────────────────────────────────────── */}
      <nav aria-label="Form steps" className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    'flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300',
                    done
                      ? 'border-primary bg-primary text-primary-foreground'
                      : active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground',
                  ].join(' ')}
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </div>
                <span
                  className={[
                    'text-xs font-medium transition-colors',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {s.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={[
                    'mb-5 h-px flex-1 mx-3 transition-all duration-300',
                    i < step ? 'bg-primary' : 'bg-border',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* ── Step content ─────────────────────────────────────────── */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* ── Step 0: Details ──────────────────────── */}
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold">Basic Details</h2>
                    <p className="text-sm text-muted-foreground">
                      Fields marked <span className="text-destructive font-medium">*</span> are required.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="title">
                        Title <span className="text-destructive">*</span>
                      </Label>
                      <Input id="title" {...form.register('title')} placeholder="e.g. Complete React Developer Course" />
                      {err.title && <p className="text-xs text-destructive">{err.title.message}</p>}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input id="subtitle" {...form.register('subtitle')} placeholder="One-line course tagline" />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="description">
                        Description <span className="text-destructive">*</span>
                        <span className="ml-1.5 text-xs font-normal text-muted-foreground">min 20 chars</span>
                      </Label>
                      <Textarea
                        id="description"
                        {...form.register('description')}
                        placeholder="What will students learn? What does the course cover?"
                        rows={5}
                      />
                      {err.description && <p className="text-xs text-destructive">{err.description.message}</p>}
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="shortDescription">Short Description</Label>
                      <Textarea
                        id="shortDescription"
                        {...form.register('shortDescription')}
                        placeholder="Brief summary shown on course cards (max 200 chars)"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="instructor">
                        Instructor <span className="text-destructive">*</span>
                      </Label>
                      <Input id="instructor" {...form.register('instructor')} placeholder="Instructor full name" />
                      {err.instructor && <p className="text-xs text-destructive">{err.instructor.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>
                        Difficulty <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={form.watch('difficulty')}
                        onValueChange={(v) =>
                          form.setValue('difficulty', v as CourseFormValues['difficulty'], SET_OPTS)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="durationHours">Duration (hours)</Label>
                      <Input
                        id="durationHours"
                        type="number"
                        min={0}
                        step={0.5}
                        {...form.register('durationHours')}
                        placeholder="e.g. 8.5"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Category</Label>
                      <Select
                        value={form.watch('categoryId') ?? ''}
                        onValueChange={(v) => form.setValue('categoryId', v, SET_OPTS)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No category</SelectItem>
                          {categories?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Thumbnail</Label>
                      <UploadField
                        type="image"
                        value={form.watch('thumbnail') ?? ''}
                        onChange={(url) => form.setValue('thumbnail', url, SET_OPTS)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Banner Image</Label>
                      <UploadField
                        type="image"
                        value={form.watch('bannerImage') ?? ''}
                        onChange={(url) => form.setValue('bannerImage', url, SET_OPTS)}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        id="isFeatured"
                        checked={form.watch('isFeatured')}
                        onCheckedChange={(v) => form.setValue('isFeatured', v, SET_OPTS)}
                      />
                      <Label htmlFor="isFeatured" className="cursor-pointer">Featured course</Label>
                    </div>

                    <div className="flex items-center gap-3">
                      <Switch
                        id="isBestseller"
                        checked={form.watch('isBestseller')}
                        onCheckedChange={(v) => form.setValue('isBestseller', v, SET_OPTS)}
                      />
                      <Label htmlFor="isBestseller" className="cursor-pointer">Mark as bestseller</Label>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1: Content ──────────────────────── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold">Course Content</h2>
                    <p className="text-sm text-muted-foreground">
                      Add modules and lessons. You can always edit content later.
                    </p>
                  </div>
                  <ModuleEditor form={form} />
                </div>
              )}

              {/* ── Step 2: Pricing ──────────────────────── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-semibold">Pricing</h2>
                    <p className="text-sm text-muted-foreground">
                      Set the course price. Toggle free to offer it at no cost.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex items-center gap-3 sm:col-span-2 rounded-lg border border-border bg-muted/40 px-4 py-3">
                      <Switch
                        id="isFree"
                        checked={form.watch('isFree')}
                        onCheckedChange={(v) => form.setValue('isFree', v, SET_OPTS)}
                      />
                      <div>
                        <Label htmlFor="isFree" className="cursor-pointer font-medium">Free course</Label>
                        <p className="text-xs text-muted-foreground">Students can enroll without paying</p>
                      </div>
                    </div>

                    {!form.watch('isFree') && (
                      <>
                        <div className="space-y-1.5">
                          <Label htmlFor="price">
                            Price <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              {form.watch('currency') || 'AED'}
                            </span>
                            <Input
                              id="price"
                              type="number"
                              min={0}
                              step={0.01}
                              className="pl-12"
                              {...form.register('price')}
                              placeholder="0.00"
                            />
                          </div>
                          {err.price && <p className="text-xs text-destructive">{err.price.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="discountPrice">Discount Price</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                              {form.watch('currency') || 'AED'}
                            </span>
                            <Input
                              id="discountPrice"
                              type="number"
                              min={0}
                              step={0.01}
                              className="pl-12"
                              {...form.register('discountPrice')}
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="currency">
                            Currency <span className="text-destructive">*</span>
                            <span className="ml-1.5 text-xs font-normal text-muted-foreground">3-letter ISO code</span>
                          </Label>
                          <Input
                            id="currency"
                            {...form.register('currency')}
                            placeholder="AED"
                            maxLength={3}
                            className="uppercase"
                          />
                          {err.currency && <p className="text-xs text-destructive">{err.currency.message}</p>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Navigation ───────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-border pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={step === 0 ? () => router.push('/learn/admin/courses') : goBack}
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Step {step + 1} of {STEPS.length}
            </span>

            {step < STEPS.length - 1 ? (
              <Button type="button" variant="gradient" onClick={goNext}>
                Continue →
              </Button>
            ) : (
              <Button
                type="button"
                variant="gradient"
                disabled={isPending}
                onClick={() => void handleFinalSubmit()}
              >
                {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
                {isEdit ? 'Update Course' : 'Create Course'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
