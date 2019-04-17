export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = _ => resolve(image);
        image.onerror = (e) => {
            console.error(`can not load image: "${image.src}". ERROR: ${e}`);
            reject(image);
        };

        image.src = url;
    });
}
