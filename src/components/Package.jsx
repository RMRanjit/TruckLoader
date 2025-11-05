import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store/useStore';
import { getColorByWeight, getColorByOrder } from '../config/truckTypes';
import {
  checkPackageCollision,
  isWithinTruckBounds,
  validateWeightStacking
} from '../utils/collisionDetection';
import { getTruckById } from '../config/truckTypes';

const Package = ({ packageData }) => {
  const meshRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { camera, gl } = useThree();
  const updatePackage = useStore(state => state.updatePackage);
  const packages = useStore(state => state.packages);
  const selectedPackageId = useStore(state => state.selectedPackageId);
  const setSelectedPackageId = useStore(state => state.setSelectedPackageId);
  const colorMode = useStore(state => state.colorMode);
  const selectedTruckType = useStore(state => state.selectedTruckType);

  const truck = getTruckById(selectedTruckType);
  const { length, width, height } = packageData.dimensions;
  const [x, y, z] = packageData.position;

  // Determine color based on mode
  const baseColor = colorMode === 'weight'
    ? getColorByWeight(packageData.weight)
    : getColorByOrder(packageData.orderNumber);

  const isSelected = selectedPackageId === packageData.id;

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    setSelectedPackageId(packageData.id);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.stopPropagation();

    // Calculate new position based on mouse movement
    const newPosition = [e.point.x, e.point.y, e.point.z];

    // Ensure package stays on or above ground
    if (newPosition[1] < height / 2) {
      newPosition[1] = height / 2;
    }

    const testPackage = {
      ...packageData,
      position: newPosition
    };

    // Check truck bounds
    if (!isWithinTruckBounds(testPackage, truck.dimensions)) {
      return; // Don't update if outside truck
    }

    // Check collisions
    const otherPackages = packages.filter(p => p.id !== packageData.id);
    if (checkPackageCollision(testPackage, otherPackages)) {
      return; // Don't update if collision detected
    }

    updatePackage(packageData.id, { position: newPosition });
  };

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        setIsHovered(true);
        gl.domElement.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        gl.domElement.style.cursor = 'auto';
      }}
    >
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial
        color={baseColor}
        emissive={isSelected ? '#ffffff' : isHovered ? '#444444' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.1 : 0}
        opacity={isDragging ? 0.7 : 1}
        transparent={isDragging}
      />
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(length, height, width)]} />
          <lineBasicMaterial color="#ffffff" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
};

export default Package;
