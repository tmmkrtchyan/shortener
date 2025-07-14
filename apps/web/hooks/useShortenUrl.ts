import { ApiService } from '../lib/api';

export async function shortenUrl(url: string): Promise<string | { error: string }> {
  const result = await ApiService.shortenUrl(url);
  if (result.error) {
    return { error: result.error };
  }
  if (result.data) {
    return result.data;
  }
  return { error: 'Invalid response from server.' };
}
