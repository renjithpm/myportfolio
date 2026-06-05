/**
 * Shared, app-wide domain types.
 * Feature-specific types live inside their own feature folder.
 */

export interface NavLink {
  readonly label: string;
  /** In-page anchor (e.g. "#about") or route. */
  readonly href: string;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  /** lucide-react icon name resolved by the consumer. */
  readonly icon: SocialIcon;
}

export type SocialIcon = "github" | "linkedin" | "twitter" | "mail";

export interface SiteConfig {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly ogImage: string;
  readonly author: {
    readonly name: string;
    readonly role: string;
    readonly email: string;
    readonly phone: string;
    readonly location: string;
  };
  readonly keywords: readonly string[];
}
