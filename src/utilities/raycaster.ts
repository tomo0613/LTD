import {Vector2} from '../common/Vector2.js';
import {LineSegment} from '../common/LineSegment.js';

const pointOfIntersection = new Vector2();

// https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
function findRayIntersection(origin: Vector2, target: Vector2, edges: LineSegment[]): Vector2|undefined {
    let closestHitDistance = Infinity;
    let linesIntersecting = false;

    const {x: lineAp1X, y: lineAp1Y} = origin;
    const {x: lineAp2X, y: lineAp2Y} = target;

    for (let len = edges.length, i = 0; i < len; i++) {
        const {startPoint: {x: lineBp1X, y: lineBp1Y}, endPoint: {x: lineBp2X, y: lineBp2Y}} = edges[i];

        const s1X = lineAp2X - lineAp1X;
        const s1Y = lineAp2Y - lineAp1Y;
        const s2X = lineBp2X - lineBp1X;
        const s2Y = lineBp2Y - lineBp1Y;
        const s = (-s1Y * (lineAp1X - lineBp1X) + s1X * (lineAp1Y - lineBp1Y)) / (-s2X * s1Y + s1X * s2Y);
        // lines not intersecting
        if (s < 0 || s > 1) {
            continue;
        }
        const t = (s2X * (lineAp1Y - lineBp1Y) - s2Y * (lineAp1X - lineBp1X)) / (-s2X * s1Y + s1X * s2Y);
        // lines not intersecting or found an intersection closer to the origin
        if (t < 0 || t > 1 || t > closestHitDistance) {
            continue;
        }

        linesIntersecting = true;
        closestHitDistance = t;

        pointOfIntersection.set(
            lineAp1X + (t * s1X),
            lineAp1Y + (t * s1Y),
        );
    }

    if (linesIntersecting) {
        return pointOfIntersection;
    }
}
