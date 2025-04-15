import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Meme } from '@/types';
import { memes } from '@/constants/memes';

const memesAdapter = createEntityAdapter<Meme>();
const initialState = memesAdapter.getInitialState({
  status: 'idle',
  error: null,
});

const prepopulatedState = memesAdapter.upsertMany(initialState, memes);

const memeSlice = createSlice({
  name: 'memes',
  initialState: prepopulatedState,
  reducers: {
    updateMeme: memesAdapter.updateOne,
    addMeme: memesAdapter.addOne,
    removeMeme: memesAdapter.removeOne,
    incrementLikes: (state, action: PayloadAction<number>) => {
      const meme = state.entities[action.payload];
      if (!meme) return;
      meme.likes += 1;
    },
    rehydrateMemes: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

export const {
  updateMeme,
  addMeme,
  removeMeme,
  incrementLikes,
  rehydrateMemes,
} = memeSlice.actions;
export const memesSelectors = memesAdapter.getSelectors();
export default memeSlice.reducer;
