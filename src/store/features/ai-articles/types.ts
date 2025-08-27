export interface AIArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  views: number;
  featured: boolean;
  image: string;
}

export interface AIArticlesState {
  articles: AIArticle[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  totalPages: number;
  currentPage: number;
}