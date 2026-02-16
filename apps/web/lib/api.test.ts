import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchApi } from './api';

// Replace the global fetch with a mock we can control
const mockFetch = vi.fn();    // creates a fake version of fetch that we can control
vi.stubGlobal('fetch', mockFetch);  // replaces global fetch with mock fetch so no HTTP request is made during test

describe('fetchApi', () => {
  // Prevents return values bleeding through tests
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call fetch with the correct URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await fetchApi('/api/restaurants');

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl.toString()).toBe('http://localhost:3001/api/restaurants');
  });

  it('should append query params to the URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchApi('/api/restaurants', { q: 'pizza', limit: '10' });

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl.toString()).toBe(
      'http://localhost:3001/api/restaurants?q=pizza&limit=10'
    );
  });

  it('should not append query params when params is undefined', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    await fetchApi('/api/restaurants');

    const calledUrl = mockFetch.mock.calls[0][0];
    expect(calledUrl.toString()).toBe('http://localhost:3001/api/restaurants');
    // Should have no query string at all
    expect(calledUrl.search).toBe('');
  });

  it('should return parsed JSON on success', async () => {
    const mockData = [{ id: '1', name: 'Test Restaurant' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchApi('/api/restaurants');

    expect(result).toEqual(mockData);
  });

  it('should throw an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchApi('/api/restaurants')).rejects.toThrow(
      'API error: 500: Internal Server Error'
    );
  });
});