import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {SERVER_IP} from "../../../config";
// Async thunks for API calls\\\\

import { post, put, get } from "../../../library/Requests/helpers";

function toQueryParams(obj) {
  return new URLSearchParams(obj).toString();
}
 
export const handleSignupAPI = createAsyncThunk('tools/handleSignupAPI', async (body: any) => {
  return await post(`${SERVER_IP}/auth/signup`, body);
});
export const handleLoginAPI = createAsyncThunk('tools/handleLoginAPI', async (body: any) => {
  return await post(`${SERVER_IP}/auth/signin`, body);
});
export const checkSocialUserAPI = createAsyncThunk('tools/checkSocialUserAPI', async (body: any) => {
  return await post(`${SERVER_IP}/auth/google`, body);
});
export const createClickOut = createAsyncThunk('tools/createClickOut', async (body: any) => {
  return await post(`${SERVER_IP}/clickouts`, body);
});


export const handleLikeContent = createAsyncThunk(
  'tools/handleLikeContent',
  async (body: any) => {
    return await post(`${SERVER_IP}/contents/likes`, body);
  }
);
export const getAllContentLikesByUserId = createAsyncThunk(
  'tools/getAllContentLikesByUserId',
  async (params: any) => {
    const queryString = toQueryParams(params);
    return await get(`${SERVER_IP}/contents/likes/${params?.user_id}?${queryString}`);
  }
);



export const handlePrifileSave = createAsyncThunk('tools/handlePrifileSave', async (body: any) => {
  return await put(`${SERVER_IP}/users/${body?.id}`, body.user);
});


export const fetchCategories= createAsyncThunk(
  'aiContents/fetchCategories',
  async (params: any) => {
    const queryString = toQueryParams(params);
    console.log("params", params);
    const response = await fetch(`${SERVER_IP}/categories/content-categories?${queryString}`);
    return response.json();
  }
);
export const fetchToolCategories= createAsyncThunk(
  'aiContents/fetchToolCategories',
  async (params: any) => {
    const queryString = toQueryParams(params);
    const response = await fetch(`${SERVER_IP}/categories/content-categories?${queryString}`);
    return response.json();
  }
);
export const fetchPromptCategories= createAsyncThunk(
  'aiContents/fetchPromptCategories',
  async (params: any) => {
    const queryString = toQueryParams(params);
    const response = await fetch(`${SERVER_IP}/categories/content-categories?${queryString}`);
    return response.json();
  }
);

export const fetchArticleCategories= createAsyncThunk(
  'aiContents/fetchArticleCategories',
  async (params: any) => {
    const queryString = toQueryParams(params);
    const response = await fetch(`${SERVER_IP}/categories/content-categories?${queryString}`);
    return response.json();
  }
);
export const fetchNewsCategories= createAsyncThunk(
  'aiContents/fetchNewsCategories',
  async (params: any) => {
    const queryString = toQueryParams(params);
    const response = await fetch(`${SERVER_IP}/categories/content-categories?${queryString}`);
    return response.json();
  }
);


export const fetchAITools= createAsyncThunk(
  'aiContents/fetchTools',
  async (params: any, { signal }) => {
    const queryString = toQueryParams(params);
    const response = await fetch(`${SERVER_IP}/contents?type=tools&${queryString}`, { signal });
    return response.json();
  }
);
export const fetchAITopTools= createAsyncThunk(
  'aiContents/fetchAITopTools',
  async (params: any) => {
    const queryString = toQueryParams(params);
    console.log("params", params);
    const response = await fetch(`${SERVER_IP}/contents?display_order=10&type=tools&${queryString}`);
    return response.json();
  }
);
export const fetchAIPromots= createAsyncThunk(
  'aiContents/fetchAIPromots',
  async (params: any) => {
    const queryString = toQueryParams(params);
    console.log("params", params);
    const response = await fetch(`${SERVER_IP}/contents?type=prompts&${queryString}`);
    return response.json();
  }
);
export const fetchAIArticles= createAsyncThunk(
  'aiContents/fetchAIArticles',
  async (params: any) => {
    const queryString = toQueryParams(params);
    console.log("params", params);
    const response = await fetch(`${SERVER_IP}/contents?type=articles&${queryString}`);
    return response.json();
  }
);

export const fetchAINews= createAsyncThunk(
  'aiContents/fetchAINews',
  async (params: any) => {
    const queryString = toQueryParams(params);
    console.log("params", params);
    const response = await fetch(`${SERVER_IP}/contents?type=news&${queryString}`);
    return response.json();
  }
);
export const fetchAIInfluencers= createAsyncThunk(
  'aiContents/fetchAIInfluencers',
  async (params: any) => {
    const queryString = toQueryParams(params);
    console.log("params", params);
    const response = await fetch(`${SERVER_IP}/contents?type=influencers&${queryString}`);
    return response.json();
  }
);
export const fetchACategoryDetails= createAsyncThunk(
  'aiContents/fetchACategoryDetails',
  async (id: any) => {
    const response = await fetch(`${SERVER_IP}/categoryDetails/${id}`);
    return response.json();
  }
);
export const SubscribeNewsletter = createAsyncThunk('tools/SubscribeNewsletter', async (body: any) => {
  return await post(`${SERVER_IP}/newsletters`, body);
});
// 
export const getInTouchAPI = createAsyncThunk('tools/getInTouchAPI', async (body: any) => {
  return await post(`${SERVER_IP}/getintouch`, body);
});

export const fetchAIToolDetails = createAsyncThunk(
  'aiContents/fetchAIToolDetails',
  async (id: string) => {
    const response = await fetch(`${SERVER_IP}/contents/${id}`);
    return response.json();
  }
);

export const fetchComments = createAsyncThunk(
  'aiContents/fetchComments',
  async (params: any) => {
    const queryString = toQueryParams(params);
    return await get(`${SERVER_IP}/contents/comments?${queryString}`);
  }
);

export const addComment = createAsyncThunk(
  'aiContents/addComment',
  async (body: any) => {
    // If there is media, upload it first
    if (body.media instanceof File) {
        try {
            const fileName = `${Date.now()}-${body.media.name.replace(/\s+/g, '-')}`;
            const fileType = body.media.type;
            
            // 1. Get Presigned URL
            const presignedResponse = await post(`${SERVER_IP}/contents/get-presigned-url`, {
                fileName,
                fileType
            });
            
            if (presignedResponse?.url) {
                // 2. Upload to S3
                // We use fetch directly here to avoid default headers from axios/helpers
                const uploadResponse = await fetch(presignedResponse.url, {
                    method: 'PUT',
                    body: body.media,
                    headers: {
                        'Content-Type': fileType
                    }
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload media');
                }
                
                // 3. Set media_url
                // Assuming standard S3 URL format. Adjust if using CloudFront or different structure.
                body.media_url = `https://topaitools-images.s3.ap-south-1.amazonaws.com/${fileName}`;
                body.media_type = fileType;
            }
        } catch (error) {
            console.error("Media upload failed:", error);
            // Optionally throw or continue without media
            // throw error; 
        }
        delete body.media;
    }
    return await post(`${SERVER_IP}/contents/comments`, body);
  }
);

export const likeComment = createAsyncThunk(
  'aiContents/likeComment',
  async (body: any) => {
    return await post(`${SERVER_IP}/contents/comments/like`, body);
  }
);

const userData: string | null = localStorage.getItem("user");


const initialState: any = {
  user: userData !== null ? JSON.parse(userData) : {},
  token: localStorage.getItem('token'),
  aiTools: [],
  aiToolsPagination:{},
  showLoginModel: false,
  aIPromots: [],
  aIArticles: [],
  aINews: [],
  aiInfluencers: [],
  cDetails: {},
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  totalPages: 1,
  currentPage: 1,
  aiCategories: [],
  toolCategories: [],
  promptCategories: [],
  articleCategories: [],
  newsCategories: [],
  userContentLikes: [],
  comments: [],
  topAITools: [],
};


const aiContentsSlice = createSlice({
  name: 'aiContents',
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
    setUpdateUserData: (state, action: PayloadAction<number>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    setShowLoginModel: (state, action: PayloadAction<boolean>) => {
      state.showLoginModel= action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(handleLoginAPI.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(handleLoginAPI.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log('Login successful:', action.payload);
      const uData = {...action.payload?.data?.user, token: action.payload?.data.token};
      state.user = uData;
      state.token = action.payload?.data.token;
      localStorage.setItem('user', JSON.stringify(uData));
      localStorage.setItem('token', action.payload?.data.token);
    })
    .addCase(handleLoginAPI.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Login failed';
      state.isAuthenticated = false;
    })
    .addCase(handleSignupAPI.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(handleSignupAPI.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log('Login successful:', action.payload);
      const uData = {...action.payload?.data?.user, token: action.payload?.data.token};
      state.user = uData;
      state.token = action.payload?.data.token;
      localStorage.setItem('user', JSON.stringify(uData));
      localStorage.setItem('token', action.payload?.data.token);
    })
    .addCase(handleSignupAPI.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Login failed';
      state.isAuthenticated = false;
    })
    .addCase(checkSocialUserAPI.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log('Login successful:', action.payload);
      const uData = {...action.payload?.data?.user, token: action.payload?.data.token};
      state.user = uData;
      state.token = action.payload?.data.token;
      localStorage.setItem('user', JSON.stringify(uData));
      localStorage.setItem('token', action.payload?.data.token);
    })
    .addCase(checkSocialUserAPI.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Login failed';
      state.isAuthenticated = false;
    })
    
      .addCase(fetchAITools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAITools.fulfilled, (state, action) => {
        state.loading = false;
        state.aiTools = action.payload.data || [];
        console.log("action.payload", action.payload);
        state.aiToolsPagination = action.payload.pagination || 1;
      })
      
      .addCase(fetchAITools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch AI tools';
      })
      .addCase(fetchAIPromots.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload.data", action.payload.data);
        state.aIPromots = action.payload.data || [];
      })
      .addCase(fetchAIArticles.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload.data", action.payload.data);
        state.aIArticles = action.payload.data || [];
      })
      .addCase(fetchAINews.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload.data", action.payload.data);
        state.aINews = action.payload.data || [];
      })
      .addCase(fetchAIInfluencers.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload.data", action.payload.data);
        state.aiInfluencers = action.payload.data || [];
      })
      
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.aiCategories = action.payload.data || [];
      })
       .addCase(fetchToolCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.toolCategories = action.payload.data || [];
      })
       .addCase(fetchPromptCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.promptCategories = action.payload.data || [];
      })
       .addCase(fetchArticleCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.articleCategories = action.payload.data || [];
      })
      .addCase(fetchNewsCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.newsCategories = action.payload.data || [];
      })
      .addCase(fetchAIToolDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.cDetails = action.payload.data || {};
      })
      .addCase(getAllContentLikesByUserId.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action.payload", action.payload);
        state.userContentLikes = action.payload.data?.items || [];
      })
      .addCase(fetchAITopTools.fulfilled, (state, action) => {
        state.loading = false;
        state.topAITools = action.payload.data || [];
      })
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data || [];
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        console.error("fetchComments failed", action.error);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        // Optimistic update or re-fetch can be triggered in component
        // But if backend returns the new comment, we can push it
        if (action.payload.success && action.payload.data) {
           // If it's a top level comment, push to list. If reply, we might need complex logic.
           // For simplicity, we might just rely on re-fetching in the component, or basic push if simple.
           // Let's rely on component re-fetching for now to ensure consistency, 
           // but we can also append if we want instant feedback.
        }
      })
      
      
      
  },
});

export const { setSearchTerm, setSelectedCategory, setCurrentPage, clearError, setUpdateUserData , setShowLoginModel} = aiContentsSlice.actions;
export default aiContentsSlice.reducer;
