import {Entity} from './world/Entity.js';
import {Field} from './world/Field.js';
import {LineSegment} from './common/LineSegment.js';
import {gameLoop} from './gameLoop.js';
import {viewport} from './viewport.js';
import raycastHelper from './raycastHelper.js';

import mapHelper, {WorldMap} from './mapHelper.js';

interface TemporaryProps {
    fieldRowIndex?: number;
    fieldColumnIndex?: number;
}

const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const aWorldMap = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'x', 'x', 'x', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', 'x', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', 'x', 'x', ' ', 'x', 'x', 'x', 'x', 'x', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
];

const $World = (function () {
    const fieldProps = {
        width: 50,
        height: 50,
    };
    const _tmp: TemporaryProps = {};
    let _worldMap: WorldMap;
    let _edges: LineSegment[];

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

    function getAdjacentFields(rowIndex: PositionIndex, columnIndex: PositionIndex) {
        _tmp.fieldRowIndex = rowIndex;
        _tmp.fieldColumnIndex = columnIndex;

        return adjacentFieldGetter;
    }

    function setMap(worldMapData) {
        _worldMap = worldMapData.map((row, rowIndex: PositionIndex) => {
            return row.map((fieldData, columnIndex: PositionIndex) => toField(rowIndex, columnIndex, fieldData));
        });

        mapHelper.populateFieldEdgeBuffers(_worldMap);
        _edges = mapHelper.defineEdges(_worldMap);
        // visualizeEdges(_edges); // rm
    }

    function getFieldAt(rowIndex: PositionIndex, columnIndex: PositionIndex): Field|undefined {
        return _worldMap[rowIndex] && _worldMap[rowIndex][columnIndex];
    }

    function toField(rowIndex: PositionIndex, columnIndex: PositionIndex, fieldData: string) {
        return new Field(worldInterface, rowIndex, columnIndex, fieldData.trim());
    }
})();

$World.setMap(aWorldMap);

raycastHelper.init(viewport, $World.edges);

const avatar = new Entity(256, 256);

viewport.follow(avatar);

function updateWorld(dt: number) {
    avatar.move(dt);
}

function drawScene() {
    // ToDo use viewport w/h
    (window as any).clear(0, 0);
    const shadows = raycastHelper.visualizeLineOfSight(avatar.position);
    // (window as any).drawImage(shadows, 256 - viewport.position.x, 256 - viewport.position.y);
    (window as any).drawImage(shadows, 0, 0);
    (window as any).drawPoint({x: 256, y: 256});

    visualizeEdges($World.edges);
}

gameLoop.init(drawScene, updateWorld);
gameLoop.start();

/////////////////////////////////////////////////////////////

function visualizeEdges(edges: LineSegment[]) {
    // const rndHex = () => Math.round(Math.random() * 255).toString(16);
    // ctx.strokeStyle = `#${rndHex()}${rndHex()}${rndHex()}`;

    edges.forEach((edge) => {
        // (<any>window).drawLine(edge.startPoint, edge.endPoint);
        (<any>window).drawLine({
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
