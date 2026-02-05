import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Box, Server, Globe } from 'lucide-react';

const AppNode = ({ data, selected }: NodeProps) => {
    const Icon = data.icon === 'server' ? Server : data.icon === 'globe' ? Globe : Box;

    return (
        <>
            <NodeResizer isVisible={selected} minWidth={100} minHeight={50} lineClassName="border-primary" handleClassName="h-3 w-3 bg-white border-2 border-primary rounded" />
            <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 w-full h-full min-w-[100px] transition-colors flex flex-col justify-center ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}`}>
                <div className="flex items-center">
                    <div className="rounded-full w-8 h-8 flex justify-center items-center bg-gray-100 text-gray-500 shrink-0">
                        <Icon className="w-4 h-4" />
                    </div>
                    <div className="ml-2 overflow-hidden">
                        <div className="text-sm font-bold text-gray-900 truncate">{data.label}</div>
                        {data.subLabel && <div className="text-xs text-gray-500 truncate">{data.subLabel}</div>}
                    </div>
                </div>

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

export default memo(AppNode);
