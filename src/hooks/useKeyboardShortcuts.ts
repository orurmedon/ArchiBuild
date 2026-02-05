import { useEffect } from 'react';
import { useDiagramStore } from '@/store/useDiagramStore';

export interface KeyboardShortcut {
    key: string;
    action: string;
    description: string;
    handler: () => void;
}

export const useKeyboardShortcuts = (onCommandPalette: () => void) => {
    const { undo, redo, setSelected3DNode, setTransformMode } = useDiagramStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMod = e.metaKey || e.ctrlKey;
            const isShift = e.shiftKey;

            // Command Palette
            if (isMod && e.key === 'k') {
                e.preventDefault();
                onCommandPalette();
                return;
            }

            // Undo/Redo
            if (isMod && !isShift && e.key === 'z') {
                e.preventDefault();
                undo();
                return;
            }

            if (isMod && isShift && e.key === 'z') {
                e.preventDefault();
                redo();
                return;
            }

            // Deselect
            if (e.key === 'Escape') {
                e.preventDefault();
                setSelected3DNode(null);
                return;
            }

            // 3D Transform modes (only when not typing in input)
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.key === 'g' || e.key === 'G') {
                e.preventDefault();
                setTransformMode('translate');
                return;
            }

            if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                setTransformMode('rotate');
                return;
            }

            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                setTransformMode('scale');
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCommandPalette, undo, redo, setSelected3DNode, setTransformMode]);
};

export const SHORTCUTS: KeyboardShortcut[] = [
    {
        key: 'Cmd+K',
        action: 'commandPalette',
        description: 'Open command palette',
        handler: () => { },
    },
    {
        key: 'Cmd+Z',
        action: 'undo',
        description: 'Undo last action',
        handler: () => { },
    },
    {
        key: 'Cmd+Shift+Z',
        action: 'redo',
        description: 'Redo last action',
        handler: () => { },
    },
    {
        key: 'Esc',
        action: 'deselect',
        description: 'Deselect object',
        handler: () => { },
    },
    {
        key: 'G',
        action: 'moveTool',
        description: 'Switch to Move tool (3D)',
        handler: () => { },
    },
    {
        key: 'R',
        action: 'rotateTool',
        description: 'Switch to Rotate tool (3D)',
        handler: () => { },
    },
    {
        key: 'S',
        action: 'scaleTool',
        description: 'Switch to Scale tool (3D)',
        handler: () => { },
    },
];
