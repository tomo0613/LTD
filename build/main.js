import { Field } from './gameObject/Field.js';
import { gameLoop } from './gameLoop.js';
import { viewport } from './viewport.js';
import { canvasRenderer } from './canvasRenderer.js';
import raycastHelper from './raycastHelper.js';
import mapHelper from './mapHelper.js';
import { loadImage } from './utilities/imageLoader.js';
import { createAvatar } from './world/avatar.js';
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
    const _tmp = {};
    let fieldMap;
    let edges;
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
            return edges;
        },
        get blockingFields() {
            return fieldMap.flat().filter(field => !field.empty);
        },
    };
    return worldInterface;
    function getAdjacentFields(rowIndex, columnIndex) {
        _tmp.fieldRowIndex = rowIndex;
        _tmp.fieldColumnIndex = columnIndex;
        return adjacentFieldGetter;
    }
    function setMap(worldMapData) {
        fieldMap = worldMapData.map((row, rowIndex) => {
            return row.map((fieldData, columnIndex) => toField(rowIndex, columnIndex, fieldData));
        });
        mapHelper.populateFieldEdgeBuffers(fieldMap);
        edges = mapHelper.defineEdges(fieldMap);
        // visualizeEdges(_edges); // rm
    }
    function getFieldAt(rowIndex, columnIndex) {
        return fieldMap[rowIndex] && fieldMap[rowIndex][columnIndex];
    }
    function toField(rowIndex, columnIndex, fieldData) {
        return new Field(worldInterface, rowIndex, columnIndex, fieldData.trim());
    }
})();
// const lightRadius = (function () {
//     const frameBuffer = document.createElement('canvas');
//     frameBuffer.width = frameBuffer.height = 512;
//     const renderingContext = frameBuffer.getContext('2d');
//     renderingContext.fillRect(0, 0, frameBuffer.width, frameBuffer.height);
//     renderingContext.globalCompositeOperation = 'destination-out';
//     renderingContext.filter = 'blur(50px)';
//     renderingContext.beginPath();
//     renderingContext.arc(256, 256, 150, 0, Math.PI * 2);
//     renderingContext.fill();
//     return frameBuffer;
// })();
(async function init() {
    const avatarSprites = await loadImage('../img/militiaWarrior.png');
    const avatar = createAvatar(avatarSprites);
    const entities = [avatar];
    $World.setMap(aWorldMap);
    const blockingFields = $World.blockingFields;
    viewport.init(640, 480);
    viewport.followTarget(avatar);
    raycastHelper.init(viewport, $World.edges);
    canvasRenderer.init(viewport);
    gameLoop.init(drawScene, updateWorld);
    gameLoop.start();
    function updateWorld(dt) {
        avatar.update(dt, blockingFields);
    }
    function drawScene() {
        canvasRenderer.clear();
        const shadowPolygon = raycastHelper.visualizeLineOfSight(avatar.position);
        // canvasRenderer.drawImage(lightRadius);
        canvasRenderer.drawImage(shadowPolygon);
        canvasRenderer.drawScene(entities);
        // visualizeEdges($World.edges);
    }
})();
//# sourceMappingURL=main.js.map