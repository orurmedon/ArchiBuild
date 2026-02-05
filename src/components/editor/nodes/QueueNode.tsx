import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import NodeContextMenu from './NodeContextMenu';

const QueueNode = ({ id, data, selected }: NodeProps) => {
    const style = data.style || {};

    return (
        <>
            <NodeResizer isVisible={selected} minWidth={100} minHeight={40} lineClassName="border-primary" handleClassName="h-3 w-3 bg-white border-2 border-primary rounded" />
            <NodeContextMenu nodeId={id} />
            <div
                className={`flex items-center p-2 rounded border border-gray-400 bg-white/50 backdrop-blur-sm w-full h-full min-w-[120px] shadow-sm transition-all ${selected ? 'ring-2 ring-primary/50' : ''}`}
                style={{ ...style, borderRadius: '0', borderRight: '4px solid #64748b' }}
            >
                <div className='flex gap-1 mr-2 opacity-50 h-full items-center'>
                    <div className='w-1 h-3/4 bg-gray-400'></div>
                    <div className='w-1 h-3/4 bg-gray-400'></div>
                    <div className='w-1 h-3/4 bg-gray-400'></div>
                </div>
                <div className="flex-1 text-center overflow-hidden">
                    <span className="text-xs font-bold text-gray-700 block truncate">{data.label}</span>
                    <span className="text-[10px] text-gray-500 block uppercase tracking-wider truncate">QUEUE</span>
                </div>

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

export default memo(QueueNode);
