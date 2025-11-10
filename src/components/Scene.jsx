import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Truck from './Truck';
import Package from './Package';
import DragHandler from './DragHandler';
import useStore from '../store/useStore';

const Scene = () => {
  const packages = useStore(state => state.packages);

  return (
    <Canvas shadows style={{ background: '#1a1a1a' }}>
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-20, 20, -10]} intensity={0.5} />

        {/* Camera */}
        <PerspectiveCamera makeDefault position={[25, 20, 25]} />

        {/* Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={100}
          makeDefault
        />

        {/* Drag Handler */}
        <DragHandler />

        {/* Truck */}
        <Truck />

        {/* Packages */}
        {packages.map(pkg => (
          <Package key={pkg.id} packageData={pkg} />
        ))}

        {/* Ground plane (optional) */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </Suspense>
    </Canvas>
  );
};

export default Scene;
