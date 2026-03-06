import os
from crewai import Agent, Task, LLM
from architect_agent import architect_task

llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    temperature=0.1,
    api_key=os.environ["GROQ_API_KEY"]
)

backend_agent = Agent(
    role="Technical Backend Lead",
    goal=(
        "Build complete backend for FlyEasy flight portal. "
        "Develop all Next.js API route handlers. "
        "Integrate Amadeus GDS, Razorpay, Brevo, SQL Server."
    ),
    backstory=(
        "12+ years building travel technology backends. "
        "Expert in Next.js 14 API routes and TypeScript. "
        "Deep knowledge of Amadeus Flight Offers Search and Create Orders APIs. "
        "Experienced with Razorpay payment order creation and signature verification. "
        "Knows Brevo transactional email for e-ticket delivery. "
        "SQL Server expert with stored procedures and transactions. "
        "Always handles GDS edge cases like fare expiry and sold-out seats."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=False
)

backend_task = Task(
    description=(
        "Build complete backend API for FlyEasy using Next.js route handlers.\n\n"
        "DELIVER COMPLETE TYPESCRIPT CODE FOR:\n\n"
        "1. src/app/api/flights/search/route.ts POST method.\n"
        "Input: origin destination departDate returnDate adults children infants cabinClass tripType.\n"
        "Call Amadeus Flight Offers Search API. Map to FlightOffer type. Return top 20 by price.\n"
        "Handle errors: Amadeus down, no results, invalid airports.\n\n"
        "2. src/app/api/flights/[offerId]/route.ts GET method.\n"
        "Call Amadeus Flight Offers Price API to confirm fare still valid.\n"
        "Return confirmed price fare rules baggage. Handle offer expired error.\n\n"
        "3. src/app/api/bookings/create/route.ts POST method.\n"
        "Input: offerId passengers array contactEmail contactPhone.\n"
        "Call Amadeus Flight Create Orders API. Save to SQL Server Bookings and Passengers tables.\n"
        "Return PNR and bookingId. Handle seat sold and fare changed errors.\n\n"
        "4. src/app/api/payments/initiate/route.ts POST method.\n"
        "Input: bookingId amount currency customerName email.\n"
        "Create Razorpay order. Save Payment record status pending. Never store card data.\n"
        "Return orderId amount currency keyId.\n\n"
        "5. src/app/api/payments/verify/route.ts POST method.\n"
        "Input: razorpayOrderId razorpayPaymentId razorpaySignature bookingId.\n"
        "Verify HMAC SHA256 signature. Update Payment status success or failed.\n"
        "On success trigger ticket notification. Return paymentId and status.\n\n"
        "6. src/app/api/tickets/[pnr]/route.ts GET method.\n"
        "Fetch booking passengers payment from SQL Server. Return complete ETicket data.\n\n"
        "7. src/app/api/notifications/ticket/route.ts POST method.\n"
        "Send e-ticket via Brevo transactional email API. HTML email with full itinerary.\n\n"
        "8. src/lib/db.ts: mssql connection pool singleton.\n\n"
        "9. src/lib/amadeus.ts: Amadeus SDK init with typed wrapper functions.\n\n"
        "10. SQL Server CREATE TABLE scripts for Users Searches Bookings Passengers Payments Tickets.\n\n"
        "SECURITY: Parameterized queries. JWT auth on booking payment routes. "
        "Rate limiting on search. Never log passport or card data.\n"
    ),
    agent=backend_agent,
    expected_output=(
        "10 complete TypeScript files: 7 API routes, db.ts, amadeus.ts, SQL schema. "
        "Full error handling and security included."
    ),
    context=[architect_task]
)
