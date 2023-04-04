'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

type Props = {
  children: ReactNode;
};

type FavoriteActionType = {
  type: 'ADD' | 'REMOVE';
  payload: string;
};

const favoriteReducer = (state: string[], action: FavoriteActionType) => {
  let favorites: string[] = [];
  switch (action.type) {
    case 'ADD': {
      favorites = [...state, action.payload];
      break;
    }
    case 'REMOVE':
      favorites = state.filter((item) => item !== action.payload);
      break;
    default:
      return state;
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  return favorites;
};

type FavoriteContextType = {
  favorites: string[];
  addToFavorite: (id: string) => void;
  removeFromFavorite: (id: string) => void;
};

const FavoriteContext = createContext<FavoriteContextType | null>(null);

export default function FavoriteProvider({ children }: Props) {
  const [state, dispatch] = useReducer(
    favoriteReducer,
    [] as string[],
    (arg) => {
      const favorites = localStorage.getItem('favorites');
      return favorites ? JSON.parse(favorites) : arg;
    }
  );

  const addToFavorite = useCallback(
    (id: string) => {
      dispatch({ type: 'ADD', payload: id });
    },
    [dispatch]
  );

  const removeFromFavorite = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE', payload: id });
    },
    [dispatch]
  );

  return (
    <FavoriteContext.Provider
      value={{
        favorites: state,
        addToFavorite,
        removeFromFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorite must be used within a FavoriteProvider');
  }
  return context;
};
