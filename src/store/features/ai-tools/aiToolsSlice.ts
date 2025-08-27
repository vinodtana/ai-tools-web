import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AITool, AIToolsState } from './types';
import {SERVER_IP} from "./../../../config";
// Async thunks for API calls
function toQueryParams(obj) {
  return new URLSearchParams(obj).toString();
}


export const fetchAITools = createAsyncThunk(
  'aiTools/fetchTools',
  async (params: any) => {
    // TODO: Replace with actual API call
    const queryString = toQueryParams(params);

    const response = await fetch(`${SERVER_IP}/contents?${queryString}`);
    return response.json();
  }
);

export const fetchAIToolById = createAsyncThunk(
  'aiTools/fetchToolById',
  async (id: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/ai-tools/${id}`);
    return response.json();
  }
);

const initialState: AIToolsState = {
  tools: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  totalPages: 1,
  currentPage: 1,
};

const aiToolsSlice = createSlice({
  name: 'aiTools',
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
      .addCase(fetchAITools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAITools.fulfilled, (state, action) => {
        state.loading = false;
        state.tools = action.payload.tools || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAITools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch AI tools';
      });
  },
});

export const { setSearchTerm, setSelectedCategory, setCurrentPage, clearError } = aiToolsSlice.actions;
export default aiToolsSlice.reducer;