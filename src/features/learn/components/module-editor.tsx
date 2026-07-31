'use client';

import * as React from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LessonEditor } from './lesson-editor';
import type { CourseFormValues } from '@/features/learn/schemas/course.schema';

interface ModuleEditorProps {
  form: UseFormReturn<CourseFormValues>;
}

export function ModuleEditor({ form }: ModuleEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'modules',
  });

  const [expandedModules, setExpandedModules] = React.useState<Set<number>>(
    () => new Set([0]),
  );

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, moduleIndex) => {
        const isExpanded = expandedModules.has(moduleIndex);
        const lessonCount = form.watch(`modules.${moduleIndex}.lessons`)?.length ?? 0;

        return (
          <div key={field.id} className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 bg-muted/30 px-4 py-3">
              <button
                type="button"
                className="flex flex-1 items-center gap-2 text-left"
                onClick={() => toggleModule(moduleIndex)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? (
                  <ChevronUp className="size-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {form.watch(`modules.${moduleIndex}.title`) || `Module ${moduleIndex + 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lessonCount} lesson{lessonCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-destructive hover:text-destructive flex-shrink-0"
                onClick={() => remove(moduleIndex)}
                aria-label="Remove module"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`module-title-${field.id}`} className="text-xs">
                    Module Title
                  </Label>
                  <Input
                    id={`module-title-${field.id}`}
                    {...form.register(`modules.${moduleIndex}.title`)}
                    placeholder="Module title"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Lessons</Label>
                  <LessonEditor form={form} moduleIndex={moduleIndex} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          append({ title: '', order: fields.length, lessons: [] });
          setExpandedModules((prev) => new Set([...prev, fields.length]));
        }}
      >
        <Plus className="size-4 mr-2" />
        Add Module
      </Button>
    </div>
  );
}
