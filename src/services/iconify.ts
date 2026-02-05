export interface IconResult {
    name: string;
    prefix: string;
    title?: string;
}

export const searchIcons = async (query: string): Promise<IconResult[]> => {
    if (!query || query.length < 2) return [];

    try {
        const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(query)}&limit=20`);
        const data = await response.json();
        // Iconify search returns { icons: ["prefix:name", ...] }
        return (data.icons || []).map((fullKey: string) => {
            const [prefix, name] = fullKey.split(':');
            return { prefix, name, fullKey };
        });
    } catch (error) {
        console.error("Iconify search error:", error);
        return [];
    }
};

export const getIconSvgUrl = (prefix: string, name: string) => {
    return `https://api.iconify.design/${prefix}/${name}.svg`;
};
