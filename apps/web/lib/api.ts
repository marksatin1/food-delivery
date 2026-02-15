const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}: ${res.statusText}`);
  }

  return res.json();
}