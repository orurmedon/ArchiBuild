import { useMemo } from 'react';
import * as THREE from 'three';
import { extend, ReactThreeFiber } from '@react-three/fiber';

// Extend three fiber if necessary (usually standard geometries are auto-extended)

interface Edge3DProps {
    start: [number, number, number];
    end: [number, number, number];
}

export function Edge3D({ start, end }: Edge3DProps) {
    const curve = useMemo(() => {
        // Create a smooth curve with some upward arc to look nice
        // Midpoint raised by Y logic
        const midX = (start[0] + end[0]) / 2;
        const midZ = (start[2] + end[2]) / 2;
        // Calculate distance to determine arc height
        const dist = new THREE.Vector3(...start).distanceTo(new THREE.Vector3(...end));
        const midY = start[1] + (dist * 0.2); // Lift middle point relative to distance

        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(...start),
            new THREE.Vector3(midX, midY, midZ),
            new THREE.Vector3(...end)
        ]);
    }, [start, end]);

    // Calculate rotation for the arrow cone at the end
    const arrowOrientation = useMemo(() => {
        // Tangent at the end of the curve
        const tangent = curve.getTangent(1).normalize();
        const origin = new THREE.Vector3(0, 1, 0); // Default cone points up? Actually cone geometry default is up Y?
        // ConeGeometry default axis is Y.
        // We need to rotate Y to match tangent.
        const quaternion = new THREE.Quaternion().setFromUnitVectors(origin, tangent);
        return new THREE.Euler().setFromQuaternion(quaternion);
    }, [curve]);

    return (
        <group>
            <mesh>
                <tubeGeometry args={[curve, 20, 0.05, 8, false]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            {/* Arrow at the end */}
            <mesh position={end} rotation={arrowOrientation}>
                <coneGeometry args={[0.15, 0.4, 16]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
        </group>
    );
}
