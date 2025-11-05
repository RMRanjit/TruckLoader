// Check if two axis-aligned bounding boxes (AABB) intersect
export const checkAABBCollision = (box1, box2) => {
  const { min: min1, max: max1 } = box1;
  const { min: min2, max: max2 } = box2;

  return (
    min1.x < max2.x && max1.x > min2.x &&
    min1.y < max2.y && max1.y > min2.y &&
    min1.z < max2.z && max1.z > min2.z
  );
};

// Get bounding box from package
export const getPackageBounds = (pkg) => {
  const [x, y, z] = pkg.position;
  const { length, width, height } = pkg.dimensions;

  // Account for rotation (simplified - assumes axis-aligned)
  const halfLength = length / 2;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return {
    min: {
      x: x - halfLength,
      y: y - halfHeight,
      z: z - halfWidth
    },
    max: {
      x: x + halfLength,
      y: y + halfHeight,
      z: z + halfWidth
    }
  };
};

// Check if package collides with any existing packages
export const checkPackageCollision = (newPackage, existingPackages, excludeId = null) => {
  const newBounds = getPackageBounds(newPackage);

  for (const pkg of existingPackages) {
    if (excludeId && pkg.id === excludeId) continue;

    const existingBounds = getPackageBounds(pkg);
    if (checkAABBCollision(newBounds, existingBounds)) {
      return true;
    }
  }

  return false;
};

// Check if package is within truck bounds
export const isWithinTruckBounds = (pkg, truckDimensions) => {
  const bounds = getPackageBounds(pkg);

  return (
    bounds.min.x >= 0 &&
    bounds.max.x <= truckDimensions.length &&
    bounds.min.y >= 0 &&
    bounds.max.y <= truckDimensions.height &&
    bounds.min.z >= -truckDimensions.width / 2 &&
    bounds.max.z <= truckDimensions.width / 2
  );
};

// Find packages below the given package (for weight validation)
export const getPackagesBelow = (pkg, allPackages) => {
  const packagesBelow = [];
  const bounds = getPackageBounds(pkg);

  for (const otherPkg of allPackages) {
    if (otherPkg.id === pkg.id) continue;

    const otherBounds = getPackageBounds(otherPkg);

    // Check if other package is directly below
    if (
      otherBounds.max.y <= bounds.min.y &&
      !(bounds.min.x >= otherBounds.max.x || bounds.max.x <= otherBounds.min.x) &&
      !(bounds.min.z >= otherBounds.max.z || bounds.max.z <= otherBounds.min.z)
    ) {
      packagesBelow.push(otherPkg);
    }
  }

  return packagesBelow;
};

// Validate weight stacking (heavier packages should be below lighter ones)
export const validateWeightStacking = (pkg, allPackages) => {
  const packagesBelow = getPackagesBelow(pkg, allPackages);

  // If no packages below, it's on the ground - always valid
  if (packagesBelow.length === 0) return { valid: true };

  // Check if any package below is lighter than the current package
  for (const belowPkg of packagesBelow) {
    if (belowPkg.weight < pkg.weight) {
      return {
        valid: false,
        message: `Cannot place ${pkg.weight}lb package on top of ${belowPkg.weight}lb package`,
        lighterPackage: belowPkg
      };
    }
  }

  return { valid: true };
};

// Snap position to grid (optional - for easier placement)
export const snapToGrid = (position, gridSize = 0.5) => {
  return position.map(coord => Math.round(coord / gridSize) * gridSize);
};

// Check if package is on ground or supported by other packages
export const isSupported = (pkg, allPackages, groundLevel = 0, tolerance = 0.1) => {
  const bounds = getPackageBounds(pkg);

  // Check if on ground
  if (Math.abs(bounds.min.y - groundLevel) < tolerance) {
    return true;
  }

  // Check if supported by other packages
  const packagesBelow = getPackagesBelow(pkg, allPackages);

  if (packagesBelow.length === 0) {
    return false; // Floating in air
  }

  // Check if at least one package below is directly supporting
  for (const belowPkg of packagesBelow) {
    const belowBounds = getPackageBounds(belowPkg);
    if (Math.abs(bounds.min.y - belowBounds.max.y) < tolerance) {
      return true;
    }
  }

  return false;
};
