export interface AITool {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  rating: number;
  pricing: string;
  website: string;
  logo: string;
  featured: boolean;
  uses: number;
  likes: number;
}

export interface AIToolsState {
  tools: AITool[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  totalPages: number;
  currentPage: number;
}