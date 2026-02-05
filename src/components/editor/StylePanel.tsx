import { Palette, Sparkles, Copy } from 'lucide-react';
import { useState } from 'react';
import { useDiagramStore } from '@/store/useDiagramStore';

// Style presets for different cloud providers and common patterns
const STYLE_PRESETS = {
    aws: {
        gradient: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
        shadow: '0 4px 12px rgba(255, 153, 0, 0.3)',
        border: '2px solid #FF9900',
        borderRadius: '8px'
    },
    azure: {
        gradient: 'linear-gradient(135deg, #0078D4 0%, #50E6FF 100%)',
        shadow: '0 4px 12px rgba(0, 120, 212, 0.3)',
        border: '2px solid #0078D4',
        borderRadius: '8px'
    },
    gcp: {
        gradient: 'linear-gradient(135deg, #4285F4 0%, #DB4437 50%, #F4B400 100%)',
        shadow: '0 4px 12px rgba(66, 133, 244, 0.3)',
        border: '2px solid #4285F4',
        borderRadius: '8px'
    },
    kubernetes: {
        gradient: 'linear-gradient(135deg, #326CE5 0%, #7BA4E8 100%)',
        shadow: '0 4px 12px rgba(50, 108, 229, 0.3)',
        border: '2px solid #326CE5',
        borderRadius: '12px'
    },
    docker: {
        gradient: 'linear-gradient(135deg, #2496ED 0%, #1D7DB8 100%)',
        shadow: '0 4px 12px rgba(36, 150, 237, 0.3)',
        border: '2px solid #2496ED',
        borderRadius: '8px'
    },
    database: {
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        shadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        border: '2px solid #10B981',
        borderRadius: '8px'
    },
    security: {
        gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        shadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
        border: '2px solid #EF4444',
        borderRadius: '8px'
    },
    monitoring: {
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        shadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
        border: '2px solid #8B5CF6',
        borderRadius: '8px'
    },
    network: {
        gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
        shadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
        border: '2px solid #06B6D4',
        borderRadius: '8px'
    },
    default: {
        gradient: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
        shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #D1D5DB',
        borderRadius: '6px'
    }
};

// Custom gradient builder
const GRADIENT_TYPES = [
    { name: 'Linear', value: 'linear' },
    { name: 'Radial', value: 'radial' },
];

const GRADIENT_DIRECTIONS = [
    { name: '↘️ Top Left', value: '135deg' },
    { name: '⬇️ Top', value: '180deg' },
    { name: '↙️ Top Right', value: '225deg' },
    { name: '➡️ Left', value: '90deg' },
    { name: '⬅️ Right', value: '270deg' },
];

