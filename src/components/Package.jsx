import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store/useStore';
import { getColorByWeight, getColorByOrder } from '../config/truckTypes';
import {
  checkPackageCollision,
  isWithinTruckBounds
} from '../utils/collisionDetection';
import { getTruckById } from '../config/truckTypes';

const Package = ({ packageData }) => {
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  const { gl } = useThree();
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

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedPackageId(packageData.id);
  };

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      castShadow
      receiveShadow
      onClick={handleClick}
      onPointerEnter={() => {
        setIsHovered(true);
        gl.domElement.style.cursor = 'grab';
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        gl.domElement.style.cursor = 'auto';
      }}
      userData={{ packageId: packageData.id }}
    >
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial
        color={baseColor}
        emissive={isSelected ? '#ffffff' : isHovered ? '#444444' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.1 : 0}
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
