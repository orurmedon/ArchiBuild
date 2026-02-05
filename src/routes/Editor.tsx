import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import Canvas from '@/components/editor/Canvas';
import Sidebar from '@/components/editor/Sidebar';
import Scene3D from '@/components/editor/3d/Scene3D';
import { useParams } from 'react-router-dom';
import { Box, Cuboid } from 'lucide-react';

export default function Editor() {
    const { id } = useParams();
    const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');

    return (
        <div className="h-screen w-full bg-slate-50 relative overflow-hidden">
            {viewMode === '2D' && <Sidebar />}

            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {/* View Toggle */}
                <div className="bg-white p-1 rounded-lg shadow border border-gray-200 flex">
                    <button
                        onClick={() => setViewMode('2D')}
                        className={`p-2 rounded flex items-center gap-2 text-sm font-medium transition ${viewMode === '2D' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Box size={16} /> 2D
                    </button>
                    <button
                        onClick={() => setViewMode('3D')}
                        className={`p-2 rounded flex items-center gap-2 text-sm font-medium transition ${viewMode === '3D' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Cuboid size={16} /> 3D
                    </button>
                </div>

                <div className="bg-white p-2 rounded shadow opacity-50 text-xs pointer-events-none self-center">
                    ID: {id?.substring(0, 8)}...
                </div>
            </div>

            <div className="w-full h-full">
                {viewMode === '2D' ? (
                    <ReactFlowProvider>
                        <Canvas />
                    </ReactFlowProvider>
                ) : (
                    <Scene3D />
                )}
            </div>
        </div>
    );
}
