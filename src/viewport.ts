import {Vector2} from './common/Vector2.js';
import {LineSegment} from './common/LineSegment.js';
import {Entity} from './world/Entity.js';

const position = new Vector2();
const width = 512; // ToDo usecanvas width
const widthOffset = width / 2;
const height = 512;
const heightOffset = height / 2;

const topRightCorner = new Vector2(width, 0);
const bottomRightCorner = new Vector2(width, height);
const bottomLeftCorner = new Vector2(0, height);
const topLeftCorner = new Vector2(0, 0);
const edges = [
    new LineSegment(topLeftCorner, topRightCorner),
    new LineSegment(topRightCorner, bottomRightCorner),
    new LineSegment(bottomRightCorner, bottomLeftCorner),
    new LineSegment(bottomLeftCorner, topLeftCorner),
];

export type Viewport = typeof viewport;

export const viewport = {
    init,
    position,
    edges,
    width,
    height,
    follow,
    corners: [topRightCorner, bottomRightCorner, bottomLeftCorner, topLeftCorner],
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
