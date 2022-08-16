import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

import { Frame } from "./Frame";

const GOLDENRATIO = 1.61803398875;

export default function Frames({
  orders,
  q = new THREE.Quaternion(),
  p = new THREE.Vector3(),
}) {
  const ref = useRef();
  const clicked = useRef();
  const [, params] = ""; //useRoute('/item/:id')
  const [, setLocation] = ""; //useLocation()
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id);
    // console.log("Clicked" + JSON.stringify(clicked));
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true);
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
      clicked.current.parent.getWorldQuaternion(q);
    } else {
      p.set(0, 0, 7);
      //q.identity();
    }
  });
  // useFrame((state, dt) => {
  //   state.camera.position.lerp(p, 0.05); //controls the speed inwhich the intro happens
  //   state.camera.quaternion.slerp(q, 0.25);
  // });
  return (
    <group ref={ref}>
      {orders.map((props) => (
        <Frame
          key={props.orderNumber + "-" + props.itemNumber}
          name={props.orderNumber + "-" + props.itemNumber}
          orderNumber={props.orderNumber}
          itemNumber={props.itemNumber}
          position={props.position}
          localControls={props.lockControls}
          {...props}
        />
      ))}
    </group>
  );
}
