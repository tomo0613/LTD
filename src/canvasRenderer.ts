import {Viewport} from './viewport.js';
import {Entity} from './gameObject/Entity.js';
import {projectilePool} from './world/projectiles.js';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderingContext = canvas.getContext('2d');

let viewport: Viewport;
let viewportHorizontalCenterOffset: number;
let viewportVerticalCenterOffset: number;

export type CanvasRenderer = typeof canvasRenderer;

export const canvasRenderer = {
    init,
    clear,
    drawImage,
    drawScene,
};

function init(_viewport: Viewport) {
    viewport = _viewport;
    viewportHorizontalCenterOffset = viewport.horizontalCenterOffset;
    viewportVerticalCenterOffset = viewport.verticalCenterOffset;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
}

function clear() {
    renderingContext.clearRect(0, 0, canvas.width, canvas.height);
}

function drawImage(image: CanvasImageSource, x = 0, y = 0) {
    renderingContext.drawImage(image, x, y);
}

function drawScene(entities: Entity[]) {
    const {position: {x: viewportX, y: viewportY}} = viewport;
    const viewportCenterX = viewportHorizontalCenterOffset - viewportX;
    const viewportCenterY = viewportVerticalCenterOffset - viewportY;

    for (let len = entities.length, i = 0; i < len; i++) {
        const {width, height, position: {x, y}, graphics} = entities[i];

        drawImage(
            graphics.getNextFrame(),
            viewportCenterX + x - width / 2 + graphics.horizontalCenterOffset,
            viewportCenterY + y - height / 2 + graphics.verticalCenterOffset,
        );
        // ToDo rm
        // drawRect(
        //     viewportCenterX + x - width / 2,
        //     viewportCenterY + y - height / 2,
        //     width,
        //     height,
        // );
        drawDot(viewportCenterX + x, viewportCenterY + y);
    }

    for (let len = projectilePool.activeCount, i = 0; i < len; i++) {
        const {width, height, position: {x, y}, graphics} = projectilePool.items[i];

        drawImage(
            graphics.getNextFrame(),
            viewportCenterX + x - width / 2 + graphics.horizontalCenterOffset,
            viewportCenterY + y - height / 2 + graphics.verticalCenterOffset,
        );
        // ToDo rm draw entity border
        drawRect(
            viewportCenterX + x - width / 2,
            viewportCenterY + y - height / 2,
            width,
            height,
        );
        drawDot(viewportCenterX + x, viewportCenterY + y);
    }
}

/////////////////////////////////////////////////////////////

function drawDot(x: number, y: number, radius = 3) {
    renderingContext.fillStyle = 'red';
    renderingContext.beginPath();
    renderingContext.arc(x, y, radius, 0, Math.PI * 2);
    renderingContext.fill();
    renderingContext.fillStyle = 'black';
}

function drawRect(x: number, y: number, width: number, height: number) {
    renderingContext.strokeStyle = 'greenyellow';
    renderingContext.strokeRect(x, y, width, height);
}

// drawLine = function (startPoint, endPoint) {
//     ctx.strokeStyle = '#229922';
//     ctx.beginPath();
//     ctx.moveTo(startPoint.x, startPoint.y);
//     ctx.lineTo(endPoint.x, endPoint.y);
//     ctx.closePath();
//     ctx.stroke();
// }

// function visualizeEdges(edges: LineSegment[]) {
//     // const rndHex = () => Math.round(Math.random() * 255).toString(16);
//     // ctx.strokeStyle = `#${rndHex()}${rndHex()}${rndHex()}`;

//     edges.forEach((edge) => {
//         // (<any>window).drawLine(edge.startPoint, edge.endPoint);
//         (<any>window).drawLine({
//             x: 256 - viewport.position.x + edge.startPoint.x,
//             y: 256 - viewport.position.y + edge.startPoint.y,
//         }, {
//             x: 256 - viewport.position.x + edge.endPoint.x,
//             y: 256 - viewport.position.y + edge.endPoint.y,
//         });
//     });
// }
