import { create } from "zustand";
import { devtools } from "zustand/middleware";


import type {
  FlightSearchParams,
  CarSearchParams,
  SearchTab,
  TripType,
  CabinClass,
  PassengerCount,
} from "@/types";



interface SearchState {
  activeTab:     SearchTab;
  flightSearch:  FlightSearchParams;
  carSearch:     CarSearchParams;

  // Actions
  setActiveTab:         (tab: SearchTab) => void;
  updateFlightSearch:   (params: Partial<FlightSearchParams>) => void;
  updateCarSearch:      (params: Partial<CarSearchParams>) => void;
  resetFlightSearch:    () => void;
  swapFlightLocations:  () => void;
}

const defaultFlightSearch: FlightSearchParams = {
  tripType:    "round_trip",
  origin:      null,
  destination: null,
  departDate:  null,
  returnDate:  null,
  passengers:  { adult: 1, child: 0, infant: 0 },
  cabinClass:  "economy",
};

const defaultCarSearch: CarSearchParams = {
  pickupLocation:  null,
  dropoffLocation: null,
  sameLocation:    true,
  pickupDate:      null,
  dropoffDate:     null,
  pickupTime:      "10:00",
  dropoffTime:     "10:00",
  driverAge:       25,
};

export const useSearchStore = create<SearchState>()(
  devtools(
    (set) => ({
      activeTab:    "flights",
      flightSearch: defaultFlightSearch,
      carSearch:    defaultCarSearch,

      setActiveTab: (tab) => set({ activeTab: tab }),

      updateFlightSearch: (params) =>
        set((state) => ({
          flightSearch: { ...state.flightSearch, ...params },
        })),

      updateCarSearch: (params) =>
        set((state) => ({
          carSearch: { ...state.carSearch, ...params },
        })),

      resetFlightSearch: () =>
        set({ flightSearch: defaultFlightSearch }),

      swapFlightLocations: () =>
        set((state) => ({
          flightSearch: {
            ...state.flightSearch,
            origin:      state.flightSearch.destination,
            destination: state.flightSearch.origin,
          },
        })),
    }),
    { name: "SearchStore" }
  )
);
