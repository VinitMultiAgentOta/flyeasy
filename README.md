# FlyEasy - Enterprise OTA Flight Portal

> Built with a Multi-Agent AI development team (PM Agent, Architect Agent, UI Agent, Backend Agent, QA Agent) powered by Groq LLM.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| State | Zustand |
| Backend | Next.js API Routes (App Router) |
| Database | Azure SQL Server (mssql) |
| GDS | Amadeus Self-Service API |
| Payments | Razorpay |
| Email | Nodemailer (Brevo SMTP) |
| Auth | NextAuth.js |
| Agents | Python + Groq (llama-3.3-70b) |

## Project Structure

```
flyeasy/
├── agents/           # Multi-agent AI scripts (PM, Architect, UI, Backend, QA)
├── database/         # SQL schema (schema.sql)
├── output/           # Agent output reports
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── flights/search/      # POST - Amadeus flight search
│   │   │   ├── bookings/create/     # POST - Create booking + passengers
│   │   │   ├── payments/create/     # POST - Razorpay order creation
│   │   │   ├── payments/verify/     # POST - HMAC SHA256 signature verify
│   │   │   └── notifications/ticket/ # POST - E-ticket email notification
│   ├── components/   # UI components (FlightSearchWidget, etc.)
│   ├── lib/          # Amadeus SDK wrapper, DB connection
│   ├── store/        # Zustand stores (flightStore, bookingStore)
│   └── types/        # TypeScript types
├── .env.example      # Environment variable template
└── .github/workflows/ # CI/CD + Agent runner workflows
```

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/VinitMultiAgentOta/flyeasy.git
cd flyeasy
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Fill in your credentials in .env.local
```

### 3. Database Setup
```bash
# Run database/schema.sql against your Azure SQL / SQL Server instance
# sqlcmd -S your-server -d flyeasy -i database/schema.sql
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/flights/search` | Search flights via Amadeus GDS |
| POST | `/api/bookings/create` | Create booking with passenger details |
| POST | `/api/payments/create` | Create Razorpay payment order |
| POST | `/api/payments/verify` | Verify Razorpay payment signature |
| POST | `/api/notifications/ticket` | Send e-ticket confirmation email |

## Flight Booking Flow

```
Search Flights → Select Flight → Add Passengers → 
Create Booking → Initialize Payment → Verify Payment → 
Issue E-Ticket → Send Email Notification
```

## Environment Variables

See `.env.example` for all required variables:
- **SQL Server** - Azure SQL connection
- **Amadeus** - GDS API credentials (free test account at developers.amadeus.com)
- **Razorpay** - Payment gateway (free test mode at dashboard.razorpay.com)
- **SMTP** - Email via Brevo (300 free emails/day)

## Multi-Agent Development

This project was built using an AI agent pipeline:

```bash
# Run agents via GitHub Actions > Actions > Run Agents workflow
# Select: pm | architect | ui | backend | qa
```

Agent outputs are stored in `output/` folder.

## Phase Roadmap

- [x] Phase 1: Flights (Search, Book, Pay, Ticket)
- [ ] Phase 2: Hotels
- [ ] Phase 3: Car Rentals
- [ ] Phase 4: Holiday Packages

## License

Proprietary - NexgenIT / FlyEasy
