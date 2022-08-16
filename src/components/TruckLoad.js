// Intent: To display the truck and the Order items
//         Enable the user to load individual Items to the truck aka create a load plan
// Reference : https://codesandbox.io/s/btsbj

import { Suspense, useState, useRef } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  TransformControls,
  ContactShadows,
  //useGLTF,
  useCursor,
  Text,
  useProgress,
  Html,
  MeshDistortMaterial,
  GradientTexture
} from "@react-three/drei";
import { proxy, useSnapshot } from "valtio";
import { useSpring, animated, a } from "@react-spring/three";

import Truck from "./Truck";
import OrderItem from "./OrderItem";
import WeightScale from "./WeightScale";
import AxisHelper from "./AxisHelper";
import TruckBayConfig from "./TruckBayConfig";
import { truckConfig } from "../dummy_data/truckConfig";

// Reactive state model, using Valtio ...
const modes = ["translate", "rotate", "scale"];
const state = proxy({ current: null, mode: 0 });

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

// Package that handles the rendering of the items that are to be loaded on to the truck
function Package({ name, productName, isDocked , item, ...props }) {
  // Ties this component to the state model
  const snap = useSnapshot(state);
  // Fetching the GLTF, nodes is a collection of all the meshes
  // It's cached/memoized, it only gets loaded and parsed once
  // const { scene, nodes, material } = useGLTF("/CardBoardBox.glb");
 
  const [hovered, setHovered] = useState(false);
  const [docked, setDocked] = useState(isDocked); // Check if the package is docked to the trailer//
  const [ packagePosition, setPackagePosition ] = useState(props.packagePosition)



  const ref = useRef();

  const pacakageScaleMultiplier = 1; // Scaling is happening at the ItemData.js

 
  // UseSpring to animate the postiion  of the package
  const { color, position } = useSpring({
    color: docked ? "green" : "white",    
    position : docked ?  [ packagePosition[0], packagePosition[1], packagePosition[2]/2] : [packagePosition[0], packagePosition[1], packagePosition[2]],
    config: { mass: 10, tension: 1000, friction: 300, precision: 0.00001 },
  });

  // function to set the package position
  function updatePackagePosition(position) {
    setPackagePosition([position.x, position.y, position.z]);
  }

   // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  useCursor(hovered);
  return (
    <animated.mesh
    color= {color}

    position={position}
      ref={ref}
      // Click sets the mesh as the new target
      onClick={(e) => (e.stopPropagation(), (state.current = name))}
      // onUpdate = {(self) => (console.log(self.position))}
      // If a click happened but this mesh wasn't hit we null out the target,
      // This works because missed pointers fire before the actual hits

      onPointerUp ={(e) => {updatePackagePosition(e.object.position)}}
      onPointerMissed={(e) => e.type === "click" && (state.current = null)}
      // Right click cycles through the transform modes
      // onContextMenu={(e) =>
      //   snap.current === name &&
      //   (e.stopPropagation(), (state.mode = (snap.mode + 1) % modes.length))
      // }

      // onContextMenu={(e) =>
      //   snap.current === name &&
      //   (e.stopPropagation(),
      //   (setDocked(!docked),
      //   console.log(
      //     "Contect Change on " +
      //       snap.current +
      //       " captured with docked state of " +
      //       docked
      //   )))
      //}
      // Possiby move this to the nearest bay.
      onDoubleClick={(e) =>
        snap.current === name &&
        (e.stopPropagation(),
        setDocked(!docked),
        console.log("Double Click captured! with docked state as " + docked))
      }
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      name={name}
      //geometry={nodes[0].geometry}
      // material={nodes[0].material}
      geometry={new THREE.BoxBufferGeometry()}

      // if the package is docked, then change the color to green
      material={
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(docked? "Green" : "White"),
          transparent: true,
        })
      }
      scale = {[item.length * pacakageScaleMultiplier, item.width * pacakageScaleMultiplier, item.height * pacakageScaleMultiplier]}
      userData = {{item}}
      material-color={snap.current === name ? "aqua" : "white"}
      wireframe={snap.current === name ? true : false}
      {...props}
      dispose={null}
    >
       <Html
    scaleFactor={10}
    style={{ pointerEvents: "none", display: hovered ? "block" : "none" }}
  >
      <OrderItem hovered = {hovered} productName = {item.productName}  isDocked={item.isDocked}  item = {item}/>
      </Html>
    </animated.mesh>
  );
}

function Controls() {
  // Get notified on changes to state
  const snap = useSnapshot(state);
  const scene = useThree((state) => state.scene);
  return (
    <>
      {/* As of drei@7.13 transform-controls can refer to the target by children, or the object prop */}
      {snap.current && (
        <TransformControls
          object={scene.getObjectByName(snap.current)}
          mode={modes[snap.mode]}
        />
      )}
      {/* makeDefault makes the controls known to r3f, now transform-controls can auto-disable them when active */}
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function TruckLoad(props) {
  const { orders, projection,isTruckVisible, isWeightScaleVisible,isAxisVisible } = props;

  return (
    <Canvas camera={{ position: [40, -10, 80], fov: 20 }} dpr={[1, 1]}>
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <hemisphereLight
        color="#ffffff"
        groundColor="#b9b9b9"
        position={[-7, 25, 13]}
        intensity={0.85}
      />
      <Suspense fallback={<Loader />}>
        <group position={[0, 0, 0]}>
          {isTruckVisible && <Truck scale={0.1} position={[0, 0, 0]} />}
          {/* Load up the Packages based on the orders */}
          {orders.map((item) => (
            <Package
              // key={item.orderNumber + "-" + item.itemNumber + "-" + item.productName}
              // name={item.orderNumber + "-" + item.itemNumber}
              key={item.packageIdentifier}
              name = {item.packageIdentifier}
              productName = {item.productName}
              item = {item}
              // If we pass the position as a prop, the animation is getting overridden, so pass this as a alternate parameter
              // position={item.position} 
              packagePosition = {item.position}
            />
          ))}
        {/* Display WeightScale */}
        {isWeightScaleVisible &&  truckConfig.map((bayConfig) => (<WeightScale key={bayConfig.bayName +"_WS"}  positionX={bayConfig.bayPosition[0]} bayWidth={bayConfig.bayWidth * 1.75} />))}

        {/* Display bay configuration */}
        {truckConfig.map((bayConfig) =>(<TruckBayConfig key={bayConfig.bayName + "_BC"} projection={projection} bayPosition={bayConfig.bayPosition} bayDimensions={[bayConfig.bayLength, bayConfig.bayHeight, bayConfig.bayWidth]}/>))}
        
        {isAxisVisible && <AxisHelper size={10} />}

          <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -35, 0]}
            opacity={0.25}
            width={200}
            height={200}
            blur={1}
            far={50}
          />
        </group>
      </Suspense>
      <Controls />
    </Canvas>
  );
}
