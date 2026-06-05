export interface Project {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly liveUrl?: string;
  readonly repoUrl?: string;
  /** Emoji or short label used in the card's gradient cover. */
  readonly emoji: string;
  readonly featured?: boolean;
}
