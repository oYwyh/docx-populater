export const convertToPdf = async (blob: Blob) => {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();

    // Convert ArrayBuffer to base64 string
    const base64String = Buffer.from(arrayBuffer).toString('base64');

    const response = await fetch('/api/convert', {
        method: 'POST',
        body: JSON.stringify({ file: base64String }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const pdfBlob = await response.blob();
        return pdfBlob
    } else {
        console.error('Failed to convert document');
    }
};

export function normalizeData(data: any) {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] === undefined ? '' : data[key];
        return acc;
    }, {} as any);
}