const canvas = document.getElementById('canvas');
const renderingContext = canvas.getContext('2d');
export const canvasRenderer = {
    init,
    clear,
    drawImage,
    drawScene,
};
function init(viewport) {
    canvas.width = viewport.width;
    canvas.height = viewport.height;
}
function clear() {
    renderingContext.clearRect(0, 0, canvas.width, canvas.height);
}
function drawImage(image, x = 0, y = 0) {
    renderingContext.drawImage(image, x, y);
}
function drawScene(entities) {
    entities.forEach((entity) => {
        drawImage(entity.animation.getNextFrame());
    });
}
// window.canvas = document.getElementById('canvas');
// window.ctx = canvas.getContext('2d');
// window.drawLine = function (startPoint, endPoint) {
//     ctx.strokeStyle = '#229922';
//     ctx.beginPath();
//     ctx.moveTo(startPoint.x, startPoint.y);
//     ctx.lineTo(endPoint.x, endPoint.y);
//     ctx.closePath();
//     ctx.stroke();
// }
// window.drawPoint = function (position, radius = 3) {
//     ctx.fillStyle = '#FF0000';
//     ctx.beginPath();
//     ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
//     ctx.fill();
//     ctx.fillStyle = '#000000';
// }
/////////////////////////////////////////////////////////////
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
//# sourceMappingURL=canvasRenderer.js.map