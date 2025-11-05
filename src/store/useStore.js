import { create } from 'zustand';
import { DEFAULT_TRUCK_TYPE, getTruckById } from '../config/truckTypes';

const useStore = create((set, get) => ({
  // Truck configuration
  selectedTruckType: DEFAULT_TRUCK_TYPE,
  setSelectedTruckType: (truckType) => set({ selectedTruckType: truckType }),

  // Packages in the truck (loaded packages)
  packages: [],

  // Available packages (sidebar list)
  availablePackages: [],

  // Selected package
  selectedPackageId: null,
  setSelectedPackageId: (id) => set({ selectedPackageId: id }),

  // Color mode: 'order' or 'weight'
  colorMode: 'order',
  toggleColorMode: () => set((state) => ({
    colorMode: state.colorMode === 'order' ? 'weight' : 'order'
  })),

  // Add package to truck
  addPackage: (packageData) => set((state) => ({
    packages: [...state.packages, {
      ...packageData,
      id: packageData.id || `pkg-${Date.now()}-${Math.random()}`,
      position: packageData.position || [0, packageData.dimensions.height / 2, 0],
      rotation: packageData.rotation || [0, 0, 0]
    }]
  })),

  // Update package (position, rotation, etc.)
  updatePackage: (id, updates) => set((state) => ({
    packages: state.packages.map(pkg =>
      pkg.id === id ? { ...pkg, ...updates } : pkg
    )
  })),

  // Remove package from truck
  removePackage: (id) => set((state) => ({
    packages: state.packages.filter(pkg => pkg.id !== id),
    selectedPackageId: state.selectedPackageId === id ? null : state.selectedPackageId
  })),

  // Add to available packages
  addAvailablePackage: (packageData) => set((state) => ({
    availablePackages: [...state.availablePackages, {
      ...packageData,
      id: packageData.id || `avail-${Date.now()}-${Math.random()}`
    }]
  })),

  // Remove from available packages
  removeAvailablePackage: (id) => set((state) => ({
    availablePackages: state.availablePackages.filter(pkg => pkg.id !== id)
  })),

  // Load packages from file/data
  loadAvailablePackages: (packages) => set({
    availablePackages: packages.map(pkg => ({
      ...pkg,
      id: pkg.id || `avail-${Date.now()}-${Math.random()}`
    }))
  }),

  // Clear all packages
  clearAllPackages: () => set({
    packages: [],
    selectedPackageId: null
  }),

  // Save configuration
  saveConfiguration: () => {
    const state = get();
    const config = {
      truckType: state.selectedTruckType,
      packages: state.packages,
      timestamp: new Date().toISOString()
    };
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truck-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Load configuration
  loadConfiguration: (config) => set({
    selectedTruckType: config.truckType || DEFAULT_TRUCK_TYPE,
    packages: config.packages || []
  }),

  // Statistics calculations
  getStatistics: () => {
    const state = get();
    const truck = getTruckById(state.selectedTruckType);
    const totalWeight = state.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalVolume = state.packages.reduce((sum, pkg) => {
      const { length, width, height } = pkg.dimensions;
      return sum + (length * width * height);
    }, 0);

    const truckVolume = truck.dimensions.length * truck.dimensions.width * truck.dimensions.height;
    const spaceUtilization = (totalVolume / truckVolume) * 100;

    // Calculate center of gravity
    let totalMass = 0;
    let cogX = 0, cogY = 0, cogZ = 0;

    state.packages.forEach(pkg => {
      const mass = pkg.weight;
      totalMass += mass;
      cogX += pkg.position[0] * mass;
      cogY += pkg.position[1] * mass;
      cogZ += pkg.position[2] * mass;
    });

    const centerOfGravity = totalMass > 0 ? {
      x: cogX / totalMass,
      y: cogY / totalMass,
      z: cogZ / totalMass
    } : { x: 0, y: 0, z: 0 };

    return {
      totalWeight,
      maxWeight: truck.maxWeight,
      weightUtilization: (totalWeight / truck.maxWeight) * 100,
      packageCount: state.packages.length,
      spaceUtilization: Math.min(spaceUtilization, 100),
      centerOfGravity,
      isOverweight: totalWeight > truck.maxWeight
    };
  }
}));

export default useStore;
