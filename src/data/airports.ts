import type { AirportOption } from '@/types';

export const POPULAR_AIRPORTS: AirportOption[] = [
  { iata: 'JFK', name: 'John F. Kennedy International', city: 'New York',       country: 'United States', countryCode: 'US' },
  { iata: 'LGA', name: 'LaGuardia Airport',              city: 'New York',       country: 'United States', countryCode: 'US' },
  { iata: 'EWR', name: 'Newark Liberty International',   city: 'Newark',         country: 'United States', countryCode: 'US' },
  { iata: 'LAX', name: 'Los Angeles International',      city: 'Los Angeles',    country: 'United States', countryCode: 'US' },
  { iata: 'ORD', name: "O'Hare International",           city: 'Chicago',        country: 'United States', countryCode: 'US' },
  { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta',     city: 'Atlanta',        country: 'United States', countryCode: 'US' },
  { iata: 'DFW', name: 'Dallas/Fort Worth International',city: 'Dallas',         country: 'United States', countryCode: 'US' },
  { iata: 'DEN', name: 'Denver International',           city: 'Denver',         country: 'United States', countryCode: 'US' },
  { iata: 'SFO', name: 'San Francisco International',    city: 'San Francisco',  country: 'United States', countryCode: 'US' },
  { iata: 'SEA', name: 'Seattle-Tacoma International',   city: 'Seattle',        country: 'United States', countryCode: 'US' },
  { iata: 'MIA', name: 'Miami International',            city: 'Miami',          country: 'United States', countryCode: 'US' },
  { iata: 'BOS', name: 'Logan International',            city: 'Boston',         country: 'United States', countryCode: 'US' },
  { iata: 'LAS', name: 'Harry Reid International',       city: 'Las Vegas',      country: 'United States', countryCode: 'US' },
  { iata: 'PHX', name: 'Phoenix Sky Harbor International',city: 'Phoenix',       country: 'United States', countryCode: 'US' },
  { iata: 'IAH', name: 'George Bush Intercontinental',   city: 'Houston',        country: 'United States', countryCode: 'US' },
  { iata: 'MSP', name: 'Minneapolis-Saint Paul International', city: 'Minneapolis', country: 'United States', countryCode: 'US' },
  { iata: 'DTW', name: 'Detroit Metropolitan Wayne County', city: 'Detroit',     country: 'United States', countryCode: 'US' },
  { iata: 'PHL', name: 'Philadelphia International',     city: 'Philadelphia',   country: 'United States', countryCode: 'US' },
  { iata: 'CLT', name: 'Charlotte Douglas International',city: 'Charlotte',      country: 'United States', countryCode: 'US' },
  { iata: 'MCO', name: 'Orlando International',          city: 'Orlando',        country: 'United States', countryCode: 'US' },
  // International
  { iata: 'LHR', name: 'Heathrow Airport',               city: 'London',         country: 'United Kingdom', countryCode: 'GB' },
  { iata: 'LGW', name: 'Gatwick Airport',                city: 'London',         country: 'United Kingdom', countryCode: 'GB' },
  { iata: 'CDG', name: 'Charles de Gaulle Airport',      city: 'Paris',          country: 'France',         countryCode: 'FR' },
  { iata: 'AMS', name: 'Amsterdam Airport Schiphol',     city: 'Amsterdam',      country: 'Netherlands',    countryCode: 'NL' },
  { iata: 'FRA', name: 'Frankfurt Airport',              city: 'Frankfurt',      country: 'Germany',        countryCode: 'DE' },
  { iata: 'DXB', name: 'Dubai International Airport',    city: 'Dubai',          country: 'UAE',            countryCode: 'AE' },
  { iata: 'SIN', name: 'Singapore Changi Airport',       city: 'Singapore',      country: 'Singapore',      countryCode: 'SG' },
  { iata: 'HND', name: 'Tokyo Haneda Airport',           city: 'Tokyo',          country: 'Japan',          countryCode: 'JP' },
  { iata: 'NRT', name: 'Tokyo Narita International',     city: 'Tokyo',          country: 'Japan',          countryCode: 'JP' },
  { iata: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney',         country: 'Australia',      countryCode: 'AU' },
  { iata: 'YYZ', name: 'Toronto Pearson International',  city: 'Toronto',        country: 'Canada',         countryCode: 'CA' },
  { iata: 'YVR', name: 'Vancouver International',        city: 'Vancouver',      country: 'Canada',         countryCode: 'CA' },
  { iata: 'MEX', name: 'Benito Juárez International',    city: 'Mexico City',    country: 'Mexico',         countryCode: 'MX' },
  { iata: 'GRU', name: 'São Paulo–Guarulhos International', city: 'São Paulo',   country: 'Brazil',         countryCode: 'BR' },
  { iata: 'DEL', name: 'Indira Gandhi International',    city: 'New Delhi',      country: 'India',          countryCode: 'IN' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', country: 'India',       countryCode: 'IN' },
  { iata: 'BLR', name: 'Kempegowda International',       city: 'Bengaluru',      country: 'India',          countryCode: 'IN' },
  { iata: 'HKG', name: 'Hong Kong International',        city: 'Hong Kong',      country: 'Hong Kong',      countryCode: 'HK' },
  { iata: 'ICN', name: 'Incheon International Airport',  city: 'Seoul',          country: 'South Korea',    countryCode: 'KR' },
  { iata: 'BCN', name: 'Barcelona El Prat Airport',      city: 'Barcelona',      country: 'Spain',          countryCode: 'ES' },
  { iata: 'MAD', name: 'Adolfo Suárez Madrid–Barajas',   city: 'Madrid',         country: 'Spain',          countryCode: 'ES' },
  { iata: 'FCO', name: 'Leonardo da Vinci–Fiumicino',    city: 'Rome',           country: 'Italy',          countryCode: 'IT' },
  { iata: 'MXP', name: 'Milan Malpensa Airport',         city: 'Milan',          country: 'Italy',          countryCode: 'IT' },
];

export function searchAirports(query: string, limit = 6): AirportOption[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  return POPULAR_AIRPORTS.filter(
    (a) =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  ).slice(0, limit);
}
