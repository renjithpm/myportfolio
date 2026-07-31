import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

const CACHE_KEY = 'github:contributions';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionsPayload {
  username: string;
  total: number;
  weeks: ContributionWeek[];
  fetchedAt: string;
}

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getContributions(): Promise<ContributionsPayload> {
    const cached = await this.getFromCache();
    if (cached) return cached as ContributionsPayload;

    const fresh = await this.fetchFromGithub();
    await this.setCache(fresh);
    return fresh;
  }

  private async getFromCache(): Promise<unknown | null> {
    const entry = await this.prisma.cacheEntry.findUnique({
      where: { key: CACHE_KEY },
    });
    if (!entry || entry.expiresAt < new Date()) return null;
    return entry.data;
  }

  private async setCache(data: ContributionsPayload): Promise<void> {
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS);
    await this.prisma.cacheEntry.upsert({
      where: { key: CACHE_KEY },
      update: { data: data as object, expiresAt },
      create: { key: CACHE_KEY, data: data as object, expiresAt },
    });
  }

  private async fetchFromGithub(): Promise<ContributionsPayload> {
    const username = this.config.get<string>('GITHUB_USERNAME') ?? 'renjithpm';
    const token = this.config.get<string>('GITHUB_TOKEN');

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      { headers },
    );

    if (!response.ok) {
      this.logger.warn(`GitHub API responded ${response.status} — returning empty data`);
      return this.emptyPayload(username);
    }

    const events = (await response.json()) as Array<{
      type: string;
      created_at: string;
      payload?: { commits?: unknown[] };
    }>;

    const countsByDate: Record<string, number> = {};
    for (const event of events) {
      if (event.type !== 'PushEvent') continue;
      const date = event.created_at.slice(0, 10);
      const commits = event.payload?.commits?.length ?? 1;
      countsByDate[date] = (countsByDate[date] ?? 0) + commits;
    }

    const weeks = this.buildWeeks(countsByDate);
    const total = Object.values(countsByDate).reduce((s, c) => s + c, 0);

    return { username, total, weeks, fetchedAt: new Date().toISOString() };
  }

  private buildWeeks(countsByDate: Record<string, number>): ContributionWeek[] {
    const days: ContributionDay[] = [];
    const now = new Date();

    for (let i = 364; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      const count = countsByDate[date] ?? 0;
      const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;
      days.push({ date, count, level: level as ContributionDay['level'] });
    }

    const weeks: ContributionWeek[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push({ days: days.slice(i, i + 7) });
    }
    return weeks;
  }

  private emptyPayload(username: string): ContributionsPayload {
    return { username, total: 0, weeks: [], fetchedAt: new Date().toISOString() };
  }
}
