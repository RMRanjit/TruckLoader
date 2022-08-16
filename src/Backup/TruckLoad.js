import { Suspense, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  TransformControls,
  ContactShadows,
  useGLTF,
  useCursor,
  MeshReflectorMaterial,
  Environment,
  Stage,
  PresentationControls,
  OrbitControls,
} from "@react-three/drei";

import { getItems } from "../dummy_data/itemData";

import Truck from "./Truck";
import Frames from "./Frames";
import { Controls } from "./Frame";

export const TruckLoad = () => {
  const [active, setActive] = useState(false);
  console.log("Active " + active);
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ fov: 40 }} // modify this for zoom levels
      style={{ height: "800px" }}
    >
      <color attach="background" args={["#101010"]} />
      <fog attach="fog" args={["#004B93", 0.05, 40]} />

      <Suspense fallback={null}>
        <Environment path="/cube" />
        {/* polar={[-0.1, Math.PI / 4]} */}
        <PresentationControls
          speed={active ? 0 : 0.5} // speed at which the rotation works
          global={false}
          cursor={true}
          zoom={0.7}
          //   polar={[0, 1]}
          polar={[-0.1, Math.PI / 4]}
          rotation={[0, -1, 0]} // Determine which face of the truck should we show
          // config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
        >
          <Stage
            environment="city" //{null}
            intensity={0.5}
            contactShadow={true}
            shadowBias={-0.0015}
          >
            <Truck scale={0.016} position={[0, 0, 0]} />
            <Frames
              orders={getItems()}
              lockControls={() => setActive(!active)}
            />
            <Controls />
          </Stage>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[120, 120]} />
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={40}
              roughness={1}
              depthScale={0.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#101010"
              metalness={0.5}
            />
          </mesh>
        </PresentationControls>
      </Suspense>
    </Canvas>
  );
};
