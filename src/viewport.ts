import {Vector2} from './common/Vector2.js';
import {LineSegment} from './common/LineSegment.js';
import {Entity} from './world/Entity.js';

// ToDo use canvas width
const position = new Vector2();
const width = 512;
const widthOffset = width / 2;
const height = 512;
const heightOffset = height / 2;

const topRightCorner = new Vector2(width, 0);
const bottomRightCorner = new Vector2(width, height);
const bottomLeftCorner = new Vector2(0, height);
const topLeftCorner = new Vector2(0, 0);
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

export type Viewport = typeof viewport;

export const viewport = {
    init,
    position,
    edges,
    width,
    height,
    follow,
    corners,
};

function init() {
}

function follow(target: Entity) {
    const targetMoveMethod = target.move.bind(target);

    target.move = (dt) => {
        const {x: xPrev, y: yPrev} = target.position;

        targetMoveMethod(dt);

        const {x, y} = target.position;

        position.copy(target.position);

        if (xPrev !== x) {
            topRightCorner.x = x + widthOffset;
            bottomRightCorner.x = x + widthOffset;
            bottomLeftCorner.x = x - widthOffset;
            topLeftCorner.x = x - widthOffset;
        }
        if (yPrev !== y) {
            topRightCorner.y = y - heightOffset;
            bottomRightCorner.y = y + heightOffset;
            bottomLeftCorner.y = y + heightOffset;
            topLeftCorner.y = y - heightOffset;
        }
    };
}
