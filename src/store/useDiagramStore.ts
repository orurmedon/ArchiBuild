import { create } from 'zustand';
import {
    Node,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Connection,
    NodeChange,
    EdgeChange,
} from 'reactflow';

interface DiagramState {
    nodes: Node[];
    edges: Edge[];
    selectedEdge: Edge | null;
    selected3DNode: string | null;
    transformMode: 'translate' | 'rotate' | 'scale';

    // React Flow Actions
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;

    // Custom Actions
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    setSelectedEdge: (edge: Edge | null) => void;
    setSelected3DNode: (id: string | null) => void;
    setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
    addNode: (node: Node) => void;
    updateNode: (id: string, data: any) => void;
    updateEdge: (id: string, data: any) => void;
    removeNode: (id: string) => void;
    loadContent: (content: { nodes: Node[], edges: Edge[] }) => void;
}

// History interface
interface HistoryState {
    past: Array<{ nodes: Node[], edges: Edge[] }>;
    future: Array<{ nodes: Node[], edges: Edge[] }>;
}

interface DiagramStore extends DiagramState {
    history: HistoryState;
    undo: () => void;
    redo: () => void;
    pushToHistory: () => void;
}

export const useDiagramStore = create<DiagramStore>((set, get) => ({
    nodes: [],
    edges: [],
    selectedEdge: null,
    selected3DNode: null,
    transformMode: 'translate',
    history: { past: [], future: [] },

    onNodesChange: (changes: NodeChange[]) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    onConnect: (connection: Connection) => {
        const { pushToHistory } = get();
        pushToHistory();
        set({
            edges: addEdge({ ...connection, type: 'smoothstep', markerEnd: { type: 'arrowclosed' as any } }, get().edges),
        });
    },

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    setSelectedEdge: (edge) => set({ selectedEdge: edge }),
    setSelected3DNode: (id) => set({ selected3DNode: id }),
    setTransformMode: (mode) => set({ transformMode: mode }),

    addNode: (node) => {
        const { pushToHistory } = get();
        pushToHistory();
        set((state) => ({ nodes: [...state.nodes, node] }));
    },

    updateNode: (id, data) => {
        set((state) => ({
            nodes: state.nodes.map((n) => {
                if (n.id !== id) return n;
                // Support updating 'data' or top level properties like 'style' if passed
                return { ...n, ...data, data: { ...n.data, ...(data.data || {}) } };
            }),
        }));
    },

    updateEdge: (id, data) => {
        set((state) => ({
            edges: state.edges.map((e) => {
                if (e.id !== id) return e;
                return { ...e, ...data, data: { ...e.data, ...(data.data || {}) } };
            }),
        }));
    },

    removeNode: (id) => {
        const { pushToHistory } = get();
        pushToHistory();
        set((state) => ({
            nodes: state.nodes.filter((n) => n.id !== id),
            edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        }));
    },

    loadContent: (content) => {
        const { pushToHistory } = get();
        pushToHistory();
        set({
            nodes: content.nodes || [],
            edges: content.edges || []
        });
    },

    // History Actions
    pushToHistory: () => {
        const { nodes, edges, history } = get();
        const startState = { nodes: [...nodes], edges: [...edges] };

        set({
            history: {
                past: [...history.past, startState].slice(-50),
                future: []
            }
        });
    },

    undo: () => {
        const { history, nodes, edges } = get();
        if (history.past.length === 0) return;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, history.past.length - 1);

        set({
            nodes: previous.nodes,
            edges: previous.edges,
            history: {
                past: newPast,
                future: [{ nodes, edges }, ...history.future]
            }
        });
    },

    redo: () => {
        const { history, nodes, edges } = get();
        if (history.future.length === 0) return;

        const next = history.future[0];
        const newFuture = history.future.slice(1);

        set({
            nodes: next.nodes,
            edges: next.edges,
            history: {
                past: [...history.past, { nodes, edges }],
                future: newFuture
            }
        });
    }
}));
