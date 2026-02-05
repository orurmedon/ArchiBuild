import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, ContactShadows, Sky } from '@react-three/drei';
import { useDiagramStore } from '@/store/useDiagramStore';
import { Object3D } from './Object3D';

import { Edge3D } from './Edge3D';

export default function Scene3D() {
    const { nodes, edges, selected3DNode, transformMode, setTransformMode, setSelected3DNode } = useDiagramStore();

    // Helper to get 3D position from node ID
    const getNodePosition = (id: string): [number, number, number] | null => {
        const node = nodes.find(n => n.id === id);
        if (!node) return null;
        // Same scaling logic as Object3D
        return [node.position.x / 50, 0.5, node.position.y / 50];
    };

    return (
        <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <Canvas
                camera={{ position: [10, 10, 10], fov: 50 }}
                shadows
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                {/* Enhanced lighting setup */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 15, 10]} intensity={0.8} castShadow />
                <directionalLight
                    position={[-5, 10, 5]}
                    castShadow
                    intensity={0.6}
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <spotLight
                    position={[0, 20, 0]}
                    angle={0.3}
                    penumbra={0.5}
                    intensity={0.3}
                    castShadow
                />

                <group>
                    {nodes.map((node) => (
                        <Object3D key={node.id} node={node} />
                    ))}
                    {edges.map((edge) => {
                        const start = getNodePosition(edge.source);
                        const end = getNodePosition(edge.target);
                        if (!start || !end) return null;
                        return <Edge3D key={edge.id} start={start} end={end} />;
                    })}
                </group>

                {/* Premium ground effects */}
                <ContactShadows
                    position={[0, 0, 0]}
                    opacity={0.4}
                    scale={100}
                    blur={2}
                    far={10}
                />

                <Grid
                    infiniteGrid
                    fadeDistance={50}
                    sectionColor="#475569"
                    cellColor="#1e293b"
                    cellSize={1}
                    sectionSize={5}
                />

                <OrbitControls
                    enabled={!selected3DNode}
                    makeDefault
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={5}
                    maxDistance={100}
                />

                {/* Premium environment with subtle sky */}
                <Environment preset="city" />
                <Sky
                    distance={450000}
                    sunPosition={[100, 20, 100]}
                    inclination={0.6}
                    azimuth={0.25}
                />
            </Canvas>

            {/* Transform Mode Selector - Only show when object is selected */}
            {selected3DNode && (
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        onClick={() => setTransformMode('translate')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${transformMode === 'translate'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
                            }`}
                        title="Move (G)"
                    >
                        Move
                    </button>
                    <button
                        onClick={() => setTransformMode('rotate')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${transformMode === 'rotate'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
                            }`}
                        title="Rotate (R)"
                    >
                        Rotate
                    </button>
                    <button
                        onClick={() => setTransformMode('scale')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${transformMode === 'scale'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/90 text-gray-700 hover:bg-white hover:shadow-md'
                            }`}
                        title="Scale (S)"
                    >
                        Scale
                    </button>
                    <button
                        onClick={() => setSelected3DNode(null)}
                        className="px-4 py-2 rounded-lg font-medium bg-red-500/90 text-white hover:bg-red-600 hover:shadow-md transition-all"
                        title="Deselect (Esc)"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="absolute bottom-4 left-4 text-white text-xs opacity-70 pointer-events-none backdrop-blur-sm bg-black/20 px-3 py-2 rounded-lg">
                <div className="font-semibold mb-1">🎮 Navigation 3D</div>
                <div>Left Click: Rotate • Right Click: Pan • Scroll: Zoom</div>
                {selected3DNode && <div className="mt-1 text-yellow-300">✨ Object selected - Use gizmo to transform</div>}
            </div>
        </div>
    );
}
