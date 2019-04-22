import {Vector2} from './common/Vector2.js';
import {LineSegment} from './common/LineSegment.js';
import {Entity} from './gameObject/Entity.js';

const position = new Vector2();
const topRightCorner = new Vector2();
const bottomRightCorner = new Vector2();
const bottomLeftCorner = new Vector2();
const topLeftCorner = new Vector2();
const corners = {
    topRight: topRightCorner,
    bottomRight: bottomRightCorner,
    bottomLeft: bottomLeftCorner,
    topLeft: topLeftCorner,
};
const edges = {
    top: new LineSegment(topLeftCorner, topRightCorner),
    right: new LineSegment(topRightCorner, bottomRightCorner),
    bottom: new LineSegment(bottomRightCorner, bottomLeftCorner),
    left: new LineSegment(bottomLeftCorner, topLeftCorner),
};
let width: number;
let height: number;
let horizontalCenterOffset: number;
let verticalCenterOffset: number;

export type Viewport = typeof viewport;

export const viewport = {
    init,
    position,
    width,
    height,
    horizontalCenterOffset,
    verticalCenterOffset,
    edges,
    corners,
    followTarget,
};

function init(_width: number, _height: number) {
    viewport.width = width = _width;
    viewport.height = height = _height;
    viewport.horizontalCenterOffset = horizontalCenterOffset = width / 2;
    viewport.verticalCenterOffset = verticalCenterOffset = height / 2;

    topRightCorner.set(width, 0);
    bottomRightCorner.set(width, height);
    bottomLeftCorner.set(0, height);
    // topLeftCorner.set(0, 0);
}

function followTarget(target: Entity) {
    const targetUpdateMethod = target.update;

    target.update = function () {
        const {x: xPrev, y: yPrev} = target.position;

        targetUpdateMethod.apply(target, arguments);

        const {x, y} = target.position;

        if (xPrev !== x) {
            position.x = x;
            topRightCorner.x = x + horizontalCenterOffset;
            bottomRightCorner.x = x + horizontalCenterOffset;
            bottomLeftCorner.x = x - horizontalCenterOffset;
            topLeftCorner.x = x - horizontalCenterOffset;
        }
        if (yPrev !== y) {
            position.y = y;
            topRightCorner.y = y - verticalCenterOffset;
            bottomRightCorner.y = y + verticalCenterOffset;
            bottomLeftCorner.y = y + verticalCenterOffset;
            topLeftCorner.y = y - verticalCenterOffset;
        }
    };

    position.copy(target.position);
    topRightCorner.set(target.position.x + horizontalCenterOffset, target.position.y - verticalCenterOffset);
    bottomRightCorner.set(target.position.x + horizontalCenterOffset, target.position.y + verticalCenterOffset);
    bottomLeftCorner.set(target.position.x - horizontalCenterOffset, target.position.y + verticalCenterOffset);
    topLeftCorner.set(target.position.x - horizontalCenterOffset, target.position.y - verticalCenterOffset);
}
