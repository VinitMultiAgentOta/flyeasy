// ── Search Types ──────────────────────────────────────────────
export type TripType = "round_trip" | "one_way" | "multi_city";
export type CabinClass = "economy" | "premium_economy" | "business" | "first";
export type SearchTab  = "flights" | "cars";

export interface PassengerCount {
  adult:  number;
  child:  number;
  infant: number;
}

export interface FlightSearchParams {
  tripType:    TripType;
  origin:      AirportOption | null;
  destination: AirportOption | null;
  departDate:  string | null;
  returnDate:  string | null;
  passengers:  PassengerCount;
  cabinClass:  CabinClass;
}

export interface AirportOption {
  iataCode: string;
  name: string;
  city: string;
  country: string;
    countryCode: string;
}

// ── Flight Offer Types ──────────────────────────────────────────
export interface StopDetail {
  id: string;
  airport: string;
  arrivalTime: string;
  departureTime: string;
}

export interface FlightSegment {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: StopDetail[];
}

export interface FlightOffer {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  availability: string;
  flightSegments: FlightSegment[];
}

export interface FareBreakdown {
  baseFare: number;
  taxes: number;
  fees: number;
  total: number;
}

export interface BaggageInfo {
  carryOn: number;
  checked: number;
}

export interface FareRule {
  id: string;
  fareType: string;
  price: number;
  currency: string;
}

// ── Passenger Types ──────────────────────────────────────────────
export type PassengerTitle = 'MR' | 'MRS' | 'MS' | 'DR' | 'PROF';

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  title: PassengerTitle;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
}

// ── Booking Types ────────────────────────────────────────────────
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Payment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
}

export interface Booking {
  id: string;
  pnr: string;
  status: BookingStatus;
  passengers: Passenger[];
  payment: Payment;
  flightOffer: FlightOffer;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

export interface SeatMap {
  id: string;
  seatNumber: string;
  isAvailable: boolean;
  isSelected: boolean;
  isOccupied: boolean;
  isLegroom: boolean;
  price: number;
}

export interface ETicket {
  id: string;
  pnr: string;
  passenger: Passenger;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  seat: string;
  baggageAllowance: string;
}

// ── Home Page Types ──────────────────────────────────────────────
export interface FlightDeal {
  id: string;
  origin: string;
  originCity: string;
  destination: string;
  destCity: string;
  price: number;
  currency: string;
  airline: string;
  airlineCode: string;
  validUntil: string;
  discount: number;
  imageUrl: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  imageUrl: string;
  verified: boolean;
  city: string;
}
