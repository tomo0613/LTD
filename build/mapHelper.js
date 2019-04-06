import { LineSegment } from './common/LineSegment.js';
import { Vector2 } from './common/Vector2.js';
const horizontalEdgeSegmentIndices = ['top', 'bottom'];
const verticalEdgeSegmentIndices = ['right', 'left'];
const edgeSegmentIndices = [...horizontalEdgeSegmentIndices, ...verticalEdgeSegmentIndices];
let $edgeId;
export default {
    populateFieldEdgeBuffers,
    defineEdges,
};
function populateFieldEdgeBuffers(worldMap) {
    $edgeId = 1;
    worldMap.flat().forEach(setFieldEdgeSegmentBuffer);
}
// https://www.youtube.com/watch?v=fc3nnG2CG8U
function setFieldEdgeSegmentBuffer(field) {
    // if a field is empty then it has no edges at all
    if (field.empty) {
        return;
    }
    let edgeToExtendId = 0;
    edgeSegmentIndices.forEach((edgeSegmentIndex) => {
        const adjacentField = field.adjacentFields[edgeSegmentIndex];
        // there is no edge if an adjacent field is not empty
        if (!adjacentField || !adjacentField.empty) {
            return;
        }
        // edges from left or top fields can be extended
        if (horizontalEdgeSegmentIndices.includes(edgeSegmentIndex)) {
            const fieldToLeft = field.adjacentFields.left;
            edgeToExtendId = fieldToLeft && fieldToLeft.edgeSegmentBuffer[edgeSegmentIndex];
        }
        else if (verticalEdgeSegmentIndices.includes(edgeSegmentIndex)) {
            const fieldToTop = field.adjacentFields.top;
            edgeToExtendId = fieldToTop && fieldToTop.edgeSegmentBuffer[edgeSegmentIndex];
        }
        // if no edge can be extended set a new id for the current direction then increment it to keep it unique
        field.edgeSegmentBuffer[edgeSegmentIndex] = edgeToExtendId ? edgeToExtendId : $edgeId++;
    });
}
function defineEdges(worldMap) {
    const edgePool = worldMap.flat().reduce((edgePool, field) => {
        if (!field.empty) {
            Object.keys(field.edgeSegmentBuffer).forEach((edgeSegmentIndex) => {
                const edgeSegmentId = field.edgeSegmentBuffer[edgeSegmentIndex];
                if (!edgeSegmentId) {
                    return;
                }
                // defined new edge if its id is not in the list
                if (!edgePool[edgeSegmentId]) {
                    edgePool[edgeSegmentId] = new LineSegment(getEdgeStartPoint(field, edgeSegmentIndex), getEdgeEndPoint(field, edgeSegmentIndex));
                    // add segments to an existing edge by updating its endPoint
                }
                else {
                    edgePool[edgeSegmentId].endPoint = getEdgeEndPoint(field, edgeSegmentIndex);
                }
            });
        }
        return edgePool;
    }, {});
    return Object.values(edgePool);
}
function getEdgeStartPoint(field, edgeSegmentIndex) {
    const edgeStartPoint = new Vector2(field.position.x - field.width / 2, field.position.y - field.height / 2);
    if (edgeSegmentIndex === 'right') {
        edgeStartPoint.x = field.position.x + field.height / 2;
    }
    else if (edgeSegmentIndex === 'bottom') {
        edgeStartPoint.y = field.position.y + field.width / 2;
    }
    return edgeStartPoint;
}
function getEdgeEndPoint(field, edgeSegmentIndex) {
    const edgeEndPoint = new Vector2(field.position.x + field.width / 2, field.position.y + field.height / 2);
    if (edgeSegmentIndex === 'left') {
        edgeEndPoint.x = field.position.x - field.height / 2;
    }
    else if (edgeSegmentIndex === 'top') {
        edgeEndPoint.y = field.position.y - field.width / 2;
    }
    return edgeEndPoint;
}
//# sourceMappingURL=mapHelper.js.map