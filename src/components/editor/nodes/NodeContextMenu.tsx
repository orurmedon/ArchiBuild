import { NodeToolbar, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';
import { useDiagramStore } from '@/store/useDiagramStore';

interface NodeContextMenuProps {
    nodeId: string;
    isVisible?: boolean; // React Flow handles visibility based on selection usually, but we can force it
}

const COLORS = [
    { name: 'White', value: '#ffffff', class: 'bg-white' },
    { name: 'Blue', value: '#dbeafe', class: 'bg-blue-100' }, // blue-100
    { name: 'Green', value: '#dcfce7', class: 'bg-green-100' }, // green-100
    { name: 'Red', value: '#fee2e2', class: 'bg-red-100' }, // red-100
    { name: 'Yellow', value: '#fef9c3', class: 'bg-yellow-100' }, // yellow-100
];

export default function NodeContextMenu({ nodeId }: NodeContextMenuProps) {
    const { removeNode, updateNode } = useDiagramStore();

    const handleColorChange = (color: string) => {
        updateNode(nodeId, { style: { backgroundColor: color } });
    };

    const handleDelete = () => {
        removeNode(nodeId);
    };

    return (
        <NodeToolbar isVisible={undefined} position={Position.Top} className="flex gap-2 items-center bg-white p-2 rounded shadow-lg border border-gray-200">
            <div className="flex gap-1 border-r border-gray-200 pr-2">
                {COLORS.map((c) => (
                    <button
                        key={c.name}
                        className={`w-5 h-5 rounded-full border border-gray-300 hover:scale-110 transition ${c.class}`}
                        onClick={() => handleColorChange(c.value)}
                        title={c.name}
                    />
                ))}
            </div>
            <button
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                title="Delete"
            >
                <Trash2 size={16} />
            </button>
        </NodeToolbar>
    );
}
