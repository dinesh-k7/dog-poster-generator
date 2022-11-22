import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import dogPosterReducer from './features/dog-poster/dogPosterSlice';

const store = configureStore({
  reducer: {
    dogPoster: dogPosterReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
