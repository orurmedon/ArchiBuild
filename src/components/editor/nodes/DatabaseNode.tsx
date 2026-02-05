import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Database } from 'lucide-react';

const DatabaseNode = ({ data, selected }: NodeProps) => {
    return (
        <>
            <NodeResizer isVisible={selected} minWidth={100} minHeight={50} lineClassName="border-blue-500" handleClassName="h-3 w-3 bg-white border-2 border-blue-500 rounded" />
            <div className={`px-4 py-2 shadow-md rounded-lg bg-white border-2 border-gray-200 w-full h-full min-w-[100px] flex flex-col items-center justify-center relative transition-all ${selected ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}>
                <div className="mb-2 text-blue-600 flex-1 flex items-center justify-center">
                    <Database size={24} className="w-full h-full max-w-[40px] max-h-[40px]" />
                </div>
                <div className="text-xs font-bold text-gray-700 text-center w-full truncate">{data.label}</div>

                {/* Handles */}
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

export default memo(DatabaseNode);
