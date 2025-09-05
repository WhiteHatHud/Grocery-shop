import { Post, CreatePostRequest, LoginResponse, PostsListResponse, PostFilters } from '@/types';

const API_PREFIX = '/api/v1';
const API_BASE = (import.meta.env.VITE_API_BASE || 'https://wfhubby.onrender.com') + API_PREFIX;

class ApiClient {
  async deletePost(postId: string | number): Promise<void> {
    const response = await fetch(`${API_BASE}/admin/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication required');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to delete post');
    }
  }
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

    async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/admin/upload-image`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication required');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  }

  async pinPost(postId: string | number): Promise<void> {
    const response = await fetch(`${API_BASE}/admin/posts/${postId}/pin`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication required');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to pin post');
    }
  }

  async unpinPost(postId: string | number): Promise<void> {
    const response = await fetch(`${API_BASE}/admin/posts/${postId}/unpin`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Authentication required');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to unpin post');
    }
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }

    return data;
  }


  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeader(),
    });
    localStorage.removeItem('access_token');
  }

  async listPosts(filters: PostFilters = {}): Promise<PostsListResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else if (key === 'sort' && typeof value === 'string') {
          // Transform sort values to match backend expectations
          let sortValue = value;
          switch (value) {
            case '-published_at':
              sortValue = 'newest';
              break;
            case 'published_at':
              sortValue = 'oldest';
              break;
            case 'title':
            case '-title':
              sortValue = 'title';
              break;
            default:
              sortValue = 'newest'; // Default fallback
          }
          searchParams.append(key, sortValue);
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_BASE}/posts?${searchParams}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch posts:', errorText);
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    
    // The backend returns { posts: [...], total, page, page_size, total_pages }
    // Transform it to match PostsListResponse type
    return {
      items: data.posts || [],  // Map "posts" to "items"
      total: data.total || 0,
      page: data.page || 1,
      page_size: data.page_size || 10,
      pages: data.total_pages || 1  // Map "total_pages" to "pages"
    };
  }

  async getPost(idOrSlug: string): Promise<Post> {
    const response = await fetch(`${API_BASE}/posts/${idOrSlug}`);

    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    return response.json();
  }

  async createPost(post: CreatePostRequest): Promise<Post> {
    const response = await fetch(`${API_BASE}/admin/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      if (response.status === 401) {
        await this.logout();
        throw new Error('Authentication required');
      }
      const error = await response.text();
      throw new Error(error || 'Failed to create post');
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export const apiClient = new ApiClient();