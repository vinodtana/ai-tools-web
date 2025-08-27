import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './features/contents/contentsSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;