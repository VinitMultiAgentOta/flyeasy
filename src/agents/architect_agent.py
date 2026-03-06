from crewai import Agent, Task
from langchain_groq import ChatGroq
import os

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.1,
    api_key=os.environ["GROQ_API_KEY"]
)

architect_agent = Agent(
    role="Solutions Architect",
    goal="""Design complete technical architecture for FlyEasy.
            Extend existing codebase — do not redesign what exists.
            Produce exact code for new types, stores, and API contracts.""",
    backstory="""Enterprise architect with 12+ years on OTA platforms.
                 Expert in Next.js 14 App Router, TypeScript, Zustand,
                 Amadeus GDS API, Razorpay, PCI DSS compliance,
                 SQL Server schema design for booking systems.
                 Knows FlyEasy existing types and store patterns well.""",
    llm=llm,
    verbose=True,
    allow_delegation=False
)

architect_task = Task(
    description="""
    Design and produce exact code for FlyEasy architecture extensions.
    
    EXISTING PATTERNS TO FOLLOW:
    - Types use: export interface / export type pattern
    - Store uses: Zustand create() with devtools middleware
    - Components use: named exports, 'use client' where needed
    - Styling: Tailwind CSS + inline style for brand colors
    - Brand: Blue #004D9F, Orange-Red #FF4600, White background
    
    PRODUCE EXACT CODE FOR:
    
    1. EXTENDED TYPES (full file content for src/types/index.ts additions):
    
    // Flight Results
    export interface FlightOffer {
      id: string;
      airline: string;
      airlineCode: string;
      flightNumber: string;
      origin: string;
      destination: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      stops: number;
      stopDetails?: StopDetail[];
      price: FareBreakdown;
      cabinClass: CabinClass;
      seatsLeft: number;
      refundable: boolean;
      baggage: BaggageInfo;
    }
    // ... complete all missing types
    
    2. RESULTS STORE (full file: src/store/resultsStore.ts):
    - Zustand store for flight search results
    - State: results[], selectedOffer, filters, sortBy, loading, error
    - Actions: setResults, selectOffer, updateFilters, setSortBy
    
    3. BOOKING STORE (full file: src/store/bookingStore.ts):
    - Zustand store for booking flow
    - State: passengers[], selectedSeats, payment, pnr, booking
    - Actions: addPassenger, updatePassenger, selectSeat, setPayment, setPNR
    
    4. SQL SERVER SCHEMA (CREATE TABLE scripts):
    - Users, Searches, FlightOffers (cache), Bookings, 
      Passengers, Payments, Tickets tables
    - All foreign keys, indexes, constraints
    
    5. API CONTRACTS (exact Next.js route handler signatures):
    - POST /api/flights/search → Amadeus integration
    - GET  /api/flights/[offerId] → fare rules
    - POST /api/bookings/create → PNR creation
    - POST /api/payments/initiate → Razorpay order
    - POST /api/payments/verify → Razorpay verification
    - GET  /api/tickets/[pnr] → ticket data
    """,
    agent=architect_agent,
    expected_output="""Complete architecture code:
                       - Full extended types/index.ts additions
                       - resultsStore.ts complete file
                       - bookingStore.ts complete file  
                       - SQL Server CREATE TABLE scripts
                       - API route handler signatures""",
    context=[pm_task]
)
