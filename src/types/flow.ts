// Placeholder types until React Flow is fully integrated in Phase 2
// This ensures strict typing in our store

export type NodeData = Record<string, unknown>;

export interface Node {
    id: string;
    position: { x: number; y: number };
    data: NodeData;
    type?: string;
    [key: string]: unknown;
}

export interface Edge {
    id: string;
    source: string;
    target: string;
    type?: string;
    [key: string]: unknown;
}

export interface Viewport {
    x: number;
    y: number;
    zoom: number;
}
