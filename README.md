# TruckLoader

A 3D truck loading management application built with React and Three.js. Visualize, organize, and optimize package loading for different truck sizes.

## Features

### 🚚 Multiple Truck Types
- Delivery Van (10×6×6 ft, 4,000 lbs capacity)
- 16ft Box Truck (16×7.5×7 ft, 10,000 lbs capacity)
- 24ft Box Truck (24×8×8 ft, 15,000 lbs capacity)
- 48ft Semi-Trailer (48×8.5×9 ft, 45,000 lbs capacity)
- 53ft Semi-Trailer (53×8.5×9 ft, 45,000 lbs capacity)

### 📦 Package Management
- **Drag and drop** packages in 3D space
- **Free positioning** for optimal space utilization
- **Rotation controls** to orient packages
- **Collision detection** prevents overlapping
- **Weight-based stacking validation** (heavier packages must be below lighter ones)

### 📊 Smart Analytics
- Real-time weight and space utilization tracking
- Center of gravity calculation
- Weight limit warnings
- Package count monitoring

### 🎨 Visual Modes
Toggle between two coloring modes:
- **Color by Order Number**: Same order = same color
- **Color by Weight**: Light (green) → Medium (yellow) → Heavy (red) → Very Heavy (dark red)

### 💾 Data Import/Export
- **Import packages** from JSON files
- **Manual package entry** via form
- **Save/Load configurations** for reusable layouts
- Pre-loaded package library

### 🎮 Controls
- **Left click + drag**: Move packages
- **Right click + drag**: Rotate camera view
- **Scroll wheel**: Zoom in/out
- **Click package**: View detailed information
- **Rotate button**: Rotate selected package 90°

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Usage Guide

### 1. Select Truck Type
Choose your truck size from the dropdown in the toolbar.

### 2. Add Packages
Three ways to add packages:
- **Import JSON**: Click "Import JSON" and select a file (see `sample-packages.json`)
- **Manual Entry**: Click "+ Add Package" and fill in the form
- **Pre-loaded**: Load from saved configurations

### 3. Load Packages into Truck
Click "Load →" next to any package in the sidebar to place it in the truck.

### 4. Arrange Packages
- **Drag** packages to position them
- **Click** to select and view details
- Use the **Rotate** button to change orientation
- Watch for collision and weight validation

### 5. Monitor Statistics
View real-time stats in the right panel:
- Total weight vs. capacity
- Space utilization percentage
- Center of gravity coordinates
- Overweight warnings

### 6. Save Your Work
Click "💾 Save Config" to download your truck configuration as JSON.

## Package JSON Format

```json
[
  {
    "productName": "Product Name",
    "orderNumber": "ORD-123",
    "weight": 100,
    "length": 4,
    "width": 3,
    "height": 2
  }
]
```

**Units:**
- Weight: pounds (lbs)
- Dimensions: feet (ft)

## Technical Stack

- **React**: UI framework
- **Three.js**: 3D graphics engine
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for R3F
- **Zustand**: State management
- **Vite**: Build tool and dev server

## Project Structure

```
src/
├── components/        # React components
│   ├── Scene.jsx     # 3D canvas and rendering
│   ├── Truck.jsx     # Truck visualization
│   ├── Package.jsx   # Interactive package boxes
│   ├── Sidebar.jsx   # Package management panel
│   ├── InfoPanel.jsx # Package details display
│   ├── Statistics.jsx # Analytics dashboard
│   └── Toolbar.jsx   # Main controls
├── store/            # Zustand state management
│   └── useStore.js   # Global application state
├── config/           # Configuration files
│   └── truckTypes.js # Truck specifications
├── utils/            # Utility functions
│   └── collisionDetection.js # Physics and validation
├── App.jsx           # Main application component
└── main.jsx          # Application entry point
```

## License

MIT