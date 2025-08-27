export interface ChatGPTPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  tags: string[];
  rating: number;
  likes: number;
  uses: number;
  author: string;
  featured: boolean;
  createdAt: string;
}

export interface ChatGPTPromptsState {
  prompts: ChatGPTPrompt[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  totalPages: number;
  currentPage: number;
}