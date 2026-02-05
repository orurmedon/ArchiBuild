import { Node, Edge } from 'reactflow';
import dagre from 'dagre';

export type LayoutAlgorithm = | 'hierarchical'
    | 'force-directed'
    | 'circular'
    | 'grid'
    | 'tree';

export type AlignmentType = 'left' | 'right' | 'top' | 'bottom' | 'center-horizontal' | 'center-vertical';
export type DistributionType = 'horizontal' | 'vertical';

/**
 * Hierarchical layout using Dagre
 */
export function applyHierarchicalLayout(nodes: Node[], edges: Edge[]): Node[] {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: 'TB', nodesep: 100, ranksep: 150 });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach(node => {
        g.setNode(node.id, { width: node.width || 150, height: node.height || 50 });
    });

    edges.forEach(edge => {
        g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    return nodes.map(node => {
        const nodeWithPosition = g.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - (node.width || 150) / 2,
                y: nodeWithPosition.y - (node.height || 50) / 2
            }
        };
    });
}

/**
 * Force-directed layout (simple implementation)
 */
export function applyForceDirectedLayout(nodes: Node[], edges: Edge[], iterations = 50): Node[] {
    const width = 1200;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize random positions if needed
    const positionedNodes = nodes.map(node => ({
        ...node,
        position: node.position.x === 0 && node.position.y === 0
            ? { x: Math.random() * width, y: Math.random() * height }
            : node.position,
        velocity: { x: 0, y: 0 }
    }));

    const k = Math.sqrt((width * height) / nodes.length); // Optimal distance

    for (let iter = 0; iter < iterations; iter++) {
        // Calculate repulsive forces (all nodes repel each other)
        for (let i = 0; i < positionedNodes.length; i++) {
            positionedNodes[i].velocity = { x: 0, y: 0 };

            for (let j = 0; j < positionedNodes.length; j++) {
                if (i !== j) {
                    const dx = positionedNodes[i].position.x - positionedNodes[j].position.x;
                    const dy = positionedNodes[i].position.y - positionedNodes[j].position.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = (k * k) / distance;

                    positionedNodes[i].velocity!.x += (dx / distance) * force;
                    positionedNodes[i].velocity!.y += (dy / distance) * force;
                }
            }
        }

        // Calculate attractive forces (connected nodes attract)
        edges.forEach(edge => {
            const source = positionedNodes.find(n => n.id === edge.source);
            const target = positionedNodes.find(n => n.id === edge.target);

            if (source && target) {
                const dx = target.position.x - source.position.x;
                const dy = target.position.y - source.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = (distance * distance) / k;

                source.velocity!.x += (dx / distance) * force;
                source.velocity!.y += (dy / distance) * force;
                target.velocity!.x -= (dx / distance) * force;
                target.velocity!.y -= (dx / distance) * force;
            }
        });

        // Update positions
        positionedNodes.forEach(node => {
            node.position.x += node.velocity!.x * 0.01;
            node.position.y += node.velocity!.y * 0.01;

            // Keep nodes within bounds
            node.position.x = Math.max(50, Math.min(width - 50, node.position.x));
            node.position.y = Math.max(50, Math.min(height - 50, node.position.y));
        });
    }

    return positionedNodes.map(({ velocity, ...node }) => node);
}

/**
 * Circular layout
 */
export function applyCircularLayout(nodes: Node[]): Node[] {
    const radius = Math.min(400, 50 * nodes.length);
    const centerX = 600;
    const centerY = 400;
    const angleStep = (2 * Math.PI) / nodes.length;

    return nodes.map((node, index) => ({
        ...node,
        position: {
            x: centerX + radius * Math.cos(index * angleStep),
            y: centerY + radius * Math.sin(index * angleStep)
        }
    }));
}

/**
 * Grid layout
 */
export function applyGridLayout(nodes: Node[], columns?: number): Node[] {
    const cols = columns || Math.ceil(Math.sqrt(nodes.length));
    const cellWidth = 200;
    const cellHeight = 150;

    return nodes.map((node, index) => ({
        ...node,
        position: {
            x: (index % cols) * cellWidth + 100,
            y: Math.floor(index / cols) * cellHeight + 100
        }
    }));
}

/**
 * Align nodes
 */
export function alignNodes(nodes: Node[], type: AlignmentType): Node[] {
    if (nodes.length === 0) return nodes;

    const selectedNodes = nodes.filter(n => n.selected);
    if (selectedNodes.length < 2) return nodes;

    let alignValue: number;

    switch (type) {
        case 'left':
            alignValue = Math.min(...selectedNodes.map(n => n.position.x));
            return nodes.map(n =>
                n.selected ? { ...n, position: { ...n.position, x: alignValue } } : n
            );

        case 'right':
            const maxX = Math.max(...selectedNodes.map(n => n.position.x + (n.width || 150)));
            return nodes.map(n =>
                n.selected ? { ...n, position: { ...n.position, x: maxX - (n.width || 150) } } : n
            );

        case 'top':
            alignValue = Math.min(...selectedNodes.map(n => n.position.y));
            return nodes.map(n =>
                n.selected ? { ...n, position: { ...n.position, y: alignValue } } : n
            );

        case 'bottom':
            const maxY = Math.max(...selectedNodes.map(n => n.position.y + (n.height || 50)));
            return nodes.map(n =>
                n.selected ? { ...n, position: { ...n.position, y: maxY - (n.height || 50) } } : n
            );

        case 'center-horizontal':
            const avgX = selectedNodes.reduce((sum, n) => sum + n.position.x + (n.width || 150) / 2, 0) / selectedNodes.length;
            return nodes.map(n =>
                n.selected ? { ...n, position: { ...n.position, x: avgX - (n.width || 150) / 2 } } : n
            );

        case 'center-vertical':
            const avgY = selectedNodes.reduce((sum, n) => sum + n.position.y + (n.height || 50) / 2, 0) / selectedNodes.length;
            return nodes.map(n =>
                n.selected ? { ...n, position: { ...n.position, y: avgY - (n.height || 50) / 2 } } : n
            );

        default:
            return nodes;
    }
}

/**
 * Distribute nodes evenly
 */
export function distributeNodes(nodes: Node[], type: DistributionType): Node[] {
    const selectedNodes = nodes.filter(n => n.selected);
    if (selectedNodes.length < 3) return nodes;

    const sorted = [...selectedNodes].sort((a, b) =>
        type === 'horizontal'
            ? a.position.x - b.position.x
            : a.position.y - b.position.y
    );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const totalSpace = type === 'horizontal'
        ? last.position.x - first.position.x
        : last.position.y - first.position.y;

    const spacing = totalSpace / (sorted.length - 1);

    const distributed = sorted.map((node, index) => ({
        ...node,
        position: {
            ...node.position,
            ...(type === 'horizontal'
                ? { x: first.position.x + index * spacing }
                : { y: first.position.y + index * spacing }
            )
        }
    }));

    return nodes.map(n => {
        const distributedNode = distributed.find(dn => dn.id === n.id);
        return distributedNode || n;
    });
}
