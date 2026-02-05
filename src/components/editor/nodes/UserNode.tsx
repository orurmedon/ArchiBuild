import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import NodeContextMenu from './NodeContextMenu';
import { User } from 'lucide-react';

const UserNode = ({ id, data, selected }: NodeProps) => {
    const style = data.style || {};

    return (
        <>
            <NodeResizer isVisible={selected} minWidth={40} minHeight={40} lineClassName="border-primary" handleClassName="h-3 w-3 bg-white border-2 border-primary rounded" />
            <NodeContextMenu nodeId={id} />
            <div
                className={`flex flex-col items-center justify-center p-2 transition-all w-full h-full ${selected ? 'scale-110' : ''}`}
            >
                <div
                    className="w-full h-full rounded-full flex items-center justify-center border-2 border-gray-300 shadow-sm relative overflow-hidden"
                    style={{ backgroundColor: style.backgroundColor || 'white', borderColor: style.borderColor }}
                >
                    <User className="text-gray-600 w-3/4 h-3/4" />
                </div>
                {data.label && <span className="text-xs font-semibold text-gray-700 mt-1 bg-white/80 px-2 py-0.5 rounded shadow-sm backdrop-blur-sm whitespace-nowrap">{data.label}</span>}

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

export default memo(UserNode);
