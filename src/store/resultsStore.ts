// src/store/resultsStore.ts
import { create } from 'zustand';
import { FlightOffer } from '@/types';

interface FilterState {
  priceMax: number;
  stops: number;
  airlines: string[];
  departTimeRange: [number, number];
}

interface ResultsState {
  results: FlightOffer[];
  selectedOffer: FlightOffer | null;
  filters: FilterState;
  sortBy: 'price' | 'duration' | 'best';
  loading: boolean;
  error: string | null;
}

interface ResultsActions {
  setResults: (results: FlightOffer[]) => void;
  selectOffer: (offer: FlightOffer) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setSortBy: (sortBy: 'price' | 'duration' | 'best') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  priceMax: 100000,
  stops: 3,
  airlines: [],
  departTimeRange: [0, 24],
};

export const useResultsStore = create<ResultsState & ResultsActions>((set) => ({
  results: [],
  selectedOffer: null,
  filters: DEFAULT_FILTERS,
  sortBy: 'price',
  loading: false,
  error: null,

  setResults: (results) => set({ results }),
  selectOffer: (offer) => set({ selectedOffer: offer }),
  updateFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSortBy: (sortBy) => set({ sortBy }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearResults: () => set({ results: [], selectedOffer: null, error: null }),
}));

export default useResultsStore;
