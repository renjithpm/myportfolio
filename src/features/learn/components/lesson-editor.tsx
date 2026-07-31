'use client';

import * as React from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, GripVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UploadField } from './upload-field';
import type { CourseFormValues } from '@/features/learn/schemas/course.schema';

interface LessonEditorProps {
  form: UseFormReturn<CourseFormValues>;
  moduleIndex: number;
}

const LESSON_TYPES = [
  { value: 'VIDEO', label: 'Video' },
  { value: 'PDF', label: 'PDF' },
  { value: 'ARTICLE', label: 'Article' },
  { value: 'DOWNLOADABLE', label: 'Downloadable' },
  { value: 'EXTERNAL_LINK', label: 'External Link' },
] as const;

export function LessonEditor({ form, moduleIndex }: LessonEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `modules.${moduleIndex}.lessons`,
  });

  return (
    <div className="space-y-3">
      {fields.map((field, lessonIndex) => {
        const prefix = `modules.${moduleIndex}.lessons.${lessonIndex}` as const;
        const lessonType = form.watch(`${prefix}.type`);

        return (
          <div key={field.id} className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <GripVertical className="size-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-medium text-muted-foreground flex-1">
                Lesson {lessonIndex + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-destructive hover:text-destructive"
                onClick={() => remove(lessonIndex)}
                aria-label="Remove lesson"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs">Title</Label>
                <Input
                  {...form.register(`${prefix}.title`)}
                  placeholder="Lesson title"
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select
                  value={form.watch(`${prefix}.type`)}
                  onValueChange={(v) =>
                    form.setValue(`${prefix}.type`, v as CourseFormValues['modules'][0]['lessons'][0]['type'])
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Duration (minutes)</Label>
                <Input
                  type="number"
                  min={0}
                  {...form.register(`${prefix}.durationMinutes`)}
                  placeholder="0"
                  className="h-8 text-sm"
                />
              </div>

              {(lessonType === 'VIDEO' || lessonType === 'PDF' || lessonType === 'DOWNLOADABLE') && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">File</Label>
                  <UploadField
                    type={lessonType === 'VIDEO' ? 'video' : 'document'}
                    value={form.watch(`${prefix}.resourceUrl`) ?? ''}
                    onChange={(url) => form.setValue(`${prefix}.resourceUrl`, url)}
                  />
                </div>
              )}

              {lessonType === 'EXTERNAL_LINK' && (
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">URL</Label>
                  <Input
                    {...form.register(`${prefix}.resourceUrl`)}
                    placeholder="https://..."
                    className="h-8 text-sm"
                    type="url"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Switch
                  id={`preview-${field.id}`}
                  checked={form.watch(`${prefix}.previewEnabled`)}
                  onCheckedChange={(v) => form.setValue(`${prefix}.previewEnabled`, v)}
                />
                <Label htmlFor={`preview-${field.id}`} className="text-xs cursor-pointer">
                  Free preview
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id={`download-${field.id}`}
                  checked={form.watch(`${prefix}.downloadAllowed`)}
                  onCheckedChange={(v) => form.setValue(`${prefix}.downloadAllowed`, v)}
                />
                <Label htmlFor={`download-${field.id}`} className="text-xs cursor-pointer">
                  Allow download
                </Label>
              </div>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() =>
          append({
            title: '',
            type: 'VIDEO',
            downloadAllowed: false,
            previewEnabled: false,
            order: fields.length,
          })
        }
      >
        <Plus className="size-4 mr-1.5" />
        Add Lesson
      </Button>
    </div>
  );
}
