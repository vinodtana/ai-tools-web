import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIInfluencer, AIInfluencersState } from './types';

// Async thunks for API calls
export const fetchAIInfluencers = createAsyncThunk(
  'aiInfluencers/fetchInfluencers',
  async (params?: { page?: number; search?: string; expertise?: string }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/ai-influencers?${new URLSearchParams({
      page: params?.page?.toString() || '1',
      search: params?.search || '',
      expertise: params?.expertise || '',
    })}`);
    return response.json();
  }
);

export const fetchInfluencerById = createAsyncThunk(
  'aiInfluencers/fetchInfluencerById',
  async (id: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/ai-influencers/${id}`);
    return response.json();
  }
);

const initialState: AIInfluencersState = {
  influencers: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedExpertise: 'All',
  totalPages: 1,
  currentPage: 1,
};

const aiInfluencersSlice = createSlice({
  name: 'aiInfluencers',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedExpertise: (state, action: PayloadAction<string>) => {
      state.selectedExpertise = action.payload;
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
      .addCase(fetchAIInfluencers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        state.influencers = action.payload.influencers || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAIInfluencers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch AI influencers';
      });
  },
});

export const { setSearchTerm, setSelectedExpertise, setCurrentPage, clearError } = aiInfluencersSlice.actions;
export default aiInfluencersSlice.reducer;