//import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export default function Truck(props) {
  const { scene, nodes, materials } = useGLTF("./truck.glb");

  //   useLayoutEffect(() => {
  //     scene.traverse(
  //       (obj) =>
  //         obj.type === "Mesh" && (obj.receiveShadow = obj.castShadow = true)
  //     );
  //     //console.log(nodes);
  //     Object.assign(nodes.wheel_RL_tier_1o_0.material, {
  //       metalness: 0.9,
  //       roughness: 0.4,
  //       color: new THREE.Color("#FF0000"),
  //     });
  //     //Object.assign(nodes.wheel_RL_wheel_truck_stamp_0.material,{  metalness: 0.9, roughness: 0.4,color: new THREE.Color('#FF0000') })

  //     //Object.assign(nodes.Cargo_box_bodycolor_0.material,{  metalness: 0.9, roughness: 0.4,color: new THREE.Color('#004B93') })
  //     //Object.assign(nodes.Cargodoor_left_bodycolor_0.material,{  metalness: 0.9, roughness: 0.4,color: new THREE.Color('#FFFFFF') })
  //     Object.assign(nodes.Cargo_box.visible, false);
  //   }, [scene, nodes, materials]);
  return <primitive object={scene} {...props} />;
}
