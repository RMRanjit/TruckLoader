import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../store/useStore';
import { getTruckById } from '../config/truckTypes';
import {
  checkPackageCollision,
  isWithinTruckBounds,
  validateWeightStacking,
  getPackagesBelow
} from '../utils/collisionDetection';

const DragHandler = () => {
  const { camera, gl, raycaster, scene } = useThree();
  const packages = useStore(state => state.packages);
  const updatePackage = useStore(state => state.updatePackage);
  const selectedTruckType = useStore(state => state.selectedTruckType);

  const isDragging = useRef(false);
  const draggedObject = useRef(null);
  const dragStartY = useRef(0);
  const isShiftPressed = useRef(false);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleKeyDown = (event) => {
      if (event.key === 'Shift') {
        isShiftPressed.current = true;
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'Shift') {
        isShiftPressed.current = false;
      }
    };

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
          draggedObject.current = { object, packageId, pkg };
          isDragging.current = true;
          dragStartY.current = event.clientY;
          canvas.style.cursor = 'grabbing';
        }

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

      const { packageId, pkg } = draggedObject.current;
      const truck = getTruckById(selectedTruckType);

      // Calculate vertical movement if Shift is pressed
      let newY = pkg.position[1];
      if (isShiftPressed.current) {
        // Vertical movement based on mouse Y delta
        const deltaY = (dragStartY.current - event.clientY) * 0.05;
        newY = Math.max(pkg.dimensions.height / 2, pkg.position[1] + deltaY);
        dragStartY.current = event.clientY;
      }

      // Create a ground plane to get horizontal position
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(groundPlane, intersection)) {
        let newX = intersection.x;
        let newZ = intersection.z;

        // Find packages underneath the cursor (for stacking)
        const otherPackages = packages.filter(p => p.id !== packageId);

        // Check what's below at this XZ position
        let stackOnPackage = null;
        let maxYBelow = 0;

        for (const otherPkg of otherPackages) {
          const [ox, oy, oz] = otherPkg.position;
          const { length, width, height } = otherPkg.dimensions;

          // Check if cursor is above this package's bounds
          if (
            newX >= ox - length / 2 && newX <= ox + length / 2 &&
            newZ >= oz - width / 2 && newZ <= oz + width / 2
          ) {
            const topY = oy + height / 2;
            if (topY > maxYBelow) {
              maxYBelow = topY;
              stackOnPackage = otherPkg;
            }
          }
        }

        // If not holding Shift, auto-stack on top of packages below
        if (!isShiftPressed.current && stackOnPackage) {
          newY = maxYBelow + pkg.dimensions.height / 2;

          // Validate weight stacking
          const weightCheck = validateWeightStacking(
            { ...pkg, position: [newX, newY, newZ] },
            otherPackages
          );

          if (!weightCheck.valid) {
            // Don't allow stacking if weight validation fails
            return;
          }
        }

        const newPosition = [newX, newY, newZ];

        // Validate position
        const testPackage = {
          ...pkg,
          position: newPosition
        };

        // Check bounds
        if (!isWithinTruckBounds(testPackage, truck.dimensions)) {
          return;
        }

        // Check collisions (excluding packages we're intentionally stacking on)
        if (checkPackageCollision(testPackage, otherPackages)) {
          return;
        }

        updatePackage(packageId, { position: newPosition });
      }

      event.preventDefault();
    };

    const onPointerUp = () => {
      if (isDragging.current && draggedObject.current) {
        // Snap to ground or package below when released
        const { packageId, pkg } = draggedObject.current;
        const otherPackages = packages.filter(p => p.id !== packageId);

        // Find support beneath
        let finalY = pkg.dimensions.height / 2; // Default to ground
        const [x, y, z] = pkg.position;

        for (const otherPkg of otherPackages) {
          const [ox, oy, oz] = otherPkg.position;
          const { length, width, height } = otherPkg.dimensions;

          // Check if this package overlaps horizontally
          if (
            x >= ox - length / 2 && x <= ox + length / 2 &&
            z >= oz - width / 2 && z <= oz + width / 2
          ) {
            const topY = oy + height / 2;
            const targetY = topY + pkg.dimensions.height / 2;

            // Check if we're close to this package's top
            if (Math.abs(y - targetY) < 2) {
              // Validate weight
              const weightCheck = validateWeightStacking(
                { ...pkg, position: [x, targetY, z] },
                otherPackages
              );

              if (weightCheck.valid) {
                finalY = Math.max(finalY, targetY);
              }
            }
          }
        }

        updatePackage(packageId, { position: [x, finalY, z] });
      }

      isDragging.current = false;
      draggedObject.current = null;
      canvas.style.cursor = 'auto';
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, [camera, gl, raycaster, scene, packages, selectedTruckType, updatePackage]);

  return null;
};

export default DragHandler;
