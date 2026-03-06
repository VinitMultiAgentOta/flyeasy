import type { FlightDeal, CustomerReview } from '@/types';

export const FLIGHT_DEALS: FlightDeal[] = [
    {
        id: '1', origin: 'JFK', originCity: 'New York', destination: 'LAX', destCity: 'Los Angeles',
        price: 189, currency: 'USD', airline: 'Delta', airlineCode: 'DL',
        validUntil: '2026-04-30', discount: 34,
        imageUrl: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '2', origin: 'ORD', originCity: 'Chicago', destination: 'MIA', destCity: 'Miami',
        price: 129, currency: 'USD', airline: 'United', airlineCode: 'UA',
        validUntil: '2026-04-30', discount: 28,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '3', origin: 'LAX', originCity: 'Los Angeles', destination: 'JFK', destCity: 'New York',
        price: 199, currency: 'USD', airline: 'American', airlineCode: 'AA',
        validUntil: '2026-04-30', discount: 22,
        imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '4', origin: 'SFO', originCity: 'San Francisco', destination: 'LAS', destCity: 'Las Vegas',
        price: 79, currency: 'USD', airline: 'Southwest', airlineCode: 'WN',
        validUntil: '2026-04-30', discount: 41,
        imageUrl: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '5', origin: 'BOS', originCity: 'Boston', destination: 'MCO', destCity: 'Orlando',
        price: 149, currency: 'USD', airline: 'JetBlue', airlineCode: 'B6',
        validUntil: '2026-04-30', discount: 19,
        imageUrl: 'https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '6', origin: 'DFW', originCity: 'Dallas', destination: 'DEN', destCity: 'Denver',
        price: 99, currency: 'USD', airline: 'United', airlineCode: 'UA',
        validUntil: '2026-04-30', discount: 31,
        imageUrl: 'https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '7', origin: 'ATL', originCity: 'Atlanta', destination: 'LHR', destCity: 'London',
        price: 499, currency: 'USD', airline: 'Delta', airlineCode: 'DL',
        validUntil: '2026-04-30', discount: 25,
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '8', origin: 'JFK', originCity: 'New York', destination: 'CDG', destCity: 'Paris',
        price: 449, currency: 'USD', airline: 'Air France', airlineCode: 'AF',
        validUntil: '2026-04-30', discount: 18,
        imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=480&h=200&fit=crop&auto=format',
    },
    {
        id: '9', origin: 'LAX', originCity: 'Los Angeles', destination: 'NRT', destCity: 'Tokyo',
        price: 699, currency: 'USD', airline: 'ANA', airlineCode: 'NH',
        validUntil: '2026-04-30', discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=480&h=200&fit=crop&auto=format',
    },
];
 
export const CUSTOMER_REVIEWS: CustomerReview[] = [
    { id: '1', name: 'Sarah M.', city: 'New York, NY', rating: 5, comment: 'Called the number and saved $180 on my NYC to LA flight. The agent found a fare that wasn\'t showing online at all. Absolutely worth calling!', date: '2026-02-15', verified: true },
    { id: '2', name: 'James K.', city: 'Chicago, IL', rating: 5, comment: 'Booked online first, then called to ask a question. The agent proactively switched me to a cheaper fare. Saved $95. Incredible service!', date: '2026-02-20', verified: true },
    { id: '3', name: 'Priya S.', city: 'San Francisco, CA', rating: 5, comment: 'Found flights for my whole family to Cancun at prices I couldn\'t find anywhere else. Agents were so helpful and patient with 4 passengers.', date: '2026-02-10', verified: true },
    { id: '4', name: 'Robert T.', city: 'Miami, FL', rating: 4, comment: 'Great prices on last-minute flights. Had a connection issue and the support team resolved it in under 10 minutes. Very impressed.', date: '2026-01-28', verified: true },
    { id: '5', name: 'Linda W.', city: 'Dallas, TX', rating: 5, comment: 'Business class to London for almost the same price as economy elsewhere. I still can\'t believe it. Will never book anywhere else.', date: '2026-02-05', verified: true },
    { id: '6', name: 'Michael B.', city: 'Boston, MA', rating: 5, comment: 'The call center agents are genuinely knowledgeable. They suggested a routing I hadn\'t considered that saved 3 hours of travel time AND money.', date: '2026-01-15', verified: true },
    { id: '7', name: 'Amy C.', city: 'Seattle, WA', rating: 4, comment: 'Used the price alert feature and got notified of a $200 drop on my Tokyo flight. Booked immediately. Feature works great!', date: '2026-02-22', verified: true },
    { id: '8', name: 'David R.', city: 'Denver, CO', rating: 5, comment: 'Third time booking through FlyEasy. Consistent experience, always great prices, and the phone agents always find something better than what\'s online.', date: '2026-02-18', verified: true },
];
export const AIRLINE_PARTNERS = [
    { name: 'Delta', code: 'DL', color: '#003399' },
    { name: 'United', code: 'UA', color: '#005DAA' },
    { name: 'American', code: 'AA', color: '#B61F23' },
    { name: 'Southwest', code: 'WN', color: '#304CB2' },
    { name: 'JetBlue', code: 'B6', color: '#003876' },
    { name: 'Air France', code: 'AF', color: '#002157' },
    { name: 'British Airways', code: 'BA', color: '#075AAA' },
    { name: 'Emirates', code: 'EK', color: '#D71921' },
    { name: 'Lufthansa', code: 'LH', color: '#05164D' },
    { name: 'Singapore Air', code: 'SQ', color: '#001F5B' },
    { name: 'ANA', code: 'NH', color: '#13448F' },
    { name: 'Qatar Airways', code: 'QR', color: '#5C0632' },
];
export const POPULAR_DESTINATIONS = [
    { city: 'Las Vegas', country: 'USA', code: 'LAS', from: 79, emoji: '🎰', bg: 'from-purple-600 to-purple-900' },
    { city: 'Miami', country: 'USA', code: 'MIA', from: 129, emoji: '🌴', bg: 'from-cyan-500 to-blue-700' },
    { city: 'Orlando', country: 'USA', code: 'MCO', from: 149, emoji: '🎢', bg: 'from-yellow-500 to-orange-600' },
    { city: 'London', country: 'UK', code: 'LHR', from: 449, emoji: '🎡', bg: 'from-red-600 to-red-900' },
    { city: 'Paris', country: 'France', code: 'CDG', from: 399, emoji: '🗼', bg: 'from-pink-500 to-rose-700' },
    { city: 'Tokyo', country: 'Japan', code: 'NRT', from: 649, emoji: '🗾', bg: 'from-red-500 to-red-800' },
];
