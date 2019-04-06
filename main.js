class FieldEdgeComponentCache {
    constructor(topEdgeId = 0, rightEdgeId = 0, bottomEdgeId = 0, leftEdgeId = 0) {
        this.top = topEdgeId;
        this.right = rightEdgeId;
        this.bottom = bottomEdgeId;
        this.left = leftEdgeId;
    }
}

class Field {
    constructor(xIndex, yIndex, props) {
        this.xIndex = xIndex;
        this.yIndex = yIndex;

        this.edgeComponentCache = new FieldEdgeComponentCache();

        if (!props) {
            this.empty = true;
        }
    }

    get adjacentFields() {
        return $World.getAdjacentFields(this.xIndex, this.yIndex);
    }
}

const aWorldMap = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', 'x', 'x', 'x', ' ', ' ', 'x', ' '],
    [' ', ' ', ' ', 'x', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', 'x', 'x', 'x', 'x', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
];

const $World = (function() {
    const _tmp = {};
    let _edgeId;
    let _map;

    const adjacentFieldGetter = {
        get top() {
            return getFieldAt(_tmp.fieldXIndex - 1, _tmp.fieldYIndex);
        },
        get right() {
            return getFieldAt(_tmp.fieldXIndex, _tmp.fieldYIndex + 1);
        },
        get bottom() {
            return getFieldAt(_tmp.fieldXIndex + 1, _tmp.fieldYIndex);
        },
        get left() {
            return getFieldAt(_tmp.fieldXIndex, _tmp.fieldYIndex - 1);
        },
    };

    return {
        setMap,
        getFieldAt,
        getAdjacentFields,
    };

    function getAdjacentFields(xIndex, yIndex) {
        _tmp.fieldXIndex = xIndex;
        _tmp.fieldYIndex = yIndex;

        return adjacentFieldGetter;
    }

    function setMap(worldMap) {
        _map = worldMap.map((row, xIndex) => row.map((fieldData, yIndex) => toField(xIndex, yIndex, fieldData)));
        populateFieldEdgeCaches();
    }

    function getFieldAt(xIndex, yIndex) {
        return _map[xIndex] && _map[xIndex][yIndex];
    }

    function toField(xIndex, yIndex, fieldData) {
        return new Field(xIndex, yIndex, fieldData.trim());
    }

    function populateFieldEdgeCaches() {
        _edgeId = 1;
        // _map.forEach((row) => row.forEach(setFieldEdgeComponentCache));
        _map.flat().forEach(setFieldEdgeComponentCache);
    }

    // https://www.youtube.com/watch?v=fc3nnG2CG8U
    function setFieldEdgeComponentCache(field) {
        const horizontalEdgeIndices = ['top', 'bottom'];
        const verticalEdgeIndices = ['right', 'left'];
        const edgeIndices = [...horizontalEdgeIndices, ...verticalEdgeIndices];

        let edgeIdToExtend = 0;
        // if a field is empty then it has no edges at all
        if (!field.empty) {
            edgeIndices.forEach((edgeIndex) => {
                const adjacentField = field.adjacentFields[edgeIndex];
                // if it has a not empty adjacent field in a specific direction then there is no edge at that direction
                if (!adjacentField || !adjacentField.empty) {
                    return;
                }

                // edges from left or top fields can be extended
                if (horizontalEdgeIndices.includes(edgeIndex)) {
                    const fieldToLeft = field.adjacentFields.left;

                    edgeIdToExtend = fieldToLeft && fieldToLeft.edgeCache[edgeIndex];
                } else if (verticalEdgeIndices.includes(edgeIndex)) {
                    const fieldToTop = field.adjacentFields.top;

                    edgeIdToExtend = fieldToTop && fieldToTop.edgeCache[edgeIndex];
                }
                // if no edge can be extended set a new id for the current direction then increment it to keep it unique
                field.edgeComponentCache[edgeIndex] = edgeIdToExtend ? edgeIdToExtend : _edgeId++;
            });
        }
    }

    // edges are defined by a start and an end coordinate (vec2)
    function defineEdges() {
        const edgePool = _map.flat().reduce((edges, field) => {
            if (!field.empty) {
                // define new edge if id not found
                // need to set start & end
                field.edgeComponentCache;
            }

            return edges;
        });
    }
})();

$World.setMap(aWorldMap);
