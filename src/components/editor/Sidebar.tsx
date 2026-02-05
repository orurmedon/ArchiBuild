import React, { useState, useEffect } from 'react';
import { Box, Database, Layout, Search, Grid, Layers, History, Save, RotateCcw, ChevronLeft, ChevronRight, Download, Upload, Image as ImageIcon, Cloud, User, Shield, List, Palette, Package, Link2 } from 'lucide-react';
import { searchIcons, getIconSvgUrl, IconResult } from '@/services/iconify';
import { useParams } from 'react-router-dom';
import { storageService } from '@/services';
import { DiagramVersion } from '@/services/types';
import { useDiagramStore } from '@/store/useDiagramStore';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadJSON, downloadImage } from '@/utils/export';
import { DEFAULT_ICONS } from '@/config/defaultIcons';
import StylePanel from './StylePanel';
import EdgeCustomizationPanel from './EdgeCustomizationPanel';
import { OFFLINE_ICONS, searchOfflineIcons, getIconsByCategory, ICON_CATEGORIES, simpleIconToDataUrl } from '@/config/offlineIcons';
import { COMPONENT_LIBRARY, PROVIDERS, searchComponents, getComponentsByProvider, getAllComponents, type ComponentDefinition } from '@/config/componentLibrary';
import ComponentsTab from './ComponentsTab';

// Throttle/Debounce helper
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

