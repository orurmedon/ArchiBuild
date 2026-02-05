import { Edge } from 'reactflow';
import { useDiagramStore } from '@/store/useDiagramStore';
import { ArrowRight, ArrowLeft, ArrowLeftRight } from 'lucide-react';

interface EdgeCustomizationPanelProps {
    selectedEdge: Edge | null;
}

const EDGE_TYPES = [
    { value: 'default', label: 'Default (Bezier)' },
    { value: 'straight', label: 'Straight' },
    { value: 'step', label: 'Step' },
    { value: 'smoothstep', label: 'Smooth Step' },
] as const;

const LINE_STYLES = [
    { value: 'solid', label: 'Solid', dasharray: '' },
    { value: 'dashed', label: 'Dashed', dasharray: '5,5' },
    { value: 'dotted', label: 'Dotted', dasharray: '2,2' },
] as const;

const EdgeCustomizationPanel = ({ selectedEdge }: EdgeCustomizationPanelProps) => {
    const { updateEdge } = useDiagramStore();

    if (!selectedEdge) {
        return (
            <div className="p-4 text-sm text-gray-500 text-center">
                Select an edge to customize
            </div>
        );
    }

    const edgeStyle = selectedEdge.style || {};
    const edgeType = selectedEdge.type || 'default';
    const strokeColor = edgeStyle.stroke || '#b1b1b7';
    const strokeWidth = edgeStyle.strokeWidth || 2;
    const strokeDasharray = edgeStyle.strokeDasharray || '';
    const animated = selectedEdge.animated || false;

    const handleTypeChange = (type: string) => {
        updateEdge(selectedEdge.id, { type });
    };

    const handleColorChange = (color: string) => {
        updateEdge(selectedEdge.id, {
            style: { ...edgeStyle, stroke: color },
            markerEnd: selectedEdge.markerEnd ? {
                ...(selectedEdge.markerEnd as any),
                color,
            } : undefined,
        });
    };

    const handleWidthChange = (width: number) => {
        updateEdge(selectedEdge.id, {
            style: { ...edgeStyle, strokeWidth: width },
        });
    };

    const handleLineStyleChange = (dasharray: string) => {
        updateEdge(selectedEdge.id, {
            style: { ...edgeStyle, strokeDasharray: dasharray },
        });
    };

    const handleAnimationToggle = () => {
        updateEdge(selectedEdge.id, {
            animated: !animated,
        });
    };

    const handleDirectionChange = (direction: 'forward' | 'backward' | 'bidirectional') => {
        if (direction === 'forward') {
            updateEdge(selectedEdge.id, {
                markerStart: undefined,
                markerEnd: { type: 'arrowclosed', color: strokeColor },
            });
        } else if (direction === 'backward') {
            updateEdge(selectedEdge.id, {
                markerStart: { type: 'arrowclosed', color: strokeColor },
                markerEnd: undefined,
            });
        } else {
            updateEdge(selectedEdge.id, {
                markerStart: { type: 'arrowclosed', color: strokeColor },
                markerEnd: { type: 'arrowclosed', color: strokeColor },
            });
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Edge Customization</h3>

            {/* Edge Type */}
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Type</label>
                <select
                    value={edgeType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {EDGE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Color */}
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Color</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-10 h-8 rounded cursor-pointer"
                    />
                    <input
                        type="text"
                        value={strokeColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Width */}
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                    Width: {strokeWidth}px
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={strokeWidth}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Line Style */}
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Line Style</label>
                <div className="grid grid-cols-3 gap-2">
                    {LINE_STYLES.map((style) => (
                        <button
                            key={style.value}
                            onClick={() => handleLineStyleChange(style.dasharray)}
                            className={`px-2 py-1 text-xs border rounded transition-colors ${strokeDasharray === style.dasharray
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-300 hover:border-primary'
                                }`}
                        >
                            {style.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Direction */}
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Direction</label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => handleDirectionChange('forward')}
                        className="flex items-center justify-center px-2 py-2 text-xs border border-gray-300 rounded hover:border-primary transition-colors"
                        title="Forward"
                    >
                        <ArrowRight size={16} />
                    </button>
                    <button
                        onClick={() => handleDirectionChange('backward')}
                        className="flex items-center justify-center px-2 py-2 text-xs border border-gray-300 rounded hover:border-primary transition-colors"
                        title="Backward"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <button
                        onClick={() => handleDirectionChange('bidirectional')}
                        className="flex items-center justify-center px-2 py-2 text-xs border border-gray-300 rounded hover:border-primary transition-colors"
                        title="Bidirectional"
                    >
                        <ArrowLeftRight size={16} />
                    </button>
                </div>
            </div>

            {/* Animation */}
            <div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={animated}
                        onChange={handleAnimationToggle}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-xs font-medium text-gray-600">Animated</span>
                </label>
            </div>
        </div>
    );
};

export default EdgeCustomizationPanel;
