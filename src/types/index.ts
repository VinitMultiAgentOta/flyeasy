// ── Search Types ───────────────────────────────────────────────
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
  departDate:  string | null;   // ← was Date | null
  returnDate:  string | null;   // ← was Date | null
  passengers:  PassengerCount;
  cabinClass:  CabinClass;
}

export interface CarSearchParams {
  pickupLocation:  AirportOption | null;
  dropoffLocation: AirportOption | null;
  sameLocation:    boolean;
  pickupDate:      string | null;   // ← was Date | null
  dropoffDate:     string | null;   // ← was Date | null
  pickupTime:      string;
  dropoffTime:     string;
  driverAge:       number;
}

export interface AirportOption {
  iata:        string;
  name:        string;
  city:        string;
  country:     string;
  countryCode: string;
}

// ── Deal Types ─────────────────────────────────────────────────
export interface FlightDeal {
  id:            string;
  origin:        string;
  originCity:    string;
  destination:   string;
  destCity:      string;
  price:         number;
  currency:      string;
  airline:       string;
  airlineCode:   string;
  validUntil:    string;
  imageUrl:      string;
  discount?:     number;
}

// ── Review Types ───────────────────────────────────────────────
export interface CustomerReview {
  id:        string;
  name:      string;
  city:      string;
  rating:    number;
  comment:   string;
  date:      string;
  verified:  boolean;
}

// ── UI Types ───────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href:  string;
  icon?: string;
}

export type ButtonVariant = "primary" | "call" | "outline" | "ghost";
export type ButtonSize    = "sm" | "md" | "lg";