export default function StylePanel() {
    const { nodes, updateNode } = useDiagramStore();
    const selectedNodes = nodes.filter(n => n.selected);

    const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
    const [gradientDirection, setGradientDirection] = useState('135deg');
    const [gradientColor1, setGradientColor1] = useState('#4F46E5');
    const [gradientColor2, setGradientColor2] = useState('#EC4899');

    const [shadowColor, setShadowColor] = useState('#000000');
    const [shadowBlur, setShadowBlur] = useState(12);
    const [shadowOpacity, setShadowOpacity] = useState(0.3);

    const [borderWidth, setBorderWidth] = useState(2);
    const [borderColor, setBorderColor] = useState('#4F46E5');
    const [borderRadius, setBorderRadius] = useState(8);

    const applyPreset = (presetKey: string) => {
        const preset = STYLE_PRESETS[presetKey as keyof typeof STYLE_PRESETS];
        if (!preset || selectedNodes.length === 0) return;

        selectedNodes.forEach(node => {
            updateNode(node.id, {
                style: {
                    ...node.style,
                    background: preset.gradient,
                    boxShadow: preset.shadow,
                    border: preset.border,
                    borderRadius: preset.borderRadius
                }
            });
        });
    };

    const applyCustomGradient = () => {
        if (selectedNodes.length === 0) return;

        const gradient = gradientType === 'linear'
            ? `linear-gradient(${gradientDirection}, ${gradientColor1} 0%, ${gradientColor2} 100%)`
            : `radial-gradient(circle, ${gradientColor1} 0%, ${gradientColor2} 100%)`;

        selectedNodes.forEach(node => {
            updateNode(node.id, {
                style: {
                    ...node.style,
                    background: gradient
                }
            });
        });
    };

    const applyCustomShadow = () => {
        if (selectedNodes.length === 0) return;

        const hexToRgba = (hex: string, opacity: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        };

        const shadow = `0 4px ${shadowBlur}px ${hexToRgba(shadowColor, shadowOpacity)}`;

        selectedNodes.forEach(node => {
            updateNode(node.id, {
                style: {
                    ...node.style,
                    boxShadow: shadow
                }
            });
        });
    };

    const applyCustomBorder = () => {
        if (selectedNodes.length === 0) return;

        selectedNodes.forEach(node => {
            updateNode(node.id, {
                style: {
                    ...node.style,
                    border: `${borderWidth}px solid ${borderColor}`,
                    borderRadius: `${borderRadius}px`
                }
            });
        });
    };

    if (selectedNodes.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 text-sm">
                <Palette className="mx-auto mb-2 opacity-50" size={24} />
                <p>Sélectionnez un nœud pour styliser</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Presets Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} className="text-primary" />
                    <h3 className="font-semibold text-sm">Presets</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(STYLE_PRESETS).map(key => (
                        <button
                            key={key}
                            onClick={() => applyPreset(key)}
                            className="px-3 py-2 text-xs rounded-md border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all capitalize"
                            style={{
                                background: STYLE_PRESETS[key as keyof typeof STYLE_PRESETS].gradient,
                                color: 'white',
                                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                            }}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Custom Gradient */}
            <section>
                <h3 className="font-semibold text-sm mb-3">Gradient Personnalisé</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-600 block mb-1">Type</label>
                        <select
                            value={gradientType}
                            onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                        >
                            {GRADIENT_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    {gradientType === 'linear' && (
                        <div>
                            <label className="text-xs text-gray-600 block mb-1">Direction</label>
                            <select
                                value={gradientDirection}
                                onChange={(e) => setGradientDirection(e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                            >
                                {GRADIENT_DIRECTIONS.map(d => (
                                    <option key={d.value} value={d.value}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-600 block mb-1">Couleur 1</label>
                            <input
                                type="color"
                                value={gradientColor1}
                                onChange={(e) => setGradientColor1(e.target.value)}
                                className="w-full h-8 rounded border border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 block mb-1">Couleur 2</label>
                            <input
                                type="color"
                                value={gradientColor2}
                                onChange={(e) => setGradientColor2(e.target.value)}
                                className="w-full h-8 rounded border border-gray-200"
                            />
                        </div>
                    </div>
                    <button
                        onClick={applyCustomGradient}
                        className="w-full px-3 py-2 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                    >
                        Appliquer Gradient
                    </button>
                </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Custom Shadow */}
            <section>
                <h3 className="font-semibold text-sm mb-3">Ombre Personnalisée</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-600 block mb-1">Couleur</label>
                        <input
                            type="color"
                            value={shadowColor}
                            onChange={(e) => setShadowColor(e.target.value)}
                            className="w-full h-8 rounded border border-gray-200"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 block mb-1">Flou: {shadowBlur}px</label>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={shadowBlur}
                            onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 block mb-1">Opacité: {Math.round(shadowOpacity * 100)}%</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={shadowOpacity * 100}
                            onChange={(e) => setShadowOpacity(parseInt(e.target.value) / 100)}
                            className="w-full"
                        />
                    </div>
                    <button
                        onClick={applyCustomShadow}
                        className="w-full px-3 py-2 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                    >
                        Appliquer Ombre
                    </button>
                </div>
            </section>

            <div className="border-t border-gray-200"></div>

            {/* Custom Border */}
            <section>
                <h3 className="font-semibold text-sm mb-3">Bordure Personnalisée</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-600 block mb-1">Couleur</label>
                        <input
                            type="color"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="w-full h-8 rounded border border-gray-200"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 block mb-1">Épaisseur: {borderWidth}px</label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={borderWidth}
                            onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-600 block mb-1">Arrondi: {borderRadius}px</label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    <button
                        onClick={applyCustomBorder}
                        className="w-full px-3 py-2 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                    >
                        Appliquer Bordure
                    </button>
                </div>
            </section>

            <div className="text-xs text-gray-500 text-center mt-4">
                {selectedNodes.length} nœud{selectedNodes.length > 1 ? 's' : ''} sélectionné{selectedNodes.length > 1 ? 's' : ''}
            </div>
        </div>
    );
}
