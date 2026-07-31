'use client';

import * as React from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { uploadsService } from '@/features/learn/services/uploads.service';

interface UploadFieldProps {
  type: 'image' | 'video' | 'document';
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  accept?: string;
}

export function UploadField({
  type,
  value,
  onChange,
  className,
  accept,
}: UploadFieldProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const defaultAccept = {
    image: 'image/jpeg,image/png,image/webp,image/avif',
    video: 'video/mp4,video/webm',
    document: 'application/pdf',
  }[type];

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadsService[type](file);
      onChange(res.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {value ? (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
          <span className="flex-1 truncate text-sm text-muted-foreground">{value}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => onChange('')}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={cn(
            'flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border',
            'py-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/20',
            'cursor-pointer',
          )}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          aria-label={`Upload ${type}`}
        >
          {isUploading ? (
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="size-8 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">
              {isUploading ? 'Uploading...' : 'Click or drag to upload'}
            </p>
            <p className="text-xs text-muted-foreground">{type.toUpperCase()} file</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept ?? defaultAccept}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
