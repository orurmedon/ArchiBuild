import { jsPDF } from 'jspdf';
import { GLTFExporter } from 'three-stdlib';
import type { Node, Edge } from 'reactflow';
import type * as THREE from 'three';

// Helper function to download blob
const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Helper function to download text
const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    downloadBlob(blob, filename);
};

/**
 * Export diagram as SVG (vector format)
 */
export const exportToSVG = (nodes: Node[], edges: Edge[]) => {
    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    nodes.forEach(node => {
        const x = node.position.x;
        const y = node.position.y;
        const width = 200; // Approximate node width
        const height = 100; // Approximate node height

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
    });

    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;

    // Create SVG
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX - padding} ${minY - padding} ${width} ${height}">
  <defs>
    <style>
      .node { fill: white; stroke: #3b82f6; stroke-width: 2; }
      .node-text { fill: #1f2937; font-family: Arial, sans-serif; font-size: 14px; text-anchor: middle; }
      .edge { stroke: #6b7280; stroke-width: 2; fill: none; }
      .edge-arrow { fill: #6b7280; }
    </style>
  </defs>
  
  <!-- Edges -->
  <g id="edges">
`;

    // Draw edges
    edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
            const x1 = sourceNode.position.x + 100;
            const y1 = sourceNode.position.y + 50;
            const x2 = targetNode.position.x + 100;
            const y2 = targetNode.position.y + 50;

            // Simple straight line (can be enhanced with curves)
            svg += `    <line class="edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#arrowhead)" />\n`;
        }
    });

    svg += `  </g>
  
  <!-- Arrow marker -->
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon class="edge-arrow" points="0 0, 10 3, 0 6" />
    </marker>
  </defs>
  
  <!-- Nodes -->
  <g id="nodes">
`;

    // Draw nodes
    nodes.forEach(node => {
        const x = node.position.x;
        const y = node.position.y;
        const width = 200;
        const height = 100;
        const label = node.data.label || 'Node';

        svg += `    <g class="node-group">
      <rect class="node" x="${x}" y="${y}" width="${width}" height="${height}" rx="8" />
      <text class="node-text" x="${x + width / 2}" y="${y + height / 2 + 5}">${label}</text>
    </g>
`;
    });

    svg += `  </g>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    downloadBlob(blob, `diagram_${new Date().toISOString().slice(0, 10)}.svg`);
};

/**
 * Export diagram as PDF (vector format)
 */
export const exportToPDF = (nodes: Node[], edges: Edge[]) => {
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
    });

    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    nodes.forEach(node => {
        const x = node.position.x;
        const y = node.position.y;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + 200);
        maxY = Math.max(maxY, y + 100);
    });

    const scale = 0.5; // Scale down to fit PDF
    const offsetX = 50;
    const offsetY = 50;

    // Draw edges
    pdf.setDrawColor(107, 114, 128); // gray-500
    pdf.setLineWidth(2);

    edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode) {
            const x1 = (sourceNode.position.x - minX) * scale + offsetX + 100 * scale;
            const y1 = (sourceNode.position.y - minY) * scale + offsetY + 50 * scale;
            const x2 = (targetNode.position.x - minX) * scale + offsetX + 100 * scale;
            const y2 = (targetNode.position.y - minY) * scale + offsetY + 50 * scale;

            pdf.line(x1, y1, x2, y2);
        }
    });

    // Draw nodes
    pdf.setDrawColor(59, 130, 246); // blue-500
    pdf.setFillColor(255, 255, 255); // white
    pdf.setLineWidth(2);

    nodes.forEach(node => {
        const x = (node.position.x - minX) * scale + offsetX;
        const y = (node.position.y - minY) * scale + offsetY;
        const width = 200 * scale;
        const height = 100 * scale;
        const label = node.data.label || 'Node';

        // Draw rectangle
        pdf.roundedRect(x, y, width, height, 8, 8, 'FD');

        // Draw text
        pdf.setFontSize(12);
        pdf.setTextColor(31, 41, 55); // gray-800
        pdf.text(label, x + width / 2, y + height / 2, { align: 'center', baseline: 'middle' });
    });

    pdf.save(`diagram_${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * Export diagram as Mermaid syntax
 */
export const exportToMermaid = (nodes: Node[], edges: Edge[]) => {
    let mermaid = 'graph TD\n';

    // Add nodes
    nodes.forEach(node => {
        const id = node.id.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize ID
        const label = node.data.label || 'Node';

        // Choose shape based on node type
        let shape = '[' + label + ']'; // Default rectangle

        if (node.type === 'database') {
            shape = '[(' + label + ')]'; // Cylinder
        } else if (node.type === 'cloud') {
            shape = '{{' + label + '}}'; // Hexagon
        } else if (node.type === 'firewall') {
            shape = '{' + label + '}'; // Rhombus
        }

        mermaid += `  ${id}${shape}\n`;
    });

    mermaid += '\n';

    // Add edges
    edges.forEach(edge => {
        const sourceId = edge.source.replace(/[^a-zA-Z0-9]/g, '_');
        const targetId = edge.target.replace(/[^a-zA-Z0-9]/g, '_');
        const label = edge.label ? `|${edge.label}|` : '';

        mermaid += `  ${sourceId} -->${label} ${targetId}\n`;
    });

    downloadText(mermaid, `diagram_${new Date().toISOString().slice(0, 10)}.mmd`);
};

/**
 * Export 3D scene as GLB (GLTF Binary)
 */
export const exportToGLB = async (scene: THREE.Scene) => {
    const exporter = new GLTFExporter();

    try {
        const gltf = await exporter.parseAsync(scene, {
            binary: true,
            onlyVisible: true,
            truncateDrawRange: true,
        });

        const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
        downloadBlob(blob, `diagram_3d_${new Date().toISOString().slice(0, 10)}.glb`);
    } catch (error) {
        console.error('Failed to export GLB:', error);
        throw error;
    }
};
