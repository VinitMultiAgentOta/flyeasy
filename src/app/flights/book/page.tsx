'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function BookingForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState([{ firstName: '', lastName: '', email: '', phone: '' }]);

  const offerId = params.get('offerId') ?? '';
  const origin = params.get('origin') ?? '';
  const dest = params.get('dest') ?? '';
  const depart = params.get('depart') ?? '';
  const adults = Number(params.get('adults') ?? '1');
  const price = Number(params.get('price') ?? '0');
  const currency = params.get('currency') ?? 'INR';

  useEffect(() => {
    // Initialize passenger array based on adults count
    if (adults > 1) {
      setPassengers(Array.from({ length: adults }, () => ({ firstName: '', lastName: '', email: '', phone: '' })));
    }
  }, [adults]);

  const handlePassengerChange = (idx: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[idx] = { ...updated[idx], [field]: value };
    setPassengers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create booking
      const bookRes = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId, passengers, contactEmail: passengers[0].email, contactPhone: passengers[0].phone }),
      });
      const bookData = await bookRes.json();
      if (!bookRes.ok) throw new Error(bookData.error ?? 'Booking failed');

      // 2. Create payment
      const payRes = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookData.bookingId, amount: price, currency }),
      });
      const payData = await payRes.json();
      if (!payRes.ok) throw new Error(payData.error ?? 'Payment creation failed');

      // 3. Open Razorpay (mock for now)
      alert(`Payment ID: ${payData.orderId}. Mock payment success.`);

      // 4. Verify payment (mock verification)
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ razorpayOrderId: payData.orderId, razorpayPaymentId: 'mock_pay_123', razorpaySignature: 'mock_sig' }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error ?? 'Payment verification failed');

      // 5. Send e-ticket
      await fetch('/api/notifications/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookData.bookingId }),
      });

      alert('Booking confirmed! E-ticket sent to your email.');
      router.push('/flights/confirmation?bookingId=' + bookData.bookingId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-700 text-white py-4 px-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">✈ FlyEasy</Link>
          <div className="text-sm opacity-80">{origin} → {dest} | {depart}</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Passenger Details</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {passengers.map((p, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Passenger {idx + 1}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={p.firstName}
                  onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={p.lastName}
                  onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
                {idx === 0 && (
                  <>
                    <input
                      type="email"
                      placeholder="Email"
                      value={p.email}
                      onChange={(e) => handlePassengerChange(idx, 'email', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={p.phone}
                      onChange={(e) => handlePassengerChange(idx, 'phone', e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Price Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Summary</h2>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Fare</span>
              <span className="text-2xl font-bold text-blue-600">
                {currency === 'INR' ? '₹' : '$'}{Number(price).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">✈️</div>
          <p className="text-gray-500 text-lg">Loading booking...</p>
        </div>
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
