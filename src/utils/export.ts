import { toPng } from 'html-to-image';

export const downloadJSON = (data: any, originalFilename: string = 'project') => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = `${originalFilename}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
};

export const downloadImage = async (elementSelector: string, filename: string = 'diagram') => {
    const node = document.querySelector(elementSelector) as HTMLElement;
    if (!node) {
        console.error('Element not found for export:', elementSelector);
        return;
    }

    try {
        const dataUrl = await toPng(node, {
            backgroundColor: '#ffffff', // Ensure white background for transparent parts
            filter: (node) => {
                // Exclude controls from screenshot if needed
                return !node.classList?.contains('react-flow__controls');
            }
        });

        const link = document.createElement('a');
        link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export image:', error);
    }
};
