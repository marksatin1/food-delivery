const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url, {
    cache: 'no-store',
    ...options
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}: ${res.statusText}`);
  }

  return res.json();
}