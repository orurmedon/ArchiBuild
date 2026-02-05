import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const ContainerNode = ({ data, selected }: NodeProps) => {
    return (
        <>
            <NodeResizer isVisible={selected} minWidth={100} minHeight={100} lineClassName="border-gray-400 border-dashed" handleClassName="h-3 w-3 bg-white border-2 border-gray-400 rounded" />
            <div className={`w-full h-full min-w-[100px] min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50 p-4 transition-colors relative group ${selected ? 'border-blue-400 bg-blue-50/30' : ''}`}>
                <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-medium text-gray-400 uppercase tracking-wider border border-gray-200 rounded">
                    {data.label}
                </div>

                {/* Container usually doesn't need handles for flow, but maybe for connecting to the group */}
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
            </div>
        </>
    );
};

export default memo(ContainerNode);
