export interface AINews {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  source: string;
  publishedAt: string;
  views: number;
  breaking: boolean;
  trending: boolean;
  image: string;
}

export interface AINewsState {
  news: AINews[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  totalPages: number;
  currentPage: number;
}