import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store/useStore';
import { getTruckById } from '../config/truckTypes';
import {
  checkPackageCollision,
  isWithinTruckBounds
} from '../utils/collisionDetection';

const DragHandler = () => {
  const { camera, gl, raycaster, scene } = useThree();
  const packages = useStore(state => state.packages);
  const selectedPackageId = useStore(state => state.selectedPackageId);
  const updatePackage = useStore(state => state.updatePackage);
  const selectedTruckType = useStore(state => state.selectedTruckType);

  const isDragging = useRef(false);
  const plane = useRef(new THREE.Plane());
  const intersection = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const draggedObject = useRef(null);

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerDown = (event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      // Find all package meshes in the scene
      const packageMeshes = [];
      scene.traverse((child) => {
        if (child.isMesh && child.userData.packageId) {
          packageMeshes.push(child);
        }
      });

      const intersects = raycaster.intersectObjects(packageMeshes, false);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        const packageId = object.userData.packageId;
        const pkg = packages.find(p => p.id === packageId);

        if (pkg) {
          // Set up horizontal drag plane at the package's Y position
          const normal = new THREE.Vector3(0, 1, 0); // Horizontal plane
          const point = new THREE.Vector3(0, pkg.position[1], 0);
          plane.current.setFromNormalAndCoplanarPoint(normal, point);

          if (raycaster.ray.intersectPlane(plane.current, intersection.current)) {
            offset.current.copy(intersection.current).sub(object.position);
          }

          draggedObject.current = object;
          isDragging.current = true;
          canvas.style.cursor = 'grabbing';
        }

        // Prevent orbit controls from interfering
        event.stopPropagation();
      }
    };

    const onPointerMove = (event) => {
      if (!isDragging.current || !draggedObject.current) return;

      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      if (raycaster.ray.intersectPlane(plane.current, intersection.current)) {
        const packageId = draggedObject.current.userData.packageId;
        const pkg = packages.find(p => p.id === packageId);

        if (pkg) {
          const newX = intersection.current.x - offset.current.x;
          const newZ = intersection.current.z - offset.current.z;
          const currentY = pkg.position[1];

          const newPosition = [newX, currentY, newZ];

          // Validate position
          const testPackage = {
            ...pkg,
            position: newPosition
          };

          const truck = getTruckById(selectedTruckType);

          // Check bounds and collisions
          if (isWithinTruckBounds(testPackage, truck.dimensions)) {
            const otherPackages = packages.filter(p => p.id !== packageId);
            if (!checkPackageCollision(testPackage, otherPackages)) {
              updatePackage(packageId, { position: newPosition });
            }
          }
        }
      }

      event.preventDefault();
    };

    const onPointerUp = () => {
      isDragging.current = false;
      draggedObject.current = null;
      canvas.style.cursor = 'auto';
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [camera, gl, raycaster, scene, packages, selectedTruckType, updatePackage]);

  return null;
};

export default DragHandler;
