import { useCallback, useState } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Panel,
    useReactFlow,
    Node,
    Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useDiagramStore } from '@/store/useDiagramStore';

import AppNode from '@/components/editor/nodes/AppNode';
import DatabaseNode from '@/components/editor/nodes/DatabaseNode';
import ContainerNode from '@/components/editor/nodes/ContainerNode';
import IconNode from '@/components/editor/nodes/IconNode';
import CloudNode from '@/components/editor/nodes/CloudNode';
import QueueNode from '@/components/editor/nodes/QueueNode';
import UserNode from '@/components/editor/nodes/UserNode';
import FirewallNode from '@/components/editor/nodes/FirewallNode';
import Tools from './Tools';
import LayoutToolbar from './LayoutToolbar';

const nodeTypes = {
    app: AppNode,
    database: DatabaseNode,
    container: ContainerNode,
    icon: IconNode,
    cloud: CloudNode,
    queue: QueueNode,
    user: UserNode,
    firewall: FirewallNode,
};

export default function Canvas() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        updateNode,
        setNodes,
        setSelectedEdge,
        undo,
        redo,
        history
    } = useDiagramStore();

    const [activeTool, setActiveTool] = useState<'select' | 'hand' | 'text'>('select');
    const [color, setColor] = useState('#ffffff');
    const { screenToFlowPosition } = useReactFlow();

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) {
                return;
            }

            let payload = {};
            try {
                const payloadData = event.dataTransfer.getData('application/payload');
                if (payloadData) {
                    payload = JSON.parse(payloadData);
                }
            } catch (e) {
                console.error('Failed to parse drop payload', e);
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: crypto.randomUUID(),
                type,
                position,
                data: {
                    label: (payload as any).label || `${type} node`,
                    ...(payload as any),
                    style: { backgroundColor: color }
                },
                style: {
                    backgroundColor: color,
                    width: 150,  // Reduced from default ~200
                    height: 100  // Reduced from default ~150
                }
            };

            addNode(newNode);
        },
        [addNode, screenToFlowPosition, color]
    );

    const onNodeDoubleClick = useCallback((_event: React.MouseEvent, node: Node) => {
        const label = prompt('Edit Label:', node.data.label);
        if (label !== null) {
            updateNode(node.id, { data: { ...node.data, label } });
        }
    }, [updateNode]);

    const onEdgeDoubleClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
        const label = prompt('Edit Link Label:', edge.label as string);
        if (label !== null) {
            useDiagramStore.getState().setEdges(
                edges.map(e => e.id === edge.id ? { ...e, label } : e)
            );
        }
    }, [edges]);

    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        setSelectedEdge(edge);
    }, [setSelectedEdge]);

    const onSelectionChange = useCallback((params: { nodes: Node[], edges: Edge[] }) => {
        // Update selected edge when selection changes
        if (params.edges.length === 0) {
            setSelectedEdge(null);
        } else if (params.edges.length === 1) {
            setSelectedEdge(params.edges[0]);
        }

        // Sync color picker to selected node
        if (params.nodes.length === 1) {
            // setColor(params.nodes[0].style?.backgroundColor || '#ffffff');
        }
    }, [setSelectedEdge]);

    const onKeyDown = useCallback((event: React.KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
            event.preventDefault();
            if (event.shiftKey) {
                redo();
            } else {
                undo();
            }
        } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
            event.preventDefault();
            redo();
        }
    }, [undo, redo]);

    return (
        <div className="w-full h-full relative" onKeyDown={onKeyDown} tabIndex={0}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onNodeDoubleClick={onNodeDoubleClick}
                onEdgeDoubleClick={onEdgeDoubleClick}
                onEdgeClick={onEdgeClick}
                onSelectionChange={onSelectionChange}
                panOnDrag={activeTool === 'hand' ? true : [1, 2]}
                selectionOnDrag={activeTool === 'select'}
                nodesDraggable={activeTool === 'select'}
                panOnScroll={true}
                fitView
            >
                <Background gap={16} size={1} />
                <Controls />
                <MiniMap zoomable pannable />
                <Panel position="top-right" className='flex gap-2'>
                    <button onClick={undo} disabled={history.past.length === 0} className='bg-white p-2 rounded shadow disabled:opacity-50 text-xs'>Undo</button>
                    <button onClick={redo} disabled={history.future.length === 0} className='bg-white p-2 rounded shadow disabled:opacity-50 text-xs'>Redo</button>
                </Panel>
                <Panel position="top-center">
                    <LayoutToolbar nodes={nodes} edges={edges} onNodesChange={setNodes} />
                </Panel>
            </ReactFlow>

            <Tools
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                color={color}
                setColor={(c) => {
                    setColor(c);
                    // Apply color to all currently selected nodes
                    const selected = nodes.filter(n => n.selected);
                    if (selected.length > 0) {
                        selected.forEach(n => {
                            updateNode(n.id, {
                                data: { ...n.data, style: { ...n.data.style, backgroundColor: c } },
                                style: { ...n.style, backgroundColor: c }
                            });
                        });
                    }
                }}
            />
        </div>
    );
}
