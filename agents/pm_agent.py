import os
from crewai import Agent, Task
from langchain_groq import ChatGroq

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.1,
    api_key=os.environ["GROQ_API_KEY"]
)

pm_agent = Agent(
    role="Senior Project Manager",
    goal="""Create a detailed sprint-based project plan for FlyEasy 
            flight portal — picking up from existing code.
            Reference CheapOAir.com for complete flight booking flow.""",
    backstory="""15+ years managing OTA travel platforms. 
                 Expert in GDS workflows, IATA regulations, Agile delivery.
                 Has studied CheapOAir, MakeMyTrip, Goibibo flows deeply.
                 Knows the FlyEasy codebase uses:
                 - Next.js 14 App Router
                 - TypeScript + Tailwind CSS
                 - Zustand for state management
                 - FlightSearchWidget already built at home page
                 - Search submits to /flights/search route
                 - Brand colors: Blue #004D9F, Orange #FF4600""",
    llm=llm,
    verbose=True,
    allow_delegation=True
)

pm_task = Task(
    description="""
    Create a complete project plan for FlyEasy flight portal.
    
    EXISTING CODE (do NOT plan to rebuild these):
    ✅ Home page with FlightSearchWidget
    ✅ AirportInput autocomplete
    ✅ PassengerSelector with cabin class
    ✅ Zustand searchStore with flightSearch state
    ✅ TypeScript types: TripType, CabinClass, FlightSearchParams, AirportOption
    ✅ Header, Footer, UI components (Button, Card, Badge, Input)
    ✅ Brand design system established
    
    WHAT NEEDS TO BE BUILT (plan these only):
    
    PHASE 1 — UI PAGES (Next.js App Router):
    1. /flights/search/page.tsx — Results listing
       - Filter sidebar (price, stops, airline, time)
       - Flight cards (airline, time, duration, stops, price)
       - Sort by: cheapest, fastest, best
       - Loading skeleton state
       - "No results" empty state
       
    2. /flights/[offerId]/page.tsx — Flight details
       - Full itinerary breakdown
       - Fare rules (refund, change, baggage)
       - Seat map preview
       - Price breakdown (base + taxes + fees)
       - "Select this flight" CTA
       
    3. /booking/passengers/page.tsx — Passenger details
       - Title, First name, Last name
       - DOB, Nationality, Passport/Aadhaar
       - Contact: email, phone
       - Add passenger for each adult/child/infant
       
    4. /booking/seats/page.tsx — Seat selection
       - Visual seat map grid
       - Color coded: available/occupied/selected/extra legroom
       - Price per seat upgrade shown
       
    5. /booking/payment/page.tsx — Payment
       - 15-min countdown timer (fare hold)
       - Card / UPI / Net banking tabs
       - Razorpay integration
       - Order summary sidebar
       
    6. /booking/confirm/page.tsx — Confirmation
       - PNR display (large, prominent)
       - Full itinerary summary
       - Download ticket button
       - Share via WhatsApp/Email
       
    7. /booking/ticket/[pnr]/page.tsx — E-Ticket
       - Printable format
       - QR code for check-in
       - All passenger details
       - Baggage allowance
    
    PHASE 2 — NEW TYPES (extend src/types/index.ts):
    - FlightOffer, FlightSegment, FareBreakdown
    - Passenger, PassengerTitle
    - Booking, BookingStatus
    - Payment, PaymentMethod, PaymentStatus
    - PNR, ETicket, SeatMap, Seat
    
    PHASE 3 — NEW STORES (extend Zustand):
    - src/store/resultsStore.ts
    - src/store/bookingStore.ts
    
    PHASE 4 — API ROUTES (Next.js route handlers):
    - src/app/api/flights/search/route.ts
    - src/app/api/flights/[offerId]/route.ts
    - src/app/api/bookings/create/route.ts
    - src/app/api/payments/initiate/route.ts
    - src/app/api/payments/verify/route.ts
    - src/app/api/tickets/[pnr]/route.ts
    
    DELIVERABLES:
    - 25+ user stories with acceptance criteria
    - 3 sprint plan (2 weeks each)
    - Risk register (GDS downtime, fare expiry, payment failure)
    - Definition of Done per sprint
    - API endpoint specifications
    """,
    agent=pm_agent,
    expected_output="""Complete project plan with:
                       - 25+ user stories
                       - 3 sprint plan
                       - API specs
                       - Risk register
                       - Definition of Done"""
)
