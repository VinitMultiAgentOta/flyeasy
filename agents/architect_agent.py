import os
from crewai import Agent, Task, LLM
from pm_agent import pm_task

llm = LLM(
    model="groq/llama-3.1-8b-instant",
    temperature=0.1,
    api_key=os.environ["GROQ_API_KEY"]
)

architect_agent = Agent(
    role="Solutions Architect",
    goal=(
        "Design complete technical architecture for FlyEasy. "
        "Extend existing codebase without redesigning what exists. "
        "Produce exact code for new types, stores, and API contracts."
    ),
    backstory=(
        "12+ years building OTA platforms. "
        "Expert in Next.js 14 App Router, TypeScript, Zustand. "
        "Deep knowledge of Amadeus GDS API, Razorpay, PCI DSS. "
        "SQL Server schema design expert for booking systems."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=False
)

architect_task = Task(
    description=(
        "Design complete architecture extensions for FlyEasy.\n\n"
        "PRODUCE CODE FOR:\n"
        "1. New TypeScript interfaces to add to src/types/index.ts: "
        "FlightOffer, FlightSegment, StopDetail, FareBreakdown, BaggageInfo, "
        "FareRule, Passenger, PassengerTitle, Booking, BookingStatus, "
        "Payment, PaymentMethod, PaymentStatus, PNR, ETicket, SeatMap, Seat.\n\n"
        "2. Full Zustand store src/store/resultsStore.ts: "
        "State for results array, selectedOffer, filters, sortBy, loading, error. "
        "Actions: setResults, selectOffer, updateFilters, setSortBy, setLoading.\n\n"
        "3. Full Zustand store src/store/bookingStore.ts: "
        "State for passengers array, selectedSeats, payment, pnr, bookingId. "
        "Actions: addPassenger, updatePassenger, selectSeat, setPayment, setPNR.\n\n"
        "4. SQL Server CREATE TABLE scripts for: "
        "Users, Searches, Bookings, Passengers, Payments, Tickets.\n\n"
        "5. Next.js API route handler signatures with TypeScript types for: "
        "POST /api/flights/search, GET /api/flights/[offerId], "
        "POST /api/bookings/create, POST /api/payments/initiate, "
        "POST /api/payments/verify, GET /api/tickets/[pnr].\n"
    ),
    agent=architect_agent,
    expected_output=(
        "Complete architecture code: "
        "new TypeScript types, resultsStore.ts, bookingStore.ts, "
        "SQL Server schema, API route signatures."
    ),
    context=[pm_task]
)
