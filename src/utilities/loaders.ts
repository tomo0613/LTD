export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = _ => resolve(image);
        image.onerror = (e) => {
            console.error(`can not load image: "${image.src}". ERROR: ${e}`);
            reject(e);
        };
        image.src = url;
    });
}

export function loadJSON(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = _ => resolve(JSON.parse(xhr.responseText));
        xhr.onerror = (e) => {
            console.error(`can not load JSON: "${url}". ERROR: ${e}`);
            reject(e);
        };
        xhr.send();
    });
}
