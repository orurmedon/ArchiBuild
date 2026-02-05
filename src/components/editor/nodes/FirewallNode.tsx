import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import NodeContextMenu from './NodeContextMenu';
import { Shield } from 'lucide-react';

const FirewallNode = ({ id, data, selected }: NodeProps) => {
    const style = data.style || {};

    return (
        <>
            <NodeResizer isVisible={selected} minWidth={30} minHeight={60} lineClassName="border-red-500" handleClassName="h-3 w-3 bg-white border-2 border-red-500 rounded" />
            <NodeContextMenu nodeId={id} />
            <div
                className={`relative flex flex-col items-center py-4 px-2 border-l-2 border-r-2 border-dashed border-red-400 bg-red-50/50 w-full h-full min-h-[80px] min-w-[40px] ${selected ? 'ring-2 ring-red-500/50' : ''}`}
                style={style}
            >
                <Shield size={16} className="text-red-500 mb-2 shrink-0" />
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <span className="text-[10px] font-bold text-red-600 uppercase -rotate-90 whitespace-nowrap">{data.label}</span>
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

export default memo(FirewallNode);
