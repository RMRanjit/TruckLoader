// Truck configurations with dimensions in feet and weight in pounds
export const TRUCK_TYPES = {
  DELIVERY_VAN: {
    id: 'delivery_van',
    name: 'Delivery Van',
    dimensions: {
      length: 10,  // feet
      width: 6,
      height: 6
    },
    maxWeight: 4000  // pounds
  },
  BOX_TRUCK_16: {
    id: 'box_truck_16',
    name: '16ft Box Truck',
    dimensions: {
      length: 16,
      width: 7.5,
      height: 7
    },
    maxWeight: 10000
  },
  BOX_TRUCK_24: {
    id: 'box_truck_24',
    name: '24ft Box Truck',
    dimensions: {
      length: 24,
      width: 8,
      height: 8
    },
    maxWeight: 15000
  },
  SEMI_TRAILER_48: {
    id: 'semi_trailer_48',
    name: '48ft Semi-Trailer',
    dimensions: {
      length: 48,
      width: 8.5,
      height: 9
    },
    maxWeight: 45000
  },
  SEMI_TRAILER_53: {
    id: 'semi_trailer_53',
    name: '53ft Semi-Trailer',
    dimensions: {
      length: 53,
      width: 8.5,
      height: 9
    },
    maxWeight: 45000
  }
};

// Default truck type
export const DEFAULT_TRUCK_TYPE = TRUCK_TYPES.BOX_TRUCK_24.id;

// Get truck by ID
export const getTruckById = (id) => {
  return Object.values(TRUCK_TYPES).find(truck => truck.id === id) || TRUCK_TYPES.BOX_TRUCK_24;
};

// Weight categories for color coding
export const WEIGHT_CATEGORIES = {
  LIGHT: { min: 0, max: 50, color: '#90EE90', label: 'Light (0-50 lbs)' },
  MEDIUM: { min: 50, max: 200, color: '#FFD700', label: 'Medium (50-200 lbs)' },
  HEAVY: { min: 200, max: 1000, color: '#FF6B6B', label: 'Heavy (200-1000 lbs)' },
  VERY_HEAVY: { min: 1000, max: Infinity, color: '#8B0000', label: 'Very Heavy (1000+ lbs)' }
};

// Get color based on weight
export const getColorByWeight = (weight) => {
  for (const category of Object.values(WEIGHT_CATEGORIES)) {
    if (weight >= category.min && weight < category.max) {
      return category.color;
    }
  }
  return WEIGHT_CATEGORIES.VERY_HEAVY.color;
};

// Generate color based on order number (consistent hashing)
export const getColorByOrder = (orderNumber) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E76F51', '#2A9D8F', '#E9C46A', '#F4A261', '#264653'
  ];

  // Simple hash function for consistent color per order
  let hash = 0;
  const str = String(orderNumber);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};
