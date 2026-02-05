import { AlignLeft, AlignRight, AlignCenterVertical, AlignCenterHorizontal, AlignVerticalSpaceAround, AlignHorizontalSpaceAround, Network, Grid3x3, Circle, GitBranch } from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { applyHierarchicalLayout, applyForceDirectedLayout, applyCircularLayout, applyGridLayout, alignNodes, distributeNodes, AlignmentType, DistributionType } from '@/utils/layoutEngine';

interface LayoutToolbarProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (nodes: Node[]) => void;
}

export default function LayoutToolbar({ nodes, edges, onNodesChange }: LayoutToolbarProps) {
    const handleLayout = (type: string) => {
        let layoutedNodes: Node[] = [];

        switch (type) {
            case 'hierarchical':
                layoutedNodes = applyHierarchicalLayout(nodes, edges);
                break;
            case 'force':
                layoutedNodes = applyForceDirectedLayout(nodes, edges);
                break;
            case 'circular':
                layoutedNodes = applyCircularLayout(nodes);
                break;
            case 'grid':
                layoutedNodes = applyGridLayout(nodes);
                break;
            default:
                return;
        }

        onNodesChange(layoutedNodes);
    };

    const handleAlign = (type: AlignmentType) => {
        const alignedNodes = alignNodes(nodes, type);
        onNodesChange(alignedNodes);
    };

    const handleDistribute = (type: DistributionType) => {
        const distributedNodes = distributeNodes(nodes, type);
        onNodesChange(distributedNodes);
    };

    return (
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200">
            {/* Auto Layout Algorithms */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-1">Layout</span>
                <button
                    onClick={() => handleLayout('hierarchical')}
                    className="p-2 hover:bg-blue-50 rounded-md transition-colors group relative"
                    title="Hierarchical Layout"
                >
                    <GitBranch size={16} className="text-gray-600 group-hover:text-blue-600" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Hierarchical
                    </span>
                </button>
                <button
                    onClick={() => handleLayout('force')}
                    className="p-2 hover:bg-blue-50 rounded-md transition-colors group relative"
                    title="Force-Directed Layout"
                >
                    <Network size={16} className="text-gray-600 group-hover:text-blue-600" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Force-Directed
                    </span>
                </button>
                <button
                    onClick={() => handleLayout('circular')}
                    className="p-2 hover:bg-blue-50 rounded-md transition-colors group relative"
                    title="Circular Layout"
                >
                    <Circle size={16} className="text-gray-600 group-hover:text-blue-600" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Circular
                    </span>
                </button>
                <button
                    onClick={() => handleLayout('grid')}
                    className="p-2 hover:bg-blue-50 rounded-md transition-colors group relative"
                    title="Grid Layout"
                >
                    <Grid3x3 size={16} className="text-gray-600 group-hover:text-blue-600" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Grid
                    </span>
                </button>
            </div>

            {/* Alignment */}
            <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-1">Align</span>
                <button
                    onClick={() => handleAlign('left')}
                    className="p-2 hover:bg-green-50 rounded-md transition-colors group relative"
                    title="Align Left"
                >
                    <AlignLeft size={16} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <button
                    onClick={() => handleAlign('center-horizontal')}
                    className="p-2 hover:bg-green-50 rounded-md transition-colors group relative"
                    title="Center Horizontally"
                >
                    <AlignCenterHorizontal size={16} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <button
                    onClick={() => handleAlign('right')}
                    className="p-2 hover:bg-green-50 rounded-md transition-colors group relative"
                    title="Align Right"
                >
                    <AlignRight size={16} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <button
                    onClick={() => handleAlign('top')}
                    className="p-2 hover:bg-green-50 rounded-md transition-colors group relative"
                    title="Align Top"
                >
                    <AlignCenterVertical size={16} className="text-gray-600 group-hover:text-green-600 -rotate-90" />
                </button>
                <button
                    onClick={() => handleAlign('center-vertical')}
                    className="p-2 hover:bg-green-50 rounded-md transition-colors group relative"
                    title="Center Vertically"
                >
                    <AlignCenterVertical size={16} className="text-gray-600 group-hover:text-green-600" />
                </button>
                <button
                    onClick={() => handleAlign('bottom')}
                    className="p-2 hover:bg-green-50 rounded-md transition-colors group relative"
                    title="Align Bottom"
                >
                    <AlignCenterVertical size={16} className="text-gray-600 group-hover:text-green-600 rotate-90" />
                </button>
            </div>

            {/* Distribution */}
            <div className="flex items-center gap-1">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-1">Distribute</span>
                <button
                    onClick={() => handleDistribute('horizontal')}
                    className="p-2 hover:bg-purple-50 rounded-md transition-colors group relative"
                    title="Distribute Horizontally"
                >
                    <AlignHorizontalSpaceAround size={16} className="text-gray-600 group-hover:text-purple-600" />
                </button>
                <button
                    onClick={() => handleDistribute('vertical')}
                    className="p-2 hover:bg-purple-50 rounded-md transition-colors group relative"
                    title="Distribute Vertically"
                >
                    <AlignVerticalSpaceAround size={16} className="text-gray-600 group-hover:text-purple-600" />
                </button>
            </div>
        </div>
    );
}
