import React from 'react';

// Common wrapper properties for SVG
const defaultProps = (size, color) => ({
  width: size || 24,
  height: size || 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color || "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round"
});

export const StudentIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Academic Mortarboard Cap */}
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

export const ProfessionalIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Sleek Briefcase / Office Hub */}
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export const FamilyIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Intersecting figures */}
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const SeniorIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Tree of life / Growth shield */}
    <path d="M12 22V12" />
    <path d="M17 12a5 5 0 0 0-10 0" />
    <path d="M12 7a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
    <path d="M19 17a5 5 0 0 0-3.5-4.8" />
    <path d="M5 17a5 5 0 0 1 3.5-4.8" />
  </svg>
);

export const WalkingIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Footprints / Walking path */}
    <path d="M13 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM4 22h3l2-6H7l-3 6zM13 14l-2 3-3 5" />
    <path d="M11 6l-3.5 6L6 9l5-3zM17 12l2-1 1-5-4 4z" />
  </svg>
);

export const TransitIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Train Front */}
    <rect x="4" y="3" width="16" height="16" rx="2" />
    <path d="M4 11h16M12 3v8M8 15h8M6 19l-2 2M18 19l2 2" />
  </svg>
);

export const DrivingIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Steering Wheel / Car Outline */}
    <circle cx="12" cy="12" r="10" />
    <path d="M12 12V2M12 12l7 7M12 12L5 19" />
  </svg>
);

export const CafesIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Hot Beverage */}
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <path d="M6 1v3M10 1v3M14 1v3" />
  </svg>
);

export const MallsIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Shopping Bag */}
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const NatureIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Leaf */}
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 22 2c-2.48 5-3 6.5-4.1 12.2A7 7 0 0 1 11 20z" />
    <path d="M9 22l3-3" />
  </svg>
);

export const LibraryIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Open Book */}
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const PremiumGroceriesIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Organic Apple / Fruit */}
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6c0-2 2-3 2-3s0 2-2 3" />
    <path d="M10 10c0-1.5 1-2 2-2s2 .5 2 2" />
  </svg>
);

export const BudgetGroceriesIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Shopping Cart / Price Tag */}
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const DogParksIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Paw Print */}
    <circle cx="12" cy="14" r="4" />
    <circle cx="7.5" cy="8.5" r="2" />
    <circle cx="16.5" cy="8.5" r="2" />
    <circle cx="3.5" cy="12.5" r="1.5" />
    <circle cx="20.5" cy="12.5" r="1.5" />
  </svg>
);

export const RentIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Key */}
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm7.61-7.61l-4.5 4.5M21 2h-4m4 0v4m-3.5.5l1.5 1.5" />
  </svg>
);

export const BuyIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Modern House Frame */}
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export const MarkerIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Minimalist Map Pin */}
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const DiamondIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Premium Diamond shape */}
    <path d="M6 3h12l4 6-10 13L2 9zM2 9h20M12 3L8 9l4 13 4-13z" />
  </svg>
);

export const ClockIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Clock outline */}
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

export const WalletIcon = ({ size, color }) => (
  <svg {...defaultProps(size, color)}>
    {/* Card wallet */}
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h14v4M4 6v12a2 2 0 0 0 2 2h14v-4M20 12a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2" />
  </svg>
);
