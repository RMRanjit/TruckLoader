import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React, { Suspense, useEffect, useRef } from "react";
import {
  OrbitControls,
  TransformControls,
  useGLTF,
  Box,
  MeshDistortMaterial,
  MeshReflectorMaterial,
} from "@react-three/drei";

// import { StandardEffects } from "drei";

import { Controls, useControl } from "react-three-gui";

import "./App.css";

function Keen() {
  const orbit = useRef();
  const transform = useRef();
  const mode = useControl("mode", {
    type: "select",
    items: ["scale", "rotate", "translate"],
  });
  const { nodes, materials } = useLoader(GLTFLoader, "./scene.gltf");
  //const { scene, nodes, materials } = useGLTF("/truck.glb");
  useEffect(() => {
    if (transform.current) {
      const controls = transform.current;
      //controls.setMode(mode)
      controls.setMode("translate");
      const callback = (event) => (orbit.current.enabled = !event.value);
      controls.addEventListener("dragging-changed", callback);
      return () => controls.removeEventListener("dragging-changed", callback);
    }
  });
  return (
    <>
      <TransformControls ref={transform}>
        <group position={[0, 0, 0]} rotation={[0, 0, 0]} dispose={null}>
          <Box position={[1, 1, 1]} args={[2, 2, 2]}>
            <MeshReflectorMaterial color="Yellow"></MeshReflectorMaterial>
          </Box>
          {/* <mesh
            material={materials["Scene_-_Root"]}
            // geometry={nodes.mesh_0.geometry}
            castShadow
            receiveShadow
          /> */}
        </group>
      </TransformControls>
      <OrbitControls ref={orbit} />
    </>
  );
}

function App() {
  return (
    <>
      <Canvas shadowMap camera={{ position: [0, 0, 17], far: 50 }}>
        {/* <ambientLight /> */}
        <spotLight
          intensity={2}
          position={[40, 50, 50]}
          shadow-bias={-0.00005}
          penumbra={1}
          angle={Math.PI / 6}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <Suspense fallback={null}>
          <Keen />
          <Keen />
          {/* <StandardEffects /> */}
        </Suspense>
      </Canvas>
      <Controls />
    </>
  );
}

export default App;
