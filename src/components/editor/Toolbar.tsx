import React from 'react';
import { Box, Database, Layout } from 'lucide-react';

export default function Toolbar() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64">
            <h3 className="font-semibold text-gray-700">Architecture Nodes</h3>
            <div className="grid grid-cols-2 gap-2">
                <div
                    className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded cursor-grab active:cursor-grabbing hover:bg-white hover:shadow-sm transition"
                    onDragStart={(event) => onDragStart(event, 'app')}
                    draggable
                >
                    <div className="w-8 h-8 bg-blue-100 rounded mb-1 flex items-center justify-center text-blue-600">
                        <Box size={20} />
                    </div>
                    <span className="text-xs text-gray-600">Service</span>
                </div>

                <div
                    className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-200 rounded cursor-grab active:cursor-grabbing hover:bg-white hover:shadow-sm transition"
                    onDragStart={(event) => onDragStart(event, 'database')}
                    draggable
                >
                    <div className="w-8 h-8 bg-green-100 rounded-full mb-1 flex items-center justify-center text-green-600">
                        <Database size={20} />
                    </div>
                    <span className="text-xs text-gray-600">Database</span>
                </div>

                <div
                    className="col-span-2 flex flex-col items-center justify-center p-3 bg-gray-50 border border-dashed border-gray-300 rounded cursor-grab active:cursor-grabbing hover:bg-white hover:shadow-sm transition"
                    onDragStart={(event) => onDragStart(event, 'container')}
                    draggable
                >
                    <div className="w-full h-6 border border-dashed border-gray-400 rounded mb-1 flex items-center justify-center">
                        <Layout size={16} className="text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-600">Group / Zone</span>
                </div>
            </div>
        </div>
    );
}
