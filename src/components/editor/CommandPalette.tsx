import { useState, useEffect, useMemo } from 'react';
import { Search, Command } from 'lucide-react';
import { useDiagramStore } from '@/store/useDiagramStore';
import { exportToSVG, exportToPDF, exportToMermaid } from '@/services/exportService';
import { downloadImage } from '@/utils/export';

interface Command {
    id: string;
    label: string;
    category: string;
    keywords?: string[];
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);
    const { undo, redo, setTransformMode, setSelected3DNode, nodes, edges } = useDiagramStore();

    const commands: Command[] = useMemo(() => [
        // Edit
        { id: 'undo', label: 'Undo', category: 'Edit', keywords: ['undo', 'revert'], action: undo },
        { id: 'redo', label: 'Redo', category: 'Edit', keywords: ['redo', 'repeat'], action: redo },

        // 3D Transform
        {
            id: 'move-tool',
            label: 'Switch to Move Tool',
            category: '3D Transform',
            keywords: ['move', 'translate', 'g'],
            action: () => setTransformMode('translate')
        },
        {
            id: 'rotate-tool',
            label: 'Switch to Rotate Tool',
            category: '3D Transform',
            keywords: ['rotate', 'r'],
            action: () => setTransformMode('rotate')
        },
        {
            id: 'scale-tool',
            label: 'Switch to Scale Tool',
            category: '3D Transform',
            keywords: ['scale', 's'],
            action: () => setTransformMode('scale')
        },

        // Selection
        {
            id: 'deselect',
            label: 'Deselect Object',
            category: 'Selection',
            keywords: ['deselect', 'clear', 'escape'],
            action: () => setSelected3DNode(null)
        },

        // Export
        {
            id: 'export-png',
            label: 'Export as PNG',
            category: 'Export',
            keywords: ['export', 'download', 'png', 'image'],
            action: () => downloadImage('.react-flow', 'diagram')
        },
        {
            id: 'export-svg',
            label: 'Export as SVG',
            category: 'Export',
            keywords: ['export', 'download', 'svg', 'vector'],
            action: () => exportToSVG(nodes, edges)
        },
        {
            id: 'export-pdf',
            label: 'Export as PDF',
            category: 'Export',
            keywords: ['export', 'download', 'pdf'],
            action: () => exportToPDF(nodes, edges)
        },
        {
            id: 'export-mermaid',
            label: 'Export as Mermaid',
            category: 'Export',
            keywords: ['export', 'download', 'mermaid', 'markdown'],
            action: () => exportToMermaid(nodes, edges)
        },
    ], [undo, redo, setTransformMode, setSelected3DNode, nodes, edges]);

    const filteredCommands = useMemo(() => {
        if (!query) return commands;

        const lowerQuery = query.toLowerCase();
        return commands.filter(cmd => {
            const labelMatch = cmd.label.toLowerCase().includes(lowerQuery);
            const categoryMatch = cmd.category.toLowerCase().includes(lowerQuery);
            const keywordMatch = cmd.keywords?.some(k => k.toLowerCase().includes(lowerQuery));
            return labelMatch || categoryMatch || keywordMatch;
        });
    }, [query, commands]);

    // Reset selection when filtered list changes
    useEffect(() => {
        setSelected(0);
    }, [filteredCommands]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelected(s => (s + 1) % filteredCommands.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelected(s => (s - 1 + filteredCommands.length) % filteredCommands.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selected]) {
                    filteredCommands[selected].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selected, onClose]);

    // Reset state when closing
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setSelected(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32 z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[500px] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <Search size={20} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 outline-none text-lg"
                        autoFocus
                    />
                    <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                        ESC
                    </kbd>
                </div>

                {/* Commands List */}
                <div className="overflow-y-auto max-h-[400px]">
                    {filteredCommands.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Command size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No commands found</p>
                            <p className="text-sm mt-1">Try a different search term</p>
                        </div>
                    ) : (
                        filteredCommands.map((cmd, idx) => (
                            <div
                                key={cmd.id}
                                className={`px-4 py-3 cursor-pointer transition-colors ${idx === selected
                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                                    }`}
                                onClick={() => {
                                    cmd.action();
                                    onClose();
                                }}
                                onMouseEnter={() => setSelected(idx)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">{cmd.label}</div>
                                        <div className="text-sm text-gray-500">{cmd.category}</div>
                                    </div>
                                    {idx === selected && (
                                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded">
                                            ↵
                                        </kbd>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↑</kbd>
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↓</kbd>
                            to navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↵</kbd>
                            to select
                        </span>
                    </div>
                    <span>{filteredCommands.length} commands</span>
                </div>
            </div>
        </div>
    );
}
