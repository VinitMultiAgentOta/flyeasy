import os
from crewai import Agent, Task
from langchain_groq import ChatGroq
from architect_agent import architect_task

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.2,
    api_key=os.environ["GROQ_API_KEY"]
)

ui_agent = Agent(
    role="Senior UI/UX Developer",
    goal=(
        "Build all 7 missing screens for FlyEasy flight portal. "
        "Follow existing design system exactly. "
        "Generate production-ready React TSX + Tailwind CSS."
    ),
    backstory=(
        "10 years building OTA portals similar to CheapOAir and MakeMyTrip. "
        "Expert in Next.js 14, TypeScript, Tailwind CSS. "
        "Follows FlyEasy design system strictly: "
        "Primary blue #004D9F, CTA gradient #FF4600 to #B33100. "
        "Reuses existing components from @/components/ui. "
        "All components use 'use client' and named exports. "
        "Imports types from @/types and stores from @/store."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=False
)

ui_task = Task(
    description=(
        "Generate complete React TSX code for all 7 FlyEasy missing screens.\n\n"

        "DESIGN RULES — MUST FOLLOW:\n"
        "- Primary blue: #004D9F\n"
        "- CTA button: gradient #FF4600 to #B33100\n"
        "- Reuse: Button, Card, Badge, Input, CountdownTimer from @/components/ui\n"
        "- All pages: 'use client' at top, named exports\n"
        "- Responsive: mobile-first, sm: md: lg: breakpoints\n"
        "- State: useResultsStore() and useBookingStore() hooks\n\n"

        "SCREEN 1 — src/app/flights/search/page.tsx:\n"
        "- Filter sidebar: price range, stops (any/0/1/2+), airlines, departure time\n"
        "- Flight result cards: airline logo, flight number, depart/arrive time,\n"
        "  duration, stops, baggage, price in INR, Book button\n"
        "- Sort bar: Cheapest | Fastest | Best\n"
        "- Loading skeleton state (6 placeholder cards)\n"
        "- Empty state when no results\n"
        "- Reads search params from URL query string\n\n"

        "SCREEN 2 — src/app/flights/[offerId]/page.tsx:\n"
        "- Full itinerary: departure airport, layovers, arrival airport\n"
        "- Timeline visual for each flight segment\n"
        "- Fare rules: refundable/non-refundable, change fee, cancellation\n"
        "- Baggage policy: cabin bag + check-in allowance\n"
        "- Price breakdown: base fare + taxes + convenience fee = total\n"
        "- Select Flight CTA button (blue → goes to /booking/passengers)\n\n"

        "SCREEN 3 — src/app/booking/passengers/page.tsx:\n"
        "- Progress bar: Passengers → Seats → Payment → Confirm\n"
        "- Form for each passenger (adult/child/infant count from search)\n"
        "- Fields: Title (Mr/Mrs/Ms/Master), First Name, Last Name,\n"
        "  Date of Birth, Nationality, Passport or Aadhaar number\n"
        "- Contact section: Email, Phone (with +91 default)\n"
        "- Continue to Seat Selection button\n\n"

        "SCREEN 4 — src/app/booking/seats/page.tsx:\n"
        "- Visual seat map grid (rows A-F, economy 30 rows)\n"
        "- Color legend: Available (white), Selected (blue #004D9F),\n"
        "  Occupied (grey), Extra Legroom (green)\n"
        "- Seat price badge on hover\n"
        "- Selected seats summary panel\n"
        "- Skip seat selection option\n"
        "- Continue to Payment button\n\n"

        "SCREEN 5 — src/app/booking/payment/page.tsx:\n"
        "- 15-min countdown timer (reuse CountdownTimer component)\n"
        "- Order summary card (right sidebar on desktop, top on mobile)\n"
        "- Payment tabs: Credit/Debit Card | UPI | Net Banking\n"
        "- Card tab: card number, expiry, CVV, name fields\n"
        "- UPI tab: UPI ID input + Pay Now button\n"
        "- Net Banking tab: bank dropdown list\n"
        "- Pay Now button with total amount\n"
        "- Razorpay script integration\n\n"

        "SCREEN 6 — src/app/booking/confirm/page.tsx:\n"
        "- Success animation (green checkmark)\n"
        "- PNR number displayed large and prominent\n"
        "- Full itinerary summary card\n"
        "- All passenger names listed\n"
        "- Download E-Ticket button (links to /booking/ticket/[pnr])\n"
        "- Share via WhatsApp button\n"
        "- Share via Email button\n"
        "- Back to Home button\n\n"

        "SCREEN 7 — src/app/booking/ticket/[pnr]/page.tsx:\n"
        "- Printable layout (print:block CSS)\n"
        "- FlyEasy logo top left\n"
        "- PNR and booking reference\n"
        "- QR code placeholder (for airport check-in)\n"
        "- Full passenger details table\n"
        "- Flight details: route, date, time, seat numbers\n"
        "- Baggage allowance section\n"
        "- Important notes section\n"
        "- Print button\n"
    ),
    agent=ui_agent,
    expected_output=(
        "7 complete React TSX files with full Tailwind CSS, "
        "all states (loading/error/empty), "
        "mobile responsive, brand-consistent design. "
        "Each file starts with the exact file path as a comment."
    ),
    context=[architect_task]
)
