import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { useDiagramStore } from '@/store/useDiagramStore';

interface Object3DProps {
    node: any;
    onClick?: () => void;
}

export function Object3D({ node, onClick }: Object3DProps) {
    const mesh = useRef<THREE.Mesh>(null);
    const transformRef = useRef<any>(null);
    const [hovered, setHover] = useState(false);
    const [iconTexture, setIconTexture] = useState<THREE.Texture | null>(null);

    // Get store state and actions
    const { selected3DNode, transformMode, setSelected3DNode, updateNode } = useDiagramStore();
    const isSelected = selected3DNode === node.id;

    // Map 2D coordinates to 3D space
    const position: [number, number, number] = useMemo(() => [
        node.position.x / 50,
        0.5, // Lift up so bottom is at y=0
        node.position.y / 50
    ], [node.position.x, node.position.y]);

    const baseColor = node.data?.style?.backgroundColor || (node.type === 'database' ? '#86efac' : '#bfdbfe');

    // Handle transform changes (real-time preview)
    const handleTransform = useCallback(() => {
        if (!transformRef.current?.object) return;
        const { position: pos } = transformRef.current.object;

        // Throttle updates to avoid excessive re-renders
        // Update 2D position from 3D position
        updateNode(node.id, {
            position: {
                x: pos.x * 50,
                y: pos.z * 50
            }
        });
    }, [node.id, updateNode]);

    // Handle click to select/deselect
    const handleClick = useCallback((e: any) => {
        e.stopPropagation();
        setSelected3DNode(isSelected ? null : node.id);
        onClick?.();
    }, [isSelected, node.id, setSelected3DNode, onClick]);

    // Load icon texture if node has an icon
    useEffect(() => {
        if (node.data?.iconUrl || node.data?.iconKey) {
            const loadIcon = async () => {
                try {
                    let texture: THREE.Texture | null = null;

                    if (node.data.iconUrl) {
                        // Load from URL
                        const loader = new THREE.TextureLoader();
                        texture = await new Promise((resolve, reject) => {
                            loader.load(
                                node.data.iconUrl,
                                (t) => resolve(t),
                                undefined,
                                (err) => reject(err)
                            );
                        });
                    } else if (node.data.iconKey) {
                        // Load from Iconify API
                        const iconifyUrl = `https://api.iconify.design/${node.data.iconKey}.svg`;
                        const response = await fetch(iconifyUrl);
                        if (response.ok) {
                            const svgText = await response.text();
                            // Convert SVG to texture via canvas
                            const canvas = document.createElement('canvas');
                            canvas.width = 256;
                            canvas.height = 256;
                            const ctx = canvas.getContext('2d');

                            if (ctx) {
                                const img = new Image();
                                const blob = new Blob([svgText], { type: 'image/svg+xml' });
                                const url = URL.createObjectURL(blob);

                                img.onload = () => {
                                    ctx.fillStyle = '#ffffff';
                                    ctx.fillRect(0, 0, 256, 256);
                                    ctx.drawImage(img, 0, 0, 256, 256);

                                    const canvasTexture = new THREE.CanvasTexture(canvas);
                                    canvasTexture.needsUpdate = true;
                                    setIconTexture(canvasTexture);
                                    URL.revokeObjectURL(url);
                                };

                                img.src = url;
                            }
                        }
                    }

                    if (texture) {
                        setIconTexture(texture);
                    }
                } catch (error) {
                    console.warn('Failed to load icon texture:', error);
                }
            };

            loadIcon();
        }

        return () => {
            if (iconTexture) {
                iconTexture.dispose();
            }
        };
    }, [node.data?.iconUrl, node.data?.iconKey]);

    useFrame((_, delta) => {
        if (hovered && mesh.current) {
            mesh.current.rotation.y += delta;
        } else if (mesh.current) {
            mesh.current.rotation.y = 0;
        }
    });

    // Geometry based on type
    const renderMesh = () => {
        if (node.type === 'container') {
            return (
                <mesh position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[node.width ? node.width / 50 : 6, node.height ? node.height / 50 : 6]} />
                    <meshStandardMaterial
                        color="#f8fafc"
                        opacity={0.5}
                        transparent
                        roughness={0.3}
                        metalness={0.1}
                    />
                    <Html position={[0, 0, 0]} transform rotation={[0, 0, 0]}>
                        <div className="text-xs text-gray-400 select-none pointer-events-none">{node.data.label}</div>
                    </Html>
                </mesh>
            );
        }

        let geometry: JSX.Element;
        if (node.type === 'database') {
            geometry = <cylinderGeometry args={[1, 1, 2, 32]} />;
        } else if (node.type === 'icon' || node.type === 'cloud' || node.type === 'user') {
            // For icon nodes, use a box with icon texture on the front face
            geometry = <boxGeometry args={[2, 2, 0.3]} />;
        } else {
            geometry = <boxGeometry args={[2, 1, 2]} />;
        }

        return (
            <group position={position}>
                {isSelected ? (
                    <TransformControls
                        ref={transformRef}
                        mode={transformMode}
                        onObjectChange={handleTransform}
                    >
                        <mesh
                            ref={mesh}
                            onClick={handleClick}
                            onPointerOver={() => setHover(true)}
                            onPointerOut={() => setHover(false)}
                            castShadow
                            receiveShadow
                        >
                            {geometry}
                            {iconTexture && (node.type === 'icon' || node.type === 'cloud') ? (
                                // Apply texture to icon nodes
                                <meshStandardMaterial
                                    map={iconTexture}
                                    color={isSelected ? '#fbbf24' : hovered ? '#ff69b4' : '#ffffff'}
                                    roughness={0.2}
                                    metalness={0.3}
                                    emissive={isSelected ? '#f59e0b' : hovered ? '#ff1493' : '#000000'}
                                    emissiveIntensity={isSelected ? 0.3 : hovered ? 0.2 : 0}
                                />
                            ) : (
                                // Standard material for other nodes
                                <meshStandardMaterial
                                    color={isSelected ? '#fbbf24' : hovered ? '#ff69b4' : baseColor}
                                    roughness={0.4}
                                    metalness={0.2}
                                    emissive={isSelected ? '#f59e0b' : hovered ? '#ff1493' : '#000000'}
                                    emissiveIntensity={isSelected ? 0.2 : hovered ? 0.1 : 0}
                                />
                            )}
                        </mesh>
                    </TransformControls>
                ) : (
                    <mesh
                        ref={mesh}
                        onClick={handleClick}
                        onPointerOver={() => setHover(true)}
                        onPointerOut={() => setHover(false)}
                        castShadow
                        receiveShadow
                    >
                        {geometry}
                        {iconTexture && (node.type === 'icon' || node.type === 'cloud') ? (
                            // Apply texture to icon nodes
                            <meshStandardMaterial
                                map={iconTexture}
                                color={hovered ? '#ff69b4' : '#ffffff'}
                                roughness={0.2}
                                metalness={0.3}
                                emissive={hovered ? '#ff1493' : '#000000'}
                                emissiveIntensity={hovered ? 0.2 : 0}
                            />
                        ) : (
                            // Standard material for other nodes
                            <meshStandardMaterial
                                color={hovered ? '#ff69b4' : baseColor}
                                roughness={0.4}
                                metalness={0.2}
                                emissive={hovered ? '#ff1493' : '#000000'}
                                emissiveIntensity={hovered ? 0.1 : 0}
                            />
                        )}
                    </mesh>
                )}

                {/* Floating label above node */}
                <Html position={[0, node.type === 'database' ? 1.5 : 1.2, 0]} center transform sprite>
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs shadow-lg select-none pointer-events-none whitespace-nowrap border border-gray-200">
                        {node.data.label}
                    </div>
                </Html>
            </group>
        );
    };

    return renderMesh();
}
