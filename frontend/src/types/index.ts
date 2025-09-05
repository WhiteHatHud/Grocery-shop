export interface Post {
  id: number | string;
  title: string;
  summary: string;
  content_md: string;
  type: "recipe" | "tech";
  tags: string[];
  cover_image_url?: string;
  external_links?: string[];
  status: "draft" | "published";
  slug: string;
  pinned? : boolean;
  created_at?: string;
  published_at?: string;
}

export interface CreatePostRequest {
  title: string;
  summary: string;
  content_md: string;
  type: "recipe" | "tech";
  tags: string[];
  cover_image_url?: string;
  external_links?: string[];
  status: "draft" | "published";
  slug: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface PostsListResponse {
  items: Post[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface PostFilters {
  type?: "recipe" | "tech";
  q?: string;
  tag?: string[];
  page?: number;
  page_size?: number;
  sort?: string;
}

export interface User {
  id: string;
  username: string;
}