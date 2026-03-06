import os
from crewai import Agent, Task, LLM
from pm_agent import pm_task
from architect_agent import architect_task

llm = LLM(
    model="groq/llama3-8b-8192",
    temperature=0.2,
    api_key=os.environ["GROQ_API_KEY"]
)

ui_agent = Agent(
    role="Senior UI/UX Developer",
    goal=(
        "Build all 7 missing screens for FlyEasy flight portal. "
        "Follow existing design system exactly. "
        "Generate production-ready React TSX with Tailwind CSS."
    ),
    backstory=(
        "10 years building OTA portals like CheapOAir and MakeMyTrip. "
        "Expert in Next.js 14, TypeScript, Tailwind CSS. "
        "Follows FlyEasy design: primary #004D9F, CTA #FF4600 to #B33100. "
        "Reuses Button, Card, Badge, Input, CountdownTimer from @/components/ui. "
        "All components use use client and named exports. "
        "Imports from @/types and @/store."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=False
)

ui_task = Task(
    description=(
        "Generate complete React TSX for all 7 FlyEasy missing screens.\n\n"
        "DESIGN RULES:\n"
        "Primary blue #004D9F. CTA gradient #FF4600 to #B33100.\n"
        "Reuse Button, Card, Badge, Input, CountdownTimer from @/components/ui.\n"
        "All pages use client and named exports. Mobile-first responsive.\n\n"
        "SCREEN 1 src/app/flights/search/page.tsx:\n"
        "Filter sidebar price stops airlines time. "
        "Flight cards airline time duration stops price Book button. "
        "Sort bar Cheapest Fastest Best. Loading skeleton. Empty state.\n\n"
        "SCREEN 2 src/app/flights/[offerId]/page.tsx:\n"
        "Full itinerary timeline. Fare rules refundable change cancel. "
        "Baggage policy. Price breakdown base taxes fees total. "
        "Select Flight CTA to /booking/passengers.\n\n"
        "SCREEN 3 src/app/booking/passengers/page.tsx:\n"
        "Progress bar Passengers Seats Payment Confirm. "
        "Form per passenger: Title First Last DOB Nationality Passport. "
        "Contact Email Phone +91. Continue to Seats button.\n\n"
        "SCREEN 4 src/app/booking/seats/page.tsx:\n"
        "Seat map grid rows A to F 30 rows economy. "
        "Colors available white selected blue occupied grey legroom green. "
        "Seat price on hover. Skip option. Continue to Payment.\n\n"
        "SCREEN 5 src/app/booking/payment/page.tsx:\n"
        "15 min CountdownTimer. Order summary sidebar. "
        "Tabs Card UPI NetBanking. Card fields number expiry CVV name. "
        "UPI ID input. Bank dropdown. Pay Now button with total. Razorpay.\n\n"
        "SCREEN 6 src/app/booking/confirm/page.tsx:\n"
        "Green checkmark success. PNR large prominent. "
        "Itinerary summary. Passenger names. "
        "Download ticket. Share WhatsApp. Share Email. Home button.\n\n"
        "SCREEN 7 src/app/booking/ticket/[pnr]/page.tsx:\n"
        "Printable layout. FlyEasy logo. PNR booking reference. "
        "QR code placeholder. Passenger details table. "
        "Flight route date time seats. Baggage. Notes. Print button.\n"
    ),
    agent=ui_agent,
    expected_output=(
        "7 complete React TSX files with Tailwind CSS. "
        "All states loading error empty. Mobile responsive. "
        "Each file starts with file path as comment."
    ),
    context=[architect_task]
)
