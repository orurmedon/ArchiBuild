import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import NodeContextMenu from './NodeContextMenu';
import { useDiagramStore } from '@/store/useDiagramStore';

const IconNode = ({ id, data, selected }: NodeProps) => {
    const style = data.style || {};
    const { updateNode } = useDiagramStore();

    const handleLabelDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newLabel = prompt(' Modifier le label:', data.label || '');
        if (newLabel !== null && newLabel.trim()) {
            updateNode(id, { data: { ...data, label: newLabel.trim() } });
        }
    };

    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={30}
                minHeight={30}
                lineClassName="border-primary"
                handleClassName="h-3 w-3 bg-white border-2 border-primary rounded"
            />
            <NodeContextMenu nodeId={id} />
            <div
                className={`p-2 rounded transition-all h-full w-full flex flex-col items-center justify-center ${selected ? 'ring-2 ring-primary/50' : ''}`}
                style={{ ...style, width: '100%', height: '100%' }}
            >
                <div className="flex-1 w-full h-full relative min-h-[30px]">
                    {data.iconUrl ? (
                        <img src={data.iconUrl} alt={data.label} className="w-full h-full object-contain pointer-events-none" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
                    )}
                </div>
                {data.label && (
                    <span
                        className="text-xs mt-1 text-gray-600 font-medium max-w-[100px] truncate text-center cursor-text hover:text-primary transition-colors"
                        onDoubleClick={handleLabelDoubleClick}
                        title="Double-cliquez pour modifier"
                    >
                        {data.label}
                    </span>
                )}

                <Handle
                    type="target"
                    position={Position.Top}
                    className="w-3 h-3 !bg-primary border-2 border-white shadow-lg hover:scale-150 transition-transform"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="w-3 h-3 !bg-primary border-2 border-white shadow-lg hover:scale-150 transition-transform"
                />
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-3 h-3 !bg-primary border-2 border-white shadow-lg hover:scale-150 transition-transform"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-3 h-3 !bg-primary border-2 border-white shadow-lg hover:scale-150 transition-transform"
                />
            </div>
        </>
    );
};

export default memo(IconNode);
