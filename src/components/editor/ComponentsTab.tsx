import React, { useState } from 'react';
import { Search, Server, Database as DatabaseIcon, Package, Network, Shield, Activity, GitBranch, Box, Boxes } from 'lucide-react';
import { COMPONENT_LIBRARY_BY_CATEGORY, CATEGORIES, searchComponents, getComponentsByCategory, getAllComponents } from '@/config/componentLibrary';

export default function ComponentsTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const onDragStart = (event: React.DragEvent, component: any) => {
        event.stopPropagation(); // Prevent event bubbling to parent elements
        // Create an icon node (not a service node) with the component data
        event.dataTransfer.setData('application/reactflow', 'icon');
        event.dataTransfer.setData(
            'application/payload',
            JSON.stringify({
                label: component.label,
                iconUrl: component.logoPath || '', // IconNode expects 'iconUrl'
                color: component.defaultColor,
                provider: component.provider,
                category: component.category,
                description: component.description,
            })
        );
        event.dataTransfer.effectAllowed = 'move';
    };

    const filteredComponents = searchQuery
        ? searchComponents(searchQuery)
        : selectedCategory
            ? getComponentsByCategory(selectedCategory)
            : getAllComponents();

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Compute':
                return <Server size={14} />;
            case 'Storage':
                return <Box size={14} />;
            case 'Database':
                return <DatabaseIcon size={14} />;
            case 'Container':
                return <Boxes size={14} />;
            case 'Networking':
                return <Network size={14} />;
            case 'Security':
                return <Shield size={14} />;
            case 'Monitoring':
                return <Activity size={14} />;
            case 'CI/CD':
                return <GitBranch size={14} />;
            case 'Infrastructure':
            case 'Messaging':
                return <Package size={14} />;
            default:
                return <Package size={14} />;
        }
    };

    const getProviderColor = (provider: string) => {
        switch (provider) {
            case 'AWS':
                return 'text-orange-600';
            case 'Azure':
                return 'text-blue-600';
            case 'GCP':
                return 'text-red-600';
            case 'Kubernetes':
                return 'text-blue-500';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Search */}
            <div className="p-3 border-b border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Category Filters */}
            <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedCategory === null
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({getAllComponents().length})
                    </button>
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${selectedCategory === category
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {getCategoryIcon(category)}
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Components Grid */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                {filteredComponents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No components found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2">
                        {filteredComponents.map((component) => (
                            <div
                                key={component.id}
                                draggable
                                onDragStart={(e) => onDragStart(e, component)}
                                className="group cursor-move p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                            >
                                <div className="flex items-start gap-2">
                                    {/* Logo or Color Box */}
                                    {component.logoPath ? (
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 border border-gray-200 shrink-0 p-1">
                                            <img
                                                src={component.logoPath}
                                                alt={component.label}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                                            style={{ backgroundColor: component.defaultColor }}
                                        >
                                            {getCategoryIcon(component.category)}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                                                {component.label}
                                            </h4>
                                            <span className={`text-xs font-medium ${getProviderColor(component.provider)}`}>
                                                {component.provider}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {component.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                {getCategoryIcon(component.category)}
                                                {component.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600 text-center">
                    {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} •
                    Drag to canvas
                </p>
            </div>
        </div>
    );
}