export default function Sidebar() {
    const { id: projectId } = useParams();

    const [activeTab, setActiveTab] = useState<'components' | 'icons' | 'style' | 'edges' | 'history' | 'export'>('components');
    const [searchQuery, setSearchQuery] = useState('');
    const [icons, setIcons] = useState<IconResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [versions, setVersions] = useState<DiagramVersion[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { nodes, edges, loadContent, selectedEdge } = useDiagramStore();

    const debouncedSearch = useDebounce(searchQuery, 700);

    useEffect(() => {
        if (activeTab === 'icons' && debouncedSearch.length >= 2) {
            setIsLoading(true);
            searchIcons(debouncedSearch).then(results => {
                setIcons(results);
                setIsLoading(false);
            });
        } else {
            setIcons([]);
        }
    }, [debouncedSearch, activeTab]);

    useEffect(() => {
        if (activeTab === 'history' && projectId) {
            loadVersions();
        }
    }, [activeTab, projectId]);

    const loadVersions = async () => {
        if (!projectId) return;
        const { data } = await storageService.getVersions(projectId);
        if (data) setVersions(data);
    };

    const handleCreateSnapshot = async () => {
        if (!projectId) return;
        const label = prompt("Snapshot Name (e.g., 'Before Refactor'):");
        if (!label) return;

        const content = { nodes, edges };
        await storageService.saveVersion(projectId, content, label);
        loadVersions();
    };

    const handleRestore = (version: DiagramVersion) => {
        if (confirm(`Restore version "${version.label || 'Untitled'}"?`)) {
            loadContent(version.content);
        }
    };

    const onDragStart = (event: React.DragEvent, type: string, payload?: any) => {
        event.dataTransfer.setData('application/reactflow', type);
        if (payload) {
            event.dataTransfer.setData('application/payload', JSON.stringify(payload));
        }
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleExportJSON = () => {
        downloadJSON({ nodes, edges, version: '1.0' }, 'archibuild');
    };

    const handleExportPNG = () => {
        // We target the class 'react-flow' but standard selector might simpler if we add an ID to the wrapper or verify this selector works.
        // Assuming React Flow adds .react-flow class.
        downloadImage('.react-flow', 'archibuild_diagram');
    };

    const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = JSON.parse(e.target?.result as string);
                if (content.nodes && content.edges) {
                    if (confirm('Importing will replace current diagram. Continue?')) {
                        loadContent(content);
                    }
                } else {
                    alert('Invalid file format. Keys nodes and edges required.');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to parse file');
            }
        };
        reader.readAsText(file);
    };

    return (
        <>
            <AnimatePresence>
                {!isCollapsed && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-4 left-4 z-10 flex flex-col bg-white/95 backdrop-blur-sm h-[calc(100vh-2rem)] w-72 rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 bg-gray-50/50">
                            <button
                                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'components' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('components')}
                                title="Components"
                            >
                                <Package size={18} />
                                {activeTab === 'components' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                            <button
                                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'icons' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('icons')}
                                title="Icons"
                            >
                                <Search size={18} />
                                {activeTab === 'icons' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                            <button
                                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'style' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('style')}
                                title="Style"
                            >
                                <Palette size={18} />
                                {activeTab === 'style' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                            <button
                                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'edges' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('edges')}
                                title="Edges"
                            >
                                <Link2 size={18} />
                                {activeTab === 'edges' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                            <button
                                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'history' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('history')}
                                title="History"
                            >
                                <History size={18} />
                                {activeTab === 'history' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                            <button
                                className={`flex-1 p-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'export' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('export')}
                                title="Export"
                            >
                                <Download size={18} />
                                {activeTab === 'export' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {activeTab === 'components' && (
                                    <motion.div
                                        key="components"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full -m-4"
                                    >
                                        <ComponentsTab />
                                    </motion.div>
                                )}

                                {activeTab === 'icons' && (
                                    <motion.div
                                        key="icons"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col h-full"
                                    >
                                        <div className="relative mb-4">
                                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                            <input
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="Search 100k+ icons..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoFocus
                                            />
                                        </div>

                                        {searchQuery.length < 2 ? (
                                            <div className="flex flex-col gap-4">
                                                {DEFAULT_ICONS.map((category) => (
                                                    <div key={category.category}>
                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{category.category}</h4>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {category.icons.map((icon, index) => (
                                                                <motion.div
                                                                    key={`${icon.prefix}:${icon.name}`}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    className="bg-white hover:bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-blue-300 hover:shadow-md cursor-grab flex items-center justify-center transition-all aspect-square"
                                                                    onDragStart={(event) => onDragStart(event, 'icon', {
                                                                        label: icon.name,
                                                                        iconUrl: getIconSvgUrl(icon.prefix, icon.name)
                                                                    })}
                                                                    draggable
                                                                    title={icon.name}
                                                                >
                                                                    <img src={getIconSvgUrl(icon.prefix, icon.name)} className="w-6 h-6 object-contain" />
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <>
                                                {isLoading ? (
                                                    <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                                                ) : (
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {icons.map((icon, index) => (
                                                            <motion.div
                                                                key={`${icon.prefix}:${icon.name}`}
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: index * 0.05 }}
                                                                className="bg-white hover:bg-gray-50 p-2 rounded-lg border border-gray-100 hover:border-blue-300 hover:shadow-md cursor-grab flex items-center justify-center transition-all aspect-square"
                                                                onDragStart={(event) => onDragStart(event, 'icon', {
                                                                    label: icon.name,
                                                                    iconUrl: getIconSvgUrl(icon.prefix, icon.name)
                                                                })}
                                                                draggable
                                                                title={icon.name}
                                                            >
                                                                <img src={getIconSvgUrl(icon.prefix, icon.name)} className="w-6 h-6 object-contain" />
                                                            </motion.div>
                                                        ))}
                                                        {icons.length === 0 && searchQuery.length >= 2 && (
                                                            <div className="col-span-4 text-center text-xs text-gray-400 py-4">No icons found</div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="text-center text-xs text-gray-400 mt-10">
                                                    Powered by Iconify
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}


                                {activeTab === 'edges' && (
                                    <motion.div
                                        key="edges"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col"
                                    >
                                        <EdgeCustomizationPanel selectedEdge={selectedEdge} />
                                    </motion.div>
                                )}

                                {activeTab === 'history' && (
                                    <motion.div
                                        key="history"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <button
                                            onClick={handleCreateSnapshot}
                                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2.5 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-medium text-sm"
                                        >
                                            <Save size={16} />
                                            Create Snapshot
                                        </button>

                                        <div className="flex flex-col gap-2 mt-2">
                                            {versions.map((v) => (
                                                <div key={v.id} className="group bg-white border border-gray-200 p-3 rounded-lg hover:shadow-md transition flex justify-between items-center">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-800">{v.label || 'Untitled'}</div>
                                                        <div className="text-xs text-gray-400">{new Date(v.created_at).toLocaleTimeString()} - {new Date(v.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRestore(v)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition transform hover:rotate-180 duration-500"
                                                        title="Restore"
                                                    >
                                                        <RotateCcw size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            {versions.length === 0 && <span className='text-center text-xs text-gray-400'>No history yet</span>}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'style' && (
                                    <motion.div
                                        key="style"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <StylePanel />
                                    </motion.div>
                                )}

                                {activeTab === 'export' && (
                                    <motion.div
                                        key="export"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col gap-4"
                                    >
                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <Download size={16} /> Export
                                            </h3>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={handleExportJSON}
                                                    className="w-full flex items-center gap-2 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition text-sm text-gray-600"
                                                >
                                                    <Save size={14} /> Download JSON
                                                </button>
                                                <button
                                                    onClick={handleExportPNG}
                                                    className="w-full flex items-center gap-2 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 transition text-sm text-gray-600"
                                                >
                                                    <ImageIcon size={14} /> Export PNG (2D)
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <Upload size={16} /> Import
                                            </h3>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".json"
                                                    onChange={handleImportJSON}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="w-full flex items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded hover:border-primary/50 hover:bg-white transition text-sm text-gray-500">
                                                    Click to Upload
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            {isCollapsed && (
                <motion.button
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setIsCollapsed(false)}
                    className="absolute top-4 left-4 z-10 bg-white p-2 rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-primary transition-colors"
                >
                    <ChevronRight size={20} />
                </motion.button>
            )}
        </>
    );
}
