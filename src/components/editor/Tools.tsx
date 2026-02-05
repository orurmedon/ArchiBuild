import { MousePointer2, Hand, ZoomIn, ZoomOut } from 'lucide-react';
import { useReactFlow } from 'reactflow';

interface ToolsProps {
    activeTool: 'select' | 'hand' | 'text';
    setActiveTool: (tool: 'select' | 'hand' | 'text') => void;
    color: string;
    setColor: (color: string) => void;
}

const COLORS = [
    '#ffffff', // White
    '#e2e8f0', // Slate 200
    '#fca5a5', // Red 300
    '#fdba74', // Orange 300
    '#fcd34d', // Amber 300
    '#86efac', // Green 300
    '#93c5fd', // Blue 300
    '#c4b5fd', // Violet 300
];

export default function Tools({ activeTool, setActiveTool, color, setColor }: ToolsProps) {
    const { zoomIn, zoomOut } = useReactFlow();

    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 p-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
            {/* Tools */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTool('select')}
                    className={`p-2 rounded-md transition-all ${activeTool === 'select' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Select (S)"
                >
                    <MousePointer2 size={18} />
                </button>
                <button
                    onClick={() => setActiveTool('hand')}
                    className={`p-2 rounded-md transition-all ${activeTool === 'hand' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Pan Tool (H)"
                >
                    <Hand size={18} />
                </button>
                {/* Text tool placeholder - logic handled in Canvas via Double Click usually, but we can have a mode */}
                {/* 
                <button
                    onClick={() => setActiveTool('text')}
                    className={`p-2 rounded-md transition-all ${activeTool === 'text' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Text (T)"
                >
                    <Type size={18} />
                </button> 
                */}
            </div>

            <div className="w-px h-8 bg-gray-200"></div>

            {/* Colors */}
            <div className="flex items-center gap-1">
                {COLORS.map((c) => (
                    <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                        style={{ backgroundColor: c }}
                        title={c}
                    />
                ))}
            </div>

            <div className="w-px h-8 bg-gray-200"></div>

            {/* Zoom */}
            <div className="flex items-center gap-1">
                <button onClick={() => zoomOut()} className="p-2 text-gray-500 hover:text-primary transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <ZoomOut size={16} />
                </button>
                <button onClick={() => zoomIn()} className="p-2 text-gray-500 hover:text-primary transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg">
                    <ZoomIn size={16} />
                </button>
            </div>
        </div>
    );
}
