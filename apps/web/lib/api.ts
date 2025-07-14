import { env } from './env';

const API_BASE_URL = `${env.NEXT_PUBLIC_BASE_URL}/api`;

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    isNew: boolean;
  };
}

export interface User {
  id: string;
  username: string;
}

async function apiRequest<T>({
  endpoint,
  method = 'GET',
  body,
  auth = false,
  parse = 'json',
}: {
  endpoint: string;
  method?: string;
  body?: any;
  auth?: boolean;
  parse?: 'json' | 'text';
}): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return { data: null, error: 'No authentication token' };
      }
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.status === 429) {
      return { data: null, error: 'Too many requests, please try again later.' };
    }
    let data: any;
    if (parse === 'json') {
      data = await response.json();
    } else {
      data = await response.text();
    }
    if (!response.ok) {
      return { data: null, error: data?.message || data?.error || `HTTP error! status: ${response.status}` };
    }
    return { data, error: null };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export class ApiService {
  static async login(username: string): Promise<ApiResponse<LoginResponse>> {
    return apiRequest<LoginResponse>({
      endpoint: '/auth/login',
      method: 'POST',
      body: { username },
    });
  }

  static async getProfile(): Promise<ApiResponse<User>> {
    return apiRequest<User>({
      endpoint: '/auth/me',
      method: 'GET',
      auth: true,
    });
  }

  static async shortenUrl(url: string): Promise<ApiResponse<string>> {
    return apiRequest<string>({
      endpoint: '/urls/shorten',
      method: 'POST',
      body: { url },
      auth: true,
    });
  }

  static async getAllUrlsWithUserFlag(page: number = 1, pageSize: number = 5): Promise<ApiResponse<any>> {
    return apiRequest<any>({
      endpoint: `/urls/all?page=${page}&pageSize=${pageSize}`,
      method: 'GET',
      auth: true,
    });
  }

  static async updateSlug(urlId: string, newSlug: string): Promise<ApiResponse<any>> {
    return apiRequest<any>({
      endpoint: `/urls/update-slug/${urlId}`,
      method: 'PATCH',
      body: { newSlug },
      auth: true,
    });
  }
}
