import type { AirportOption } from '@/types';

export const POPULAR_AIRPORTS: AirportOption[] = [
  { iataCode: 'JFK', name: 'John F. Kennedy International', city: 'New York',       country: 'United States', countryCode: 'US' },
  { iataCode: 'LGA', name: 'LaGuardia Airport',              city: 'New York',       country: 'United States', countryCode: 'US' },
  { iataCode: 'EWR', name: 'Newark Liberty International',   city: 'Newark',         country: 'United States', countryCode: 'US' },
  { iataCode: 'LAX', name: 'Los Angeles International',      city: 'Los Angeles',    country: 'United States', countryCode: 'US' },
  { iataCode: 'ORD', name: "O'Hare International",           city: 'Chicago',        country: 'United States', countryCode: 'US' },
  { iataCode: 'ATL', name: 'Hartsfield-Jackson Atlanta',     city: 'Atlanta',        country: 'United States', countryCode: 'US' },
  { iataCode: 'DFW', name: 'Dallas/Fort Worth International',city: 'Dallas',         country: 'United States', countryCode: 'US' },
  { iataCode: 'DEN', name: 'Denver International',           city: 'Denver',         country: 'United States', countryCode: 'US' },
  { iataCode: 'SFO', name: 'San Francisco International',    city: 'San Francisco',  country: 'United States', countryCode: 'US' },
  { iataCode: 'SEA', name: 'Seattle-Tacoma International',   city: 'Seattle',        country: 'United States', countryCode: 'US' },
  { iataCode: 'MIA', name: 'Miami International',            city: 'Miami',          country: 'United States', countryCode: 'US' },
  { iataCode: 'BOS', name: 'Logan International',            city: 'Boston',         country: 'United States', countryCode: 'US' },
  { iataCode: 'LAS', name: 'Harry Reid International',       city: 'Las Vegas',      country: 'United States', countryCode: 'US' },
  { iataCode: 'PHX', name: 'Phoenix Sky Harbor International',city: 'Phoenix',       country: 'United States', countryCode: 'US' },
  { iataCode: 'IAH', name: 'George Bush Intercontinental',   city: 'Houston',        country: 'United States', countryCode: 'US' },
  { iataCode: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis', country: 'United States', countryCode: 'US' },
  { iataCode: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit',     country: 'United States', countryCode: 'US' },
  { iataCode: 'PHL', name: 'Philadelphia International',     city: 'Philadelphia',   country: 'United States', countryCode: 'US' },
  { iataCode: 'CLT', name: 'Charlotte Douglas International',city: 'Charlotte',      country: 'United States', countryCode: 'US' },
  { iataCode: 'MCO', name: 'Orlando International',          city: 'Orlando',        country: 'United States', countryCode: 'US' },
  // International
  { iataCode: 'LHR', name: 'Heathrow Airport',               city: 'London',         country: 'United Kingdom', countryCode: 'GB' },
  { iataCode: 'LGW', name: 'Gatwick Airport',                city: 'London',         country: 'United Kingdom', countryCode: 'GB' },
  { iataCode: 'CDG', name: 'Charles de Gaulle Airport',      city: 'Paris',          country: 'France',         countryCode: 'FR' },
  { iataCode: 'AMS', name: 'Amsterdam Airport Schiphol',     city: 'Amsterdam',      country: 'Netherlands',    countryCode: 'NL' },
  { iataCode: 'FRA', name: 'Frankfurt Airport',              city: 'Frankfurt',      country: 'Germany',        countryCode: 'DE' },
  { iataCode: 'DXB', name: 'Dubai International Airport',    city: 'Dubai',          country: 'UAE',            countryCode: 'AE' },
  { iataCode: 'SIN', name: 'Singapore Changi Airport',       city: 'Singapore',      country: 'Singapore',      countryCode: 'SG' },
  { iataCode: 'HND', name: 'Tokyo Haneda Airport',           city: 'Tokyo',          country: 'Japan',          countryCode: 'JP' },
  { iataCode: 'NRT', name: 'Tokyo Narita International',     city: 'Tokyo',          country: 'Japan',          countryCode: 'JP' },
  { iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney',         country: 'Australia',      countryCode: 'AU' },
  { iataCode: 'YYZ', name: 'Toronto Pearson International',  city: 'Toronto',        country: 'Canada',         countryCode: 'CA' },
  { iataCode: 'YVR', name: 'Vancouver International',        city: 'Vancouver',      country: 'Canada',         countryCode: 'CA' },
  { iataCode: 'MEX', name: 'Benito Juárez International',    city: 'Mexico City',    country: 'Mexico',         countryCode: 'MX' },
  { iataCode: 'GRU', name: 'São Paulo–Guarulhos International', city: 'São Paulo',   country: 'Brazil',         countryCode: 'BR' },
  { iataCode: 'DEL', name: 'Indira Gandhi International',    city: 'New Delhi',      country: 'India',          countryCode: 'IN' },
  { iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India',       countryCode: 'IN' },
  { iataCode: 'BLR', name: 'Kempegowda International',       city: 'Bengaluru',      country: 'India',          countryCode: 'IN' },
  { iataCode: 'HKG', name: 'Hong Kong International',        city: 'Hong Kong',      country: 'Hong Kong',      countryCode: 'HK' },
  { iataCode: 'ICN', name: 'Incheon International Airport',  city: 'Seoul',          country: 'South Korea',    countryCode: 'KR' },
  { iataCode: 'BCN', name: 'Barcelona El Prat Airport',      city: 'Barcelona',      country: 'Spain',          countryCode: 'ES' },
  { iataCode: 'MAD', name: 'Adolfo Suárez Madrid–Barajas',   city: 'Madrid',         country: 'Spain',          countryCode: 'ES' },
  { iataCode: 'FCO', name: 'Leonardo da Vinci–Fiumicino',    city: 'Rome',           country: 'Italy',          countryCode: 'IT' },
  { iataCode: 'MXP', name: 'Milan Malpensa Airport',         city: 'Milan',          country: 'Italy',          countryCode: 'IT' },
];

export function searchAirports(query: string, limit = 6): AirportOption[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return POPULAR_AIRPORTS.filter(
    (a) =>
      a.iataCode.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, limit);
}
