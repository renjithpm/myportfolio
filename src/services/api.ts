import type { ContactFormValues } from '@/features/contact/schema';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001') + '/api/v1';

export async function submitContact(data: ContactFormValues): Promise<void> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(body.message ?? 'Failed to send your message. Please try again.');
  }
}

export async function getGithubContributions() {
  const res = await fetch(`${API_BASE}/github/contributions`, {
    next: { revalidate: 21600 },
  });

  if (!res.ok) throw new Error('Failed to fetch GitHub contributions');
  return res.json();
}
