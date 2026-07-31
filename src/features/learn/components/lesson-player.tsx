'use client';

import * as React from 'react';
import { ExternalLink, Download, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Lesson } from '@/features/learn/types';

interface LessonPlayerProps {
  lesson: Lesson;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  if (!lesson.resourceUrl && lesson.type !== 'ARTICLE') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-muted/30 p-12 text-center">
        <AlertCircle className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium">Content not available</p>
          <p className="text-sm text-muted-foreground mt-1">
            This lesson content will be available soon.
          </p>
        </div>
      </div>
    );
  }

  switch (lesson.type) {
    case 'VIDEO':
      return (
        <div className="overflow-hidden rounded-xl bg-black aspect-video">
          <video
            key={lesson.id}
            src={lesson.resourceUrl}
            controls
            className="w-full h-full"
            controlsList={lesson.downloadAllowed ? undefined : 'nodownload'}
          >
            Your browser does not support the video element.
          </video>
        </div>
      );

    case 'PDF':
      return (
        <div className="overflow-hidden rounded-xl border border-border" style={{ height: '70vh' }}>
          <iframe
            src={`${lesson.resourceUrl}#view=FitH`}
            title={lesson.title}
            className="w-full h-full"
          />
        </div>
      );

    case 'ARTICLE':
      return (
        <div className="rounded-xl border border-border bg-card p-6 prose prose-neutral dark:prose-invert max-w-none">
          {lesson.description ? (
            <div
              dangerouslySetInnerHTML={{ __html: lesson.description }}
            />
          ) : (
            <p className="text-muted-foreground">No content provided for this lesson.</p>
          )}
        </div>
      );

    case 'DOWNLOADABLE':
      return (
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="size-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">{lesson.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Download the file to access this content.
            </p>
          </div>
          <Button asChild variant="default">
            <a href={lesson.resourceUrl} download>
              <Download className="size-4 mr-2" />
              Download File
            </a>
          </Button>
        </div>
      );

    case 'EXTERNAL_LINK':
      return (
        <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <ExternalLink className="size-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">{lesson.title}</p>
            <p className="text-sm text-muted-foreground mt-1">
              This lesson opens an external resource.
            </p>
          </div>
          <Button asChild variant="outline">
            <a href={lesson.resourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4 mr-2" />
              Open Resource
            </a>
          </Button>
        </div>
      );
  }
}
