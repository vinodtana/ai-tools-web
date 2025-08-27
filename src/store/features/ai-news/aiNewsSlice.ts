import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AINews, AINewsState } from './types';

// Async thunks for API calls
export const fetchAINews = createAsyncThunk(
  'aiNews/fetchNews',
  async (params?: { page?: number; search?: string; category?: string }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/ai-news?${new URLSearchParams({
      page: params?.page?.toString() || '1',
      search: params?.search || '',
      category: params?.category || '',
    })}`);
    return response.json();
  }
);

export const fetchNewsById = createAsyncThunk(
  'aiNews/fetchNewsById',
  async (id: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/ai-news/${id}`);
    return response.json();
  }
);

const initialState: AINewsState = {
  news: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  totalPages: 1,
  currentPage: 1,
};

const aiNewsSlice = createSlice({
  name: 'aiNews',
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
      .addCase(fetchAINews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAINews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.news || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAINews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch AI news';
      });
  },
});

export const { setSearchTerm, setSelectedCategory, setCurrentPage, clearError } = aiNewsSlice.actions;
export default aiNewsSlice.reducer;