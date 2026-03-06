**1. New TypeScript interfaces to add to src/types/index.ts:**

```typescript
// src/types/index.ts
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

export interface FlightSegment {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: StopDetail[];
}

export interface StopDetail {
  id: string;
  airport: string;
  arrivalTime: string;
  departureTime: string;
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

export interface Passenger {
  id: string;
  name: string;
  title: PassengerTitle;
  dateOfBirth: string;
  nationality: string;
}

export enum PassengerTitle {
  MR,
  MRS,
  MS,
  DR,
  PROF,
}

export interface PassengerTitle {
  value: PassengerTitle;
}

export interface Booking {
  id: string;
  pnr: string;
  status: BookingStatus;
  passengers: Passenger[];
  payment: Payment;
}

export enum BookingStatus {
  PENDING,
  CONFIRMED,
  CANCELED,
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
}

export enum PaymentMethod {
  CREDIT_CARD,
  DEBIT_CARD,
  PAYPAL,
}

export enum PaymentStatus {
  PENDING,
  SUCCESS,
  FAILED,
}

export interface PNR {
  id: string;
  bookingId: string;
  passengers: Passenger[];
}

export interface ETicket {
  id: string;
  pnr: string;
  passenger: Passenger;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
}

export interface SeatMap {
  id: string;
  seatNumber: string;
  passenger: Passenger;
}

export interface Seat {
  id: string;
  seatNumber: string;
  passenger: Passenger;
}
```

**2. Full Zustand store src/store/resultsStore.ts:**

```typescript
// src/store/resultsStore.ts
import { create } from 'zustand';
import { FlightOffer } from '../types';

interface ResultsState {
  results: FlightOffer[];
  selectedOffer: FlightOffer | null;
  filters: {
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
  };
  sortBy: 'price' | 'duration';
  loading: boolean;
  error: string | null;
}

interface ResultsActions {
  setResults: (results: FlightOffer[]) => void;
  selectOffer: (offer: FlightOffer) => void;
  updateFilters: (filters: {
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
  }) => void;
  setSortBy: (sortBy: 'price' | 'duration') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useResultsStore = create<ResultsState & ResultsActions>((set) => ({
  results: [],
  selectedOffer: null,
  filters: {
    departure: '',
    arrival: '',
    departureTime: '',
    arrivalTime: '',
  },
  sortBy: 'price',
  loading: false,
  error: null,

  setResults: (results) => set({ results }),
  selectOffer: (offer) => set({ selectedOffer: offer }),
  updateFilters: (filters) => set({ filters }),
  setSortBy: (sortBy) => set({ sortBy }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useResultsStore;
```

**3. Full Zustand store src/store/bookingStore.ts:**

```typescript
// src/store/bookingStore.ts
import { create } from 'zustand';
import { Passenger } from '../types';

interface BookingState {
  passengers: Passenger[];
  selectedSeats: Seat[];
  payment: Payment;
  pnr: string;
  bookingId: string;
}

interface BookingActions {
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (passenger: Passenger) => void;
  selectSeat: (seat: Seat) => void;
  setPayment: (payment: Payment) => void;
  setPNR: (pnr: string) => void;
  setBookingId: (bookingId: string) => void;
}

const useBookingStore = create<BookingState & BookingActions>((set) => ({
  passengers: [],
  selectedSeats: [],
  payment: {
    id: '',
    method: '',
    status: '',
    amount: 0,
    currency: '',
  },
  pnr: '',
  bookingId: '',

  addPassenger: (passenger) => set({ passengers: [...set.passengers, passenger] }),
  updatePassenger: (passenger) => set({ passengers: set.passengers.map((p) => (p.id === passenger.id ? passenger : p)) }),
  selectSeat: (seat) => set({ selectedSeats: [...set.selectedSeats, seat] }),
  setPayment: (payment) => set({ payment }),
  setPNR: (pnr) => set({ pnr }),
  setBookingId: (bookingId) => set({ bookingId }),
}));

export default useBookingStore;
```

**4. SQL Server CREATE TABLE scripts:**

```sql
-- Users table
CREATE TABLE Users (
  Id INT PRIMARY KEY IDENTITY(1,1),
  Email NVARCHAR(255) NOT NULL,
  Password NVARCHAR(255) NOT NULL,
  FirstName NVARCHAR(100) NOT NULL,
  LastName NVARCHAR(100) NOT NULL,
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

-- Searches table
CREATE TABLE Searches (
  Id INT PRIMARY KEY IDENTITY(1,1),
  UserId INT NOT NULL,
  Departure NVARCHAR(100) NOT NULL,
  Arrival NVARCHAR(100) NOT NULL,
  DepartureTime DATETIME NOT NULL,
  ArrivalTime DATETIME NOT NULL,
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT FK_Searches_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Bookings table
CREATE TABLE Bookings (
  Id INT PRIMARY KEY IDENTITY(1,1),
  PNR NVARCHAR(100) NOT NULL,
  UserId INT NOT NULL,
  BookingStatus NVARCHAR(100) NOT NULL,
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT FK_Bookings_Users FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- Passengers table
CREATE TABLE Passengers (
  Id INT PRIMARY KEY IDENTITY(1,1),
  BookingId INT NOT NULL,
  Name NVARCHAR(100) NOT NULL,
  DateOfBirth DATE NOT NULL,
  Nationality NVARCHAR(100) NOT NULL,
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT FK_Passengers_Bookings FOREIGN KEY (BookingId) REFERENCES Bookings(Id)
);

-- Payments table
CREATE TABLE Payments (
  Id INT PRIMARY KEY IDENTITY(1,1),
  BookingId INT NOT NULL,
  PaymentMethod NVARCHAR(100) NOT NULL,
  PaymentStatus NVARCHAR(100) NOT NULL,
  Amount DECIMAL(10, 2) NOT NULL,
  Currency NVARCHAR(100) NOT NULL,
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT FK_Payments_Bookings FOREIGN KEY (BookingId) REFERENCES Bookings(Id)
);

-- Tickets table
CREATE TABLE Tickets (
  Id INT PRIMARY KEY IDENTITY(1,1),
  PNR NVARCHAR(100) NOT NULL,
  FlightNumber NVARCHAR(100) NOT NULL,
  DepartureTime DATETIME NOT NULL,
  ArrivalTime DATETIME NOT NULL,
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT FK_Tickets_Bookings FOREIGN KEY (PNR) REFERENCES Bookings(PNR)
);
```

**5. Next.js API route handler signatures with TypeScript types:**

```typescript
// pages/api/flights/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { FlightOffer } from '../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightOffer[]>
) {
  // ...
}

// pages/api/flights/[offerId].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { FlightOffer } from '../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FlightOffer>
) {
  // ...
}

// pages/api/bookings/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Booking } from '../types';

export default async function handler(