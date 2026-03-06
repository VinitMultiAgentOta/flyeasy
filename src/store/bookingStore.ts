// src/store/bookingStore.ts
import { create } from 'zustand';
import { Passenger, SeatMap, Payment, FlightOffer } from '@/types';

interface BookingState {
  selectedOffer: FlightOffer | null;
  passengers: Passenger[];
  selectedSeats: SeatMap[];
  payment: Partial<Payment>;
  pnr: string;
  bookingId: string;
  contactEmail: string;
  contactPhone: string;
  currentStep: 'passengers' | 'seats' | 'payment' | 'confirm';
}

interface BookingActions {
  setSelectedOffer: (offer: FlightOffer) => void;
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (passenger: Passenger) => void;
  removePassenger: (id: string) => void;
  selectSeat: (seat: SeatMap) => void;
  deselectSeat: (seatNumber: string) => void;
  setPayment: (payment: Partial<Payment>) => void;
  setPNR: (pnr: string) => void;
  setBookingId: (bookingId: string) => void;
  setContactEmail: (email: string) => void;
  setContactPhone: (phone: string) => void;
  setCurrentStep: (step: BookingState['currentStep']) => void;
  resetBooking: () => void;
}

const initialState: BookingState = {
  selectedOffer: null,
  passengers: [],
  selectedSeats: [],
  payment: {},
  pnr: '',
  bookingId: '',
  contactEmail: '',
  contactPhone: '',
  currentStep: 'passengers',
};

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  ...initialState,

  setSelectedOffer: (offer) => set({ selectedOffer: offer }),

  addPassenger: (passenger) =>
    set((state) => ({ passengers: [...state.passengers, passenger] })),

  updatePassenger: (passenger) =>
    set((state) => ({
      passengers: state.passengers.map((p) =>
        p.id === passenger.id ? passenger : p
      ),
    })),

  removePassenger: (id) =>
    set((state) => ({
      passengers: state.passengers.filter((p) => p.id !== id),
    })),

  selectSeat: (seat) =>
    set((state) => ({ selectedSeats: [...state.selectedSeats, seat] })),

  deselectSeat: (seatNumber) =>
    set((state) => ({
      selectedSeats: state.selectedSeats.filter(
        (s) => s.seatNumber !== seatNumber
      ),
    })),

  setPayment: (payment) =>
    set((state) => ({ payment: { ...state.payment, ...payment } })),

  setPNR: (pnr) => set({ pnr }),
  setBookingId: (bookingId) => set({ bookingId }),
  setContactEmail: (contactEmail) => set({ contactEmail }),
  setContactPhone: (contactPhone) => set({ contactPhone }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  resetBooking: () => set(initialState),
}));

export default useBookingStore;
