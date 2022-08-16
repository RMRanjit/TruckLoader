import * as THREE from "three";
import React, {
  useRef,
  useState,
  useCallback,
  useContext,
  useEffect,
  Fragment,
} from "react";
// import { useThree  } from 'react-three-fiber'
import { useFrame, useThree } from "@react-three/fiber";
import {
  useCursor,
  Text,
  OrbitControls,
  TransformControls,
  StandardEffects,
} from "@react-three/drei";

import { proxy, useSnapshot } from "valtio";
// Reactive state model, using Valtio ...
const modes = ["translate", "rotate", "scale"];
const state = proxy({ current: null, mode: 0, position: [0, 0, 0] });

const GOLDENRATIO = 1.61803398875;

export function Frame({
  name,
  orderNumber,
  itemNumber,
  position,
  lockControls,
  ...props
}) {
  // Ties this component to the state model
  const snap = useSnapshot(state);
  // Fetching the GLTF, nodes is a collection of all the meshes
  // It's cached/memoized, it only gets loaded and parsed once
  // const { nodes } = useGLTF('/compressed.glb')
  // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  return (
    <mesh
      // Click sets the mesh as the new target
      onClick={(e) => (
        e.stopPropagation(),
        (state.current = name),
        (state.position = position),
        props.lockControls,
        console.log("Clicked box " + name)
      )}
      // If a click happened but this mesh wasn't hit we null out the target,
      // This works because missed pointers fire before the actual hits
      onPointerMissed={
        ((e) => e.type === "click" && (state.current = null),
        props.lockControls,
        console.log("Clicked Out"))
      }
      // Right click cycles through the transform modes
      // onContextMenu={(e) => snap.current === name && (e.stopPropagation(), (state.mode = (snap.mode + 1) % modes.length))}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      name={name}
      //geometry={nodes[name].geometry}
      //material={nodes[name].material}
      geometry={new THREE.BoxGeometry()}
      material={new THREE.MeshPhysicalMaterial()}
      material-color={snap.current === name ? "#ff6080" : "white"}
      scale={[0.1, 0.1, 0.1]}
      position={position}
      {...props}
      dispose={null}
    />
  );
}

export function Controls() {
  // Get notified on changes to state
  const snap = useSnapshot(state);
  const scene = useThree((state) => state.scene);

  console.log("Controls" + snap.current);

  return (
    <>
      {/* As of drei@7.13 transform-controls can refer to the target by children, or the object prop */}
      {snap.current && (
        <TransformControls
          object={scene.getObjectByName(snap.current)}
          mode={modes[snap.mode]}
          position={snap.position}
          // showX={false}
          // showY={false}
          // showZ={false}
        />
      )}
      {/* makeDefault makes the controls known to r3f, now transform-controls can auto-disable them when active */}
      {/* <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.75}
      /> */}
    </>
  );
}

// return (
//   <group {...props}>
//     <mesh
//       name={orderNumber + "-" + itemNumber}
//       onPointerOver={(e) => (e.stopPropagation(), hover(true))}
//       onPointerOut={() => hover(false)}
//       onClick={() => select(!selected)}
//       scale={[0.1, 0.1, 0.1]}
//       position={[0, GOLDENRATIO / 2, 0]}
//       {...bind}
//     >
//       <boxGeometry wireframe />
//       <meshStandardMaterial
//         color="gray"
//         metalness={0.1}
//         roughness={0.5}
//         // envMapIntensity={0.05}
//       />
//       <mesh
//         ref={frame}
//         raycast={() => null}
//         scale={[1.2, 0.9, 0.9]}
//         position={[0, 0, 0]}
//       >
//         <boxGeometry wireframe />
//         {/* <meshBasicMaterial toneMapped={false} fog={true} /> */}
//       </mesh>
//       {/* <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} /> */}
//     </mesh>
//     <Text
//       maxWidth={0.25}
//       anchorX="left"
//       anchorY="top"
//       position={[0, 1, 0]}
//       fontSize={0.05}
//       rotation={[0, 1, 0]}
//       overflowWrap="break-word"
//       whiteSpace="overflowWrap"
//       color={"#EC2D2D"}
//     >
//       {hovered ? "Order:" + orderNumber + " -" + itemNumber : ""}
//     </Text>
//   </group>
// );
