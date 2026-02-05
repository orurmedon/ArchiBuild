import * as THREE from 'three';

/**
 * Cache for loaded textures to avoid reloading the same image multiple times
 */
const textureCache = new Map<string, THREE.Texture>();

/**
 * Converts an SVG string to a canvas-based texture that can be used in Three.js
 */
export async function svgToTexture(svgString: string, size = 256): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        img.onload = () => {
            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, size, size);

            // Draw SVG
            ctx.drawImage(img, 0, 0, size, size);

            // Create texture
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;

            URL.revokeObjectURL(url);
            resolve(texture);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load SVG'));
        };

        img.src = url;
    });
}

/**
 * Loads a texture from a URL (image or SVG) with caching
 */
export async function loadTexture(url: string): Promise<THREE.Texture> {
    // Check cache first
    if (textureCache.has(url)) {
        return textureCache.get(url)!;
    }

    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            (texture) => {
                texture.needsUpdate = true;
                textureCache.set(url, texture);
                resolve(texture);
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);
                reject(error);
            }
        );
    });
}

/**
 * Loads an icon texture from Iconify or similar sources
 */
export async function loadIconTexture(iconKey: string, fallbackUrl?: string): Promise<THREE.Texture | null> {
    try {
        // Try to load from Iconify API first
        const iconifyUrl = `https://api.iconify.design/${iconKey}.svg`;

        const response = await fetch(iconifyUrl);
        if (response.ok) {
            const svgString = await response.text();
            return await svgToTexture(svgString);
        }

        // Fallback to direct URL if provided
        if (fallbackUrl) {
            return await loadTexture(fallbackUrl);
        }

        return null;
    } catch (error) {
        console.warn(`Failed to load icon texture for ${iconKey}:`, error);
        return null;
    }
}

/**
 * Creates a texture from text (for labels, badges, etc.)
 */
export function textToTexture(text: string, options: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    padding?: number;
} = {}): THREE.Texture {
    const {
        fontSize = 64,
        fontFamily = 'Arial, sans-serif',
        color = '#000000',
        backgroundColor = '#ffffff',
        padding = 20
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Set font to measure text
    ctx.font = `${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize * 1.2; // Approximate height

    // Set canvas size
    canvas.width = textWidth + padding * 2;
    canvas.height = textHeight + padding * 2;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * Clears the texture cache to free memory
 */
export function clearTextureCache(): void {
    textureCache.forEach(texture => texture.dispose());
    textureCache.clear();
}
