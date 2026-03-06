import os
from crewai import Agent, Task
from langchain_groq import ChatGroq
from pm_agent import pm_task
from architect_agent import architect_task

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0.1,
    api_key=os.environ["GROQ_API_KEY"]
)

backend_agent = Agent(
    role="Technical Backend Lead",
    goal=(
        "Build complete backend for FlyEasy flight portal. "
        "Develop all Next.js API route handlers, "
        "integrate Amadeus GDS, Razorpay payments, "
        "Brevo email, and SQL Server database."
    ),
    backstory=(
        "12+ years building travel technology backends. "
        "Expert in Next.js 14 API routes, TypeScript, Node.js. "
        "Deep knowledge of Amadeus Flight Offers Search API "
        "and Flight Create Orders API for PNR generation. "
        "Experienced with Razorpay payment order creation "
        "and signature verification for PCI DSS compliance. "
        "Knows Brevo transactional email API for e-ticket delivery. "
        "SQL Server expert — stored procedures, indexes, transactions. "
        "Always handles GDS edge cases: fare expiry, sold-out seats, "
        "payment success but PNR failure scenarios."
    ),
    llm=llm,
    verbose=True,
    allow_delegation=False
)

backend_task = Task(
    description=(
        "Build complete backend API for FlyEasy using Next.js route handlers.\n\n"

        "TECH STACK:\n"
        "- Next.js 14 App Router API routes (TypeScript)\n"
        "- Amadeus Self-Service API (test environment)\n"
        "- Razorpay payment gateway\n"
        "- Brevo transactional email\n"
        "- SQL Server (mssql npm package)\n\n"

        "DELIVER COMPLETE CODE FOR:\n\n"

        "1. src/app/api/flights/search/route.ts\n"
        "   - Method: POST\n"
        "   - Input: { origin, destination, departDate, returnDate,\n"
        "             adults, children, infants, cabinClass, tripType }\n"
        "   - Calls Amadeus Flight Offers Search API\n"
        "   - Maps Amadeus response to FlyEasy FlightOffer type\n"
        "   - Returns top 20 results sorted by price\n"
        "   - Error handling: Amadeus down, no results, invalid airports\n"
        "   - Response: { success: true, results: FlightOffer[], count: number }\n\n"

        "2. src/app/api/flights/[offerId]/route.ts\n"
        "   - Method: GET\n"
        "   - Calls Amadeus Flight Offers Price API to confirm fare\n"
        "   - Returns confirmed price + fare rules + baggage info\n"
        "   - Error handling: offer expired (15-min window)\n"
        "   - Response: { success: true, offer: FlightOffer, fareRules: FareRule[] }\n\n"

        "3. src/app/api/bookings/create/route.ts\n"
        "   - Method: POST\n"
        "   - Input: { offerId, passengers: Passenger[], contactEmail, contactPhone }\n"
        "   - Calls Amadeus Flight Create Orders API\n"
        "   - Saves booking to SQL Server Bookings table\n"
        "   - Saves each passenger to Passengers table\n"
        "   - Returns PNR and booking ID\n"
        "   - Error handling: seat sold between search and booking,\n"
        "     fare changed, Amadeus timeout\n"
        "   - Response: { success: true, pnr: string, bookingId: string }\n\n"

        "4. src/app/api/payments/initiate/route.ts\n"
        "   - Method: POST\n"
        "   - Input: { bookingId, amount, currency, customerName, email }\n"
        "   - Creates Razorpay order using Razorpay Node SDK\n"
        "   - Saves payment record to Payments table (status: pending)\n"
        "   - NEVER stores card data — tokenization only\n"
        "   - Response: { success: true, orderId: string, amount: number,\n"
        "                 currency: string, keyId: string }\n\n"

        "5. src/app/api/payments/verify/route.ts\n"
        "   - Method: POST\n"
        "   - Input: { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId }\n"
        "   - Verifies Razorpay HMAC SHA256 signature\n"
        "   - Updates Payment status to: success or failed\n"
        "   - On success: triggers ticket generation\n"
        "   - On failure: releases PNR hold, notifies user\n"
        "   - Response: { success: true, paymentId: string, status: string }\n\n"

        "6. src/app/api/tickets/[pnr]/route.ts\n"
        "   - Method: GET\n"
        "   - Fetches booking + passengers + payment from SQL Server\n"
        "   - Returns complete ticket data\n"
        "   - Response: { success: true, ticket: ETicket }\n\n"

        "7. src/app/api/notifications/ticket/route.ts\n"
        "   - Method: POST\n"
        "   - Input: { pnr, email, passengerName, itinerary }\n"
        "   - Sends e-ticket confirmation via Brevo transactional email\n"
        "   - Uses Brevo API key from environment\n"
        "   - HTML email with full itinerary details\n"
        "   - Response: { success: true, messageId: string }\n\n"

        "8. src/lib/db.ts — SQL Server connection:\n"
        "   - mssql connection pool\n"
        "   - Reads connection string from environment variable\n"
        "   - Singleton pattern (reuse connection pool)\n\n"

        "9. src/lib/amadeus.ts — Amadeus client:\n"
        "   - Amadeus SDK initialization\n"
        "   - Auth token management\n"
        "   - Typed wrapper functions for each API call\n\n"

        "10. SQL SERVER SCHEMA — Full CREATE TABLE scripts:\n"
        "    CREATE TABLE Users\n"
        "    CREATE TABLE Searches (cache GDS results 10 mins)\n"
        "    CREATE TABLE Bookings\n"
        "    CREATE TABLE Passengers\n"
        "    CREATE TABLE Payments\n"
        "    CREATE TABLE Tickets\n"
        "    All with: PRIMARY KEY, FOREIGN KEY, indexes, constraints\n\n"

        "ENVIRONMENT VARIABLES USED (from GitHub Secrets):\n"
        "- AMADEUS_CLIENT_ID\n"
        "- AMADEUS_CLIENT_SECRET\n"
        "- RAZORPAY_KEY_ID\n"
        "- RAZORPAY_KEY_SECRET\n"
        "- BREVO_API_KEY\n"
        "- DATABASE_URL (SQL Server connection string)\n"
        "- NEXTAUTH_SECRET (JWT signing)\n\n"

        "SECURITY REQUIREMENTS:\n"
        "- All routes validate input with TypeScript types\n"
        "- JWT authentication on booking/payment routes\n"
        "- Rate limiting: 100 requests/min on search route\n"
        "- Never log sensitive data (card, passport numbers)\n"
        "- All DB queries use parameterized statements (no SQL injection)\n"
        "- Razorpay signature verified before any DB write\n"
    ),
    agent=backend_agent,
    expected_output=(
        "10 complete TypeScript files: "
        "7 API route handlers + db.ts + amadeus.ts + SQL schema. "
        "Each file starts with exact file path as comment. "
        "Full error handling, TypeScript types, security measures included."
    ),
    context=[architect_task]
)
