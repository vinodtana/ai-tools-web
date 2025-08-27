import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatGPTPrompt, ChatGPTPromptsState } from './types';

// Async thunks for API calls
export const fetchChatGPTPrompts = createAsyncThunk(
  'chatgptPrompts/fetchPrompts',
  async (params?: { page?: number; search?: string; category?: string }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/chatgpt-prompts?${new URLSearchParams({
      page: params?.page?.toString() || '1',
      search: params?.search || '',
      category: params?.category || '',
    })}`);
    return response.json();
  }
);

export const fetchPromptById = createAsyncThunk(
  'chatgptPrompts/fetchPromptById',
  async (id: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/chatgpt-prompts/${id}`);
    return response.json();
  }
);

const initialState: ChatGPTPromptsState = {
  prompts: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  totalPages: 1,
  currentPage: 1,
};

const chatgptPromptsSlice = createSlice({
  name: 'chatgptPrompts',
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
      .addCase(fetchChatGPTPrompts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatGPTPrompts.fulfilled, (state, action) => {
        state.loading = false;
        state.prompts = action.payload.prompts || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchChatGPTPrompts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ChatGPT prompts';
      });
  },
});

export const { setSearchTerm, setSelectedCategory, setCurrentPage, clearError } = chatgptPromptsSlice.actions;
export default chatgptPromptsSlice.reducer;