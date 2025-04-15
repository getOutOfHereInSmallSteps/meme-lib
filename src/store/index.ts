import { configureStore } from '@reduxjs/toolkit';
import memeReducer, { rehydrateMemes } from './memeSlice';

const loadStateFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('memeState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined;
  }
};

const savedState = loadStateFromLocalStorage();

export const store = configureStore({
  reducer: {
    memes: memeReducer,
  },
  preloadedState: savedState ? { memes: savedState } : undefined,
});

if (savedState) {
  store.dispatch(rehydrateMemes(savedState));
}

store.subscribe(() => {
  try {
    const memeState = store.getState().memes;
    localStorage.setItem('memeState', JSON.stringify(memeState));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
