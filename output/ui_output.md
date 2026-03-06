```typescript
// src/app/flights/search/page.tsx
import React from 'react';
import { useClient } from '@/store';
import { Button, Card, Badge, Input, CountdownTimer } from '@/components/ui';
import { useSort } from '@/hooks';
import { useFilter } from '@/hooks';

const FlightSearchPage = () => {
  const client = useClient();
  const { filter, setFilter } = useFilter();
  const { sort, setSort } = useSort();

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleBook = (flight: any) => {
    client.bookFlight(flight);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between">
        <h1 className="text-lg font-bold">Flights</h1>
        <Button
          className="bg-gradient-to-r from-ff4600 to-b33100 hover:bg-gradient-to-l"
          onClick={() => client.searchFlights()}
        >
          Search
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Filter</h2>
          <Button
            className="bg-gradient-to-r from-ff4600 to-b33100 hover:bg-gradient-to-l"
            onClick={() => client.toggleFilter()}
          >
            {client.filter ? 'Close' : 'Open'}
          </Button>
        </div>
        {client.filter && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <label className="text-lg font-bold">Price:</label>
              <Input
                type="range"
                min={0}
                max={1000}
                value={filter.price}
                onChange={(e) => handleFilterChange({ price: e.target.value })}
              />
              <span className="text-lg font-bold">{filter.price}</span>
            </div>
            <div className="flex gap-4">
              <label className="text-lg font-bold">Stops:</label>
              <Input
                type="range"
                min={0}
                max={5}
                value={filter.stops}
                onChange={(e) => handleFilterChange({ stops: e.target.value })}
              />
              <span className="text-lg font-bold">{filter.stops}</span>
            </div>
            <div className="flex gap-4">
              <label className="text-lg font-bold">Airlines:</label>
              <Input
                type="range"
                min={0}
                max={10}
                value={filter.airlines}
                onChange={(e) => handleFilterChange({ airlines: e.target.value })}
              />
              <span className="text-lg font-bold">{filter.airlines}</span>
            </div>
            <div className="flex gap-4">
              <label className="text-lg font-bold">Time:</label>
              <Input
                type="range"
                min={0}
                max={24}
                value={filter.time}
                onChange={(e) => handleFilterChange({ time: e.target.value })}
              />
              <span className="text-lg font-bold">{filter.time}</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Sort:</h2>
        <div className="flex gap-4">
          <Button
            className={`bg-gradient-to-r from-ff4600 to-b33100 hover:bg-gradient-to-l ${
              sort === 'cheapest' ? 'bg-gradient-to-l' : ''
            }`}
            onClick={() => handleSortChange('cheapest')}
          >
            Cheapest
          </Button>
          <Button
            className={`bg-gradient-to-r from-ff4600 to-b33100 hover:bg-gradient-to-l ${
              sort === 'fastest' ? 'bg-gradient-to-l' : ''
            }`}
            onClick={() => handleSortChange('fastest')}
          >
            Fastest
          </Button>
          <Button
            className={`bg-gradient-to-r from-ff4600 to-b33100 hover:bg-gradient-to-l ${
              sort === 'best' ? 'bg-gradient-to-l' : ''
            }`}
            onClick={() => handleSortChange('best')}
          >
            Best
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {client.flights.length > 0 ? (
          client.flights.map((flight) => (
            <Card key={flight.id} className="bg-white p-4">
              <h2 className="text-lg font-bold">{flight.airline}</h2>
              <p className="text-lg font-bold">{flight.time}</p>
              <p className="text-lg font-bold">{flight.duration}</p>
              <p className="text-lg font-bold">{flight.stops}</p>
              <p className="text-lg font-bold">{flight.price}</p>
              <Button
                className="bg-gradient-to-r from-ff4600 to-b33100 hover:bg-gradient-to-l"
                onClick={() => handleBook(flight)}
              >
                Book
              </Button>
            </Card>
          ))
        ) : (
          <p className="text-lg font-bold">No flights found</p>
        )}
      </div>
      <div className="flex justify-center">
        {client.loading ? (
          <div className="animate-spin">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        ) : (
          <p className="text-lg font-bold">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default FlightSearchPage;
```

```typescript
// src/app/flights/[offerId]/page.tsx
import React from 'react';
import { useClient } from '@/store';
import { Button, Card, Badge, Input, CountdownTimer } from '@/components/ui';

const FlightOfferPage = () => {
  const client = useClient();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-bold">Flight Offer</h1>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Itinerary</h2>
        <div className="flex flex-col gap-4">
          {client.offer.itinerary.map((segment, index) => (
            <Card key={index} className="bg-white p-4">
              <h2 className="text-lg font-bold">{segment.airline}</h2>
              <p className="text-lg font-bold">{segment.time}</p>
              <p className="text-lg font-bold">{segment.duration}</p>
              <p className="text-lg font-bold">{segment.stops}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Fare Rules</h2>
        <p className="text-lg font-bold">{client.offer.fareRules}</p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Refundable</h2>
        <p className="text-lg font-bold">{client.offer.refundable}</p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Change Cancel</h2>
        <p className="text-lg font-bold">{client.offer.changeCancel}</p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Baggage Policy</h2>
        <p className="text-lg font-bold">{client.offer.baggagePolicy}</p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Price Breakdown</h2>
        <div className="flex flex-col gap-4">
          <p className="text-lg font-bold">Base Fare:</p>
          <p className="text-lg font-bold">{client.offer.baseFare}</p>
          <p className="text-lg font-bold">Taxes:</p>
          <p className="text-lg font-bold">{client.offer.taxes}</p>
          <p className="text-lg font-bold">Fees:</p>
          <p className="text-lg font-bold">{client.offer.fees}</p>
          <p className="text-lg font-bold">Total:</p>
          <p className="text-lg font-bold">{client.offer.total}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          className="bg-gradient-to-r from-ff4600 to