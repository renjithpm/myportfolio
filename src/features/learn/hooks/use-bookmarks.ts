'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarksService } from '@/features/learn/services/bookmarks.service';

export const bookmarkKeys = {
  all: ['bookmarks'] as const,
};

export function useBookmarks() {
  return useQuery({
    queryKey: bookmarkKeys.all,
    queryFn: bookmarksService.list,
  });
}

export function useToggleBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => bookmarksService.toggle(courseId),
    onMutate: async (courseId) => {
      await qc.cancelQueries({ queryKey: bookmarkKeys.all });
      const prev = qc.getQueryData(bookmarkKeys.all);
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev !== undefined) {
        qc.setQueryData(bookmarkKeys.all, context.prev);
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: bookmarkKeys.all });
    },
  });
}
