import os
from crewai import Agent, Task, LLM

llm = LLM(
    model="groq/llama3-8b-8192",
    temperature=0.1,
    api_key=os.environ["GROQ_API_KEY"]
)

pm_agent = Agent(
    role="Senior Project Manager",
    goal=(
        "Create a detailed sprint-based project plan for FlyEasy "
        "flight portal picking up from existing code. "
        "Reference CheapOAir.com for complete flight booking flow."
    ),
    backstory=(
        "15+ years managing OTA travel platforms. "
        "Expert in GDS workflows, IATA regulations, Agile delivery. "
        "Has studied CheapOAir, MakeMyTrip, Goibibo flows deeply. "
        "Knows FlyEasy uses Next.js 14, TypeScript, Tailwind, Zustand. "
        "FlightSearchWidget already built, submits to /flights/search route. "
        "Brand colors: Blue #004D9F, Orange #FF4600."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=True
)

pm_task = Task(
    description=(
        "Create a complete project plan for FlyEasy flight portal.\n\n"
        "EXISTING CODE (do NOT plan to rebuild these):\n"
        "Home page with FlightSearchWidget done.\n"
        "AirportInput autocomplete done.\n"
        "PassengerSelector with cabin class done.\n"
        "Zustand searchStore with flightSearch state done.\n"
        "TypeScript types: TripType, CabinClass, FlightSearchParams, AirportOption done.\n"
        "Header, Footer, UI components Button Card Badge Input done.\n"
        "Brand design system established done.\n\n"
        "WHAT NEEDS TO BE BUILT:\n"
        "UI Pages: flights/search, flights/[offerId], booking/passengers, "
        "booking/seats, booking/payment, booking/confirm, booking/ticket/[pnr].\n"
        "New Types: FlightOffer, FlightSegment, FareBreakdown, Passenger, "
        "Booking, Payment, PNR, ETicket, SeatMap, Seat.\n"
        "New Stores: resultsStore.ts, bookingStore.ts.\n"
        "API Routes: flights/search, flights/[offerId], bookings/create, "
        "payments/initiate, payments/verify, tickets/[pnr].\n\n"
        "DELIVERABLES:\n"
        "25 user stories with acceptance criteria.\n"
        "3 sprint plan 2 weeks each.\n"
        "Risk register for GDS downtime fare expiry payment failure.\n"
        "Definition of Done per sprint.\n"
        "API endpoint specifications.\n"
    ),
    agent=pm_agent,
    expected_output=(
        "Complete project plan with 25 user stories, "
        "3 sprint plan, API specs, risk register, Definition of Done."
    )
)
