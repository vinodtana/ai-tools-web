import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIArticle, AIArticlesState } from './types';

// Async thunks for API calls
export const fetchAIArticles = createAsyncThunk(
  'aiArticles/fetchArticles',
  async (params?: { page?: number; search?: string; category?: string }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/ai-articles?${new URLSearchParams({
      page: params?.page?.toString() || '1',
      search: params?.search || '',
      category: params?.category || '',
    })}`);
    return response.json();
  }
);

export const fetchArticleById = createAsyncThunk(
  'aiArticles/fetchArticleById',
  async (id: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/ai-articles/${id}`);
    return response.json();
  }
);

const initialState: AIArticlesState = {
  articles: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  totalPages: 1,
  currentPage: 1,
};

const aiArticlesSlice = createSlice({
  name: 'aiArticles',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAIArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch AI articles';
      });
  },
});

export const { setSearchTerm, setSelectedCategory, setCurrentPage, clearError } = aiArticlesSlice.actions;
export default aiArticlesSlice.reducer;