```typescript
// src/app/api/flights/search/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Amadeus } from '../lib/amadeus';
import { db } from '../lib/db';

interface FlightOffer {
  id: string;
  price: number;
  fare: string;
  baggage: string;
  rules: string;
}

const searchFlights = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { origin, destination, departDate, returnDate, adults, children, infants, cabinClass, tripType } = req.body;
    const amadeus = new Amadeus();
    const response = await amadeus.searchFlights(origin, destination, departDate, returnDate, adults, children, infants, cabinClass, tripType);
    const offers: FlightOffer[] = response.data.map((offer) => ({
      id: offer.id,
      price: offer.price,
      fare: offer.fare,
      baggage: offer.baggage,
      rules: offer.rules,
    }));
    const top20Offers = offers.sort((a, b) => a.price - b.price).slice(0, 20);
    res.json(top20Offers);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Amadeus down')) {
        res.status(503).json({ error: 'Amadeus API is down' });
      } else if (error.message.includes('no results')) {
        res.status(404).json({ error: 'No flights found' });
      } else if (error.message.includes('invalid airports')) {
        res.status(400).json({ error: 'Invalid origin or destination airport' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return searchFlights(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// src/app/api/flights/[offerId]/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Amadeus } from '../lib/amadeus';

const getFlightOffer = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { offerId } = req.query;
    const amadeus = new Amadeus();
    const response = await amadeus.getFlightOffer(offerId);
    const offer = response.data;
    if (offer.expired) {
      res.status(410).json({ error: 'Offer has expired' });
    } else {
      res.json({
        price: offer.price,
        fare: offer.fare,
        baggage: offer.baggage,
        rules: offer.rules,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getFlightOffer(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// src/app/api/bookings/create/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Amadeus } from '../lib/amadeus';
import { db } from '../lib/db';
import jwt from 'jsonwebtoken';

interface BookingRequest {
  offerId: string;
  passengers: { name: string; surname: string }[];
  contactEmail: string;
  contactPhone: string;
}

const createBooking = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { offerId, passengers, contactEmail, contactPhone } = req.body as BookingRequest;
    const amadeus = new Amadeus();
    const response = await amadeus.createBooking(offerId, passengers, contactEmail, contactPhone);
    const bookingId = response.data.bookingId;
    const pnr = response.data.pnr;
    await db.query(`INSERT INTO Bookings (id, pnr, offerId, contactEmail, contactPhone) VALUES (@id, @pnr, @offerId, @contactEmail, @contactPhone)`, {
      id: bookingId,
      pnr,
      offerId,
      contactEmail,
      contactPhone,
    });
    await db.query(`INSERT INTO Passengers (bookingId, name, surname) VALUES (@bookingId, @name, @surname)`, {
      bookingId,
      name: passengers[0].name,
      surname: passengers[0].surname,
    });
    res.json({ bookingId, pnr });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('seat sold')) {
        res.status(409).json({ error: 'Seat has been sold' });
      } else if (error.message.includes('fare changed')) {
        res.status(409).json({ error: 'Fare has changed' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return createBooking(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// src/app/api/payments/initiate/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { db } from '../lib/db';
import jwt from 'jsonwebtoken';

interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  customerName: string;
  email: string;
}

const initiatePayment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { bookingId, amount, currency, customerName, email } = req.body as PaymentRequest;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const payment = await razorpay.orders.create({
      amount,
      currency,
      payment_capture: 'automatic',
      customer: {
        name: customerName,
        email,
      },
    });
    await db.query(`INSERT INTO Payments (id, bookingId, amount, currency, status) VALUES (@id, @bookingId, @amount, @currency, @status)`, {
      id: payment.id,
      bookingId,
      amount,
      currency,
      status: 'pending',
    });
    res.json({
      orderId: payment.id,
      amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return initiatePayment(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// src/app/api/payments/verify/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../lib/db';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface PaymentVerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  bookingId: string;
}

const verifyPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body as PaymentVerificationRequest;
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');
    if (generatedSignature !== razorpaySignature) {
      res.status(400).json({ error: 'Invalid signature' });
    }
    await db.query(`UPDATE Payments SET status = 'success' WHERE id = @id`, {
      id: razorpayOrderId,
    });
    res.json({
      paymentId: razorpayOrderId,
      status: 'success',
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return verifyPayment(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// src/app/api/tickets/[pnr]/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../lib/db';

const getTicket = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { pnr } = req.query;
    const booking = await db.query(`SELECT * FROM Bookings WHERE pnr = @pnr`, {
      pnr,
    });
    const passengers = await db.query(`SELECT * FROM Passengers WHERE bookingId = @bookingId`, {
      bookingId: booking[0].id,
    });
    const payment = await db.query(`SELECT * FROM Payments WHERE bookingId = @bookingId`, {
      bookingId: booking[0].id,
    });
    res.json({
      booking,
      passengers,
      payment,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getTicket(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// src/app/api/notifications/ticket/route.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Brevo } from 'brevo';
import { db } from '../lib/db';

const sendTicketNotification = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { pnr } = req.body;
    const booking = await db.query(`SELECT * FROM Bookings WHERE pnr = @pnr`, {
      pnr,
    });
    const passengers = await db.query(`SELECT * FROM Passengers WHERE bookingId = @bookingId`, {
      bookingId: booking[0].id,
    });
    const payment = await db.query(`SELECT * FROM Payments WHERE bookingId = @bookingId`, {
      bookingId: booking[0].id,
    });
    const brevo = new Brevo({
      apiKey: process.env.BREVO_API_KEY,
      apiSecret: process.env.BREVO_API_SECRET,
    });
    const email = await brevo.sendEmail({
      to: passengers[0].email,
      subject: 'Your Flight Ticket',
      html: `
        <h1>Your Flight Ticket</h1>
        <p>Booking ID: ${booking[0].id}</p>
        <p>PNR: ${booking[0].pnr}</p>
        <p>Passengers: ${passengers.map((passenger) => passenger.name).join(', ')}</p>
        <p>Payment: ${payment[0].amount} ${payment[0].currency}</p>
      `,
    });
    res.json({
      email,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return sendTicketNotification(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// src/lib/db.ts
import { createPool } from 'mssql';

const db = createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
});

export default db;

// src/lib/amadeus.ts
import { Amadeus } from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

export default amadeus;

// SQL schema
CREATE TABLE Users (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE Searches (
  id INT PRIMARY KEY,
  userId INT,
  origin VARCHAR(255),
  destination VARCHAR(255),
  departDate DATE,
  returnDate DATE,
  adults INT,
  children INT,
  infants INT,
  cabinClass VARCHAR(255),
  tripType VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE Bookings (
  id INT PRIMARY KEY,
  pnr VARCHAR(255),
  offerId VARCHAR(255),
  contactEmail VARCHAR(255),
  contactPhone VARCHAR(255)
);

CREATE TABLE Passengers (
  id INT PRIMARY KEY,
  bookingId INT,
  name VARCHAR(255),
  surname VARCHAR(255),
  FOREIGN KEY (bookingId) REFERENCES Bookings(id)
);

CREATE TABLE Payments (
  id INT PRIMARY KEY,
  bookingId INT,
  amount DECIMAL(10, 2),
  currency VARCHAR(255),
  status VARCHAR(255),
  FOREIGN KEY (bookingId) REFERENCES Bookings(id)
);

CREATE TABLE Tickets (
  id INT PRIMARY KEY,
  bookingId INT,
  pnr VARCHAR(255),
  FOREIGN KEY (bookingId) REFERENCES Bookings(id)
);
```