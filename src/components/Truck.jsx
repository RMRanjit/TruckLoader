import React from 'react';
import useStore from '../store/useStore';
import { getTruckById } from '../config/truckTypes';

const Truck = () => {
  const selectedTruckType = useStore(state => state.selectedTruckType);
  const truck = getTruckById(selectedTruckType);
  const { length, width, height } = truck.dimensions;

  return (
    <group position={[length / 2, 0, 0]}>
      {/* Floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[length, 0.1, width]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>

      {/* Back wall */}
      <mesh position={[-length / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, height, width]} />
        <meshStandardMaterial color="#A0A0A0" transparent opacity={0.3} />
      </mesh>

      {/* Left wall */}
      <mesh position={[0, height / 2, -width / 2]} receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color="#A0A0A0" transparent opacity={0.2} />
      </mesh>

      {/* Right wall */}
      <mesh position={[0, height / 2, width / 2]} receiveShadow>
        <boxGeometry args={[length, height, 0.1]} />
        <meshStandardMaterial color="#A0A0A0" transparent opacity={0.2} />
      </mesh>

      {/* Grid lines on floor */}
      <gridHelper
        args={[Math.max(length, width), 20, '#666666', '#888888']}
        position={[0, 0.01, 0]}
      />
    </group>
  );
};

export default Truck;
