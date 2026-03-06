export const FOOTER_LINKS = {
    flights: {
      title: 'Flights',
      links: [
        { label: 'Search Flights',          href: '/flights'                    },
        { label: 'Cheap Flights',           href: '/flights/cheap'              },
        { label: 'Last Minute Flights',     href: '/flights/last-minute'        },
        { label: 'International Flights',   href: '/flights/international'      },
        { label: 'Flight Deals',            href: '/deals'                      },
        { label: 'Business Class Flights',  href: '/flights/business-class'     },
      ],
    },
    cars: {
      title: 'Car Rentals',
      links: [
        { label: 'Search Car Rentals',      href: '/cars'                       },
        { label: 'Airport Car Rentals',     href: '/cars/airport'               },
        { label: 'One Way Rentals',         href: '/cars/one-way'               },
        { label: 'SUV Rentals',             href: '/cars/suv'                   },
        { label: 'Luxury Car Rentals',      href: '/cars/luxury'                },
      ],
    },
    destinations: {
      title: 'Popular Routes',
      links: [
        { label: 'New York to Los Angeles', href: '/flights/JFK/LAX'            },
        { label: 'Chicago to Miami',        href: '/flights/ORD/MIA'            },
        { label: 'New York to London',      href: '/flights/JFK/LHR'            },
        { label: 'LA to Tokyo',             href: '/flights/LAX/NRT'            },
        { label: 'New York to Paris',       href: '/flights/JFK/CDG'            },
        { label: 'Atlanta to London',       href: '/flights/ATL/LHR'            },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us',                href: '/about'                      },
        { label: 'Contact Us',             href: '/contact'                    },
        { label: 'Careers',                href: '/careers'                    },
        { label: 'Press',                  href: '/press'                      },
        { label: 'Affiliate Program',      href: '/affiliates'                 },
        { label: 'Sitemap',                href: '/sitemap'                    },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { label: 'Help Center',            href: '/help'                       },
        { label: 'My Trips',               href: '/my-trips'                   },
        { label: 'Cancellation Policy',    href: '/cancellation'               },
        { label: 'Baggage Policy',         href: '/baggage'                    },
        { label: 'Privacy Policy',         href: '/privacy'                    },
        { label: 'Terms of Service',       href: '/terms'                      },
      ],
    },
  };
  
  export const PAYMENT_METHODS = [
    { name: 'Visa',             icon: '💳' },
    { name: 'Mastercard',       icon: '💳' },
    { name: 'American Express', icon: '💳' },
    { name: 'PayPal',           icon: '🅿️' },
    { name: 'Apple Pay',        icon: '🍎' },
    { name: 'Google Pay',       icon: '🇬' },
  ];
  
  export const TRUST_BADGES = [
    { label: 'SSL Secured',       icon: '🔒' },
    { label: 'IATA Accredited',   icon: '✈️' },
    { label: 'BBB A+ Rated',      icon: '⭐' },
    { label: 'PCI Compliant',     icon: '🛡️' },
  ];
  