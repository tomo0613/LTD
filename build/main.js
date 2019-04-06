import { Entity } from './world/Entity.js';
import { Field } from './world/Field.js';
import { gameLoop } from './gameLoop.js';
import { viewport } from './viewport.js';
import raycastHelper from './raycastHelper.js';
import mapHelper from './mapHelper.js';
const canvas = document.getElementById('canvas');
const aWorldMap = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'x', 'x', 'x', ' ', 'x', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', 'x', 'x', 'x', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', 'x', 'x', ' ', ' ', ' ', ' '],
    [' ', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'x', 'x', ' ', 'x', 'x', 'x', 'x', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
];
const $World = (function () {
    const fieldProps = {
        width: 50,
        height: 50,
    };
    const _tmp = {};
    let _worldMap;
    let _edges;
    const adjacentFieldGetter = {
        get top() {
            return getFieldAt(_tmp.fieldRowIndex - 1, _tmp.fieldColumnIndex);
        },
        get right() {
            return getFieldAt(_tmp.fieldRowIndex, _tmp.fieldColumnIndex + 1);
        },
        get bottom() {
            return getFieldAt(_tmp.fieldRowIndex + 1, _tmp.fieldColumnIndex);
        },
        get left() {
            return getFieldAt(_tmp.fieldRowIndex, _tmp.fieldColumnIndex - 1);
        },
    };
    const worldInterface = {
        fieldProps,
        setMap,
        getFieldAt,
        getAdjacentFields,
        get edges() {
            return _edges;
        },
    };
    return worldInterface;
    function getAdjacentFields(rowIndex, columnIndex) {
        _tmp.fieldRowIndex = rowIndex;
        _tmp.fieldColumnIndex = columnIndex;
        return adjacentFieldGetter;
    }
    function setMap(worldMapData) {
        _worldMap = worldMapData.map((row, rowIndex) => {
            return row.map((fieldData, columnIndex) => toField(rowIndex, columnIndex, fieldData));
        });
        mapHelper.populateFieldEdgeBuffers(_worldMap);
        _edges = mapHelper.defineEdges(_worldMap);
        // visualizeEdges(_edges); // rm
    }
    function getFieldAt(rowIndex, columnIndex) {
        return _worldMap[rowIndex] && _worldMap[rowIndex][columnIndex];
    }
    function toField(rowIndex, columnIndex, fieldData) {
        return new Field(worldInterface, rowIndex, columnIndex, fieldData.trim());
    }
})();
$World.setMap(aWorldMap);
raycastHelper.init(viewport, $World.edges);
const avatar = new Entity(256, 256);
viewport.follow(avatar);
function updateWorld(dt) {
    avatar.move(dt);
}
function drawScene() {
    // ToDo use viewport w/h
    window.clear(0, 0);
    const shadows = raycastHelper.visualizeLineOfSight(avatar.position);
    // (window as any).drawImage(shadows, 256 - viewport.position.x, 256 - viewport.position.y);
    window.drawImage(shadows, 0, 0);
    window.drawPoint({ x: 256, y: 256 });
    visualizeEdges($World.edges);
}
gameLoop.init(drawScene, updateWorld);
gameLoop.start();
/////////////////////////////////////////////////////////////
function visualizeEdges(edges) {
    // const rndHex = () => Math.round(Math.random() * 255).toString(16);
    // ctx.strokeStyle = `#${rndHex()}${rndHex()}${rndHex()}`;
    edges.forEach((edge) => {
        // (<any>window).drawLine(edge.startPoint, edge.endPoint);
        window.drawLine({
            x: 256 - viewport.position.x + edge.startPoint.x,
            y: 256 - viewport.position.y + edge.startPoint.y,
        }, {
            x: 256 - viewport.position.x + edge.endPoint.x,
            y: 256 - viewport.position.y + edge.endPoint.y,
        });
    });
}
// castLight
function clipArc(ctx, x, y, radius = 100) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.filter = 'blur(25px)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
}
//# sourceMappingURL=main.js.map