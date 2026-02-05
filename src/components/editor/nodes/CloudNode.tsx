import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import NodeContextMenu from './NodeContextMenu';

const CloudNode = ({ id, data, selected }: NodeProps) => {
    const style = data.style || {};

    return (
        <>
            <NodeResizer isVisible={selected} minWidth={50} minHeight={30} lineClassName="border-primary" handleClassName="h-3 w-3 bg-white border-2 border-primary rounded" />
            <NodeContextMenu nodeId={id} />
            <div
                className={`relative group w-full h-full flex items-center justify-center ${selected ? 'ring-2 ring-primary/50' : ''}`}
                style={{ ...style }}
            >
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill={style.backgroundColor || "#e2e8f0"} stroke="#64748b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm absolute inset-0">
                    <path d="M17.5 19c0-1.7-1.3-3-3-3h-9c-2.3 0-4-1.7-4-4 0-1.2 0.5-2.2 1.4-3 0.1-2.2 1.9-4 4.1-4 1.7 0 3.2 1 3.8 2.5 0.5-0.3 1.1-0.5 1.7-0.5 1.9 0 3.5 1.6 3.5 3.5 0 0.5-0.1 1-0.3 1.5 2.5 0.3 4.3 2.5 4.3 5s-2 4.5-4.5 4.5z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <span className="text-xs font-semibold text-gray-700">{data.label}</span>
                </div>

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

export default memo(CloudNode);
