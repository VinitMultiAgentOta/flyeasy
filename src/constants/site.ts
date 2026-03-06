
export const SITE_CONFIG = {
  name:        "FlyEasy",
  tagline:     "Fly Smarter. Save More.",
  description: "Best deals on flights and car rentals — call us for unpublished fares",
  url:         process.env.NEXT_PUBLIC_SITE_URL || "https://flyeasy.com",
} as const;
export const SITE_NAME = SITE_CONFIG.name;
// ── Phone Numbers (use different per traffic source in Phase 5) ──
export const PHONE = {
  primary:   "1-800-359-3279",  // 1-800-FLY-EASY
  display:   "1-800-359-3279",
  href:      "tel:18003593279",
  whatsapp:  "https://wa.me/18003593279",
  available: "24/7",
} as const;

// ── Navigation ──────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Flights",    href: "/flights",  icon: "✈️" },
  { label: "Cars",       href: "/cars",     icon: "🚗" },
  { label: "Deals",      href: "/deals",    icon: "🏷️" },
  { label: "My Trips",   href: "/my-trips", icon: "🧳" },
  { label: "Help",       href: "/help",     icon: "💬" },
] as const;

// ── Trust Metrics ───────────────────────────────────────────────
export const TRUST_STATS = [
  { value: 5_000_000, suffix: "+", label: "Flights Booked",  icon: "✈️" },
  { value: 4.8,       suffix: "/5", label: "Customer Rating", icon: "⭐" },
  { value: 24,        suffix: "/7", label: "Agent Support",   icon: "📞" },
  { value: 100,       suffix: "%",  label: "Price Guarantee", icon: "💰" },
] as const;

// ── Cabin Classes ───────────────────────────────────────────────
export const CABIN_CLASSES = [
  { value: "economy",        label: "Economy" },
  { value: "premium_economy",label: "Premium Economy" },
  { value: "business",       label: "Business" },
  { value: "first",          label: "First Class" },
] as const;

// ── Passenger Types ─────────────────────────────────────────────
export const PASSENGER_LIMITS = {
  adult:   { min: 1, max: 9, label: "Adults",   sub: "12+ years"  },
  child:   { min: 0, max: 8, label: "Children", sub: "2–11 years" },
  infant:  { min: 0, max: 4, label: "Infants",  sub: "Under 2"    },
} as const;

// ── Social Links ────────────────────────────────────────────────
export const SOCIAL_LINKS = [
  { platform: "Facebook",  href: "#", icon: "facebook" },
  { platform: "Twitter",   href: "#", icon: "twitter" },
  { platform: "Instagram", href: "#", icon: "instagram" },
  { platform: "YouTube",   href: "#", icon: "youtube" },
] as const;

// ── Footer Links ────────────────────────────────────────────────
export const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us",    href: "/about" },
      { label: "Careers",     href: "/careers" },
      { label: "Press",       href: "/press" },
      { label: "Contact Us",  href: "/contact" },
    ],
  },
  {
    title: "Flights",
    links: [
      { label: "Cheap Flights",      href: "/flights" },
      { label: "Last Minute Flights", href: "/deals/last-minute" },
      { label: "Flight Deals",        href: "/deals" },
      { label: "Price Alerts",        href: "/price-alerts" },
    ],
  },
  {
    title: "Cars",
    links: [
      { label: "Rent a Car",          href: "/cars" },
      { label: "Airport Car Rentals", href: "/cars/airport" },
      { label: "Car Rental Deals",    href: "/cars/deals" },
      { label: "Long-Term Rental",    href: "/cars/long-term" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center",      href: "/help" },
      { label: "Manage Booking",   href: "/my-trips" },
      { label: "Cancellations",    href: "/help/cancellations" },
      { label: "Travel Insurance", href: "/insurance" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy",    href: "/cookies" },
      { label: "Accessibility",    href: "/accessibility" },
    ],
  },
] as const;
