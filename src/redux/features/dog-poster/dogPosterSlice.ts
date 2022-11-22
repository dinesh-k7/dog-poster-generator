/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { BASE_URL } from '../../../constants';
import {
  Breeds,
  BreedImage,
  State,
  FetchImagesError,
  SubBreedPoster,
} from './types';
import { RootState } from '../../store';

const initialState: State = {
  breeds: [] as Breeds[],
  breedImages: [] as BreedImage[],
  status: 'idle',
  error: '',
};

export const getBreeds = createAsyncThunk('dogs/getBreeds', async () => {
  const url = `${BASE_URL}/breeds/list/all`;
  try {
    const result = await axios.get(url);
    return result?.data;
  } catch (error) {
    return error;
  }
});

export const fetchBreedPosters = createAsyncThunk<
  BreedImage,
  string,
  { rejectValue: FetchImagesError }
>('dogs/getPoster', async (name, thunkApi) => {
  const url = `${BASE_URL}/breed/${name}/images`;
  try {
    const result = await axios.get(url);

    return {
      name,
      images: result.data && result.data.message,
    };
  } catch (error) {
    return thunkApi.rejectWithValue({
      message: `Failed to fetch poster for the Breed: ${name}`,
    });
  }
});

export const fetchSubBreedPosters = createAsyncThunk<
  BreedImage,
  SubBreedPoster,
  { rejectValue: FetchImagesError }
>('dogs/getSubBreedPoster', async (subBreedDetail, thunkApi): Promise<any> => {
  const { breedName, subBreedName } = subBreedDetail;
  const url = `${BASE_URL}/breed/${breedName}/${subBreedName}/images`;
  try {
    const result = await axios.get(url);
    return {
      name: subBreedName,
      images: result.data && result.data.message,
    };
  } catch (error) {
    return thunkApi.rejectWithValue({
      message: `Failed to fetch poster for the Breed: ${subBreedName}`,
    });
  }
});

export const dogPosterSlice = createSlice({
  name: 'dogPoster',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get breeds status
    builder.addCase(getBreeds.pending, (state) => {
      state.status = 'loading';
      state.error = '';
    });

    builder.addCase(getBreeds.fulfilled, (state, { payload }) => {
      const { message } = payload || {};
      if (message && Object.keys(message).length) {
        const breeds = Object.keys(message).map((dog, index) => {
          return { id: index + 1, name: dog, subBreeds: message[dog] };
        });
        state.breeds.push(...breeds);
        state.status = 'idle';
      }
    });

    builder.addCase(getBreeds.rejected, (state) => {
      state.error = 'Error in fetching Breeds';
      state.status = 'idle';
    });

    builder.addCase(fetchBreedPosters.pending, (state) => {
      state.status = 'loading';
      state.error = '';
    });

    builder.addCase(fetchBreedPosters.fulfilled, (state, { payload }) => {
      if (payload && Object.keys(payload).length) {
        const findIndex = state.breedImages.findIndex(
          (breed) => breed.name === payload.name,
        );
        if (findIndex !== -1) {
          state.breedImages[findIndex] = payload;
        } else {
          state.breedImages.push(payload);
        }
        state.status = 'idle';
      }
    });

    builder.addCase(fetchBreedPosters.rejected, (state, { payload }) => {
      state.status = 'idle';
      state.error = payload?.message;
    });

    builder.addCase(fetchSubBreedPosters.pending, (state) => {
      state.status = 'loading';
      state.error = '';
    });

    builder.addCase(fetchSubBreedPosters.fulfilled, (state, { payload }) => {
      if (payload && Object.keys(payload).length) {
        const findIndex = state.breedImages.findIndex(
          (breed) => breed.name === payload.name,
        );
        if (findIndex !== -1) {
          state.breedImages[findIndex] = payload;
        } else {
          state.breedImages.push(payload);
        }
        state.status = 'idle';
      }
    });

    builder.addCase(fetchSubBreedPosters.rejected, (state, { payload }) => {
      state.status = 'idle';
      state.error = payload?.message;
    });
  },
});

export default dogPosterSlice.reducer;
export const selectAllBreeds = (state: RootState) => state.dogPoster.breeds;
export const getDogPosterError = (state: RootState) => state.dogPoster.error;
export const getDogPosterStatus = (state: RootState) => state.dogPoster.status;
export const getBreedPosters = (state: RootState) =>
  state.dogPoster.breedImages;
