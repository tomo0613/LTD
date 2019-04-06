import {LineSegment} from './common/LineSegment.js';
import {Vector2} from './common/Vector2.js';
import {Viewport} from './viewport.js';

const frameBuffer = document.createElement('canvas');
const renderingContext = frameBuffer.getContext('2d');

const ray = new Vector2();
const target = new Vector2();
const targetBefore = new Vector2();
const targetAfter = new Vector2();
const secondaryRayOffset = 0.0001;
let maxRayLength = 365;

const pointOfIntersection = new Vector2();

let $edges: LineSegment[] = [];
let $vertices: Vector2[] = [];
// ToDo is it neccessary ?
let moveToFirstLine: boolean;
let lineTo: Function;

export default {
    init,
    visualizeLineOfSight,
};

function init({width, height, position, edges: viewportEdges}: Viewport, edges: LineSegment[], options?: any) {
    const widthOffset = width / 2;
    const heightOffset = height / 2;

    frameBuffer.width = width;
    frameBuffer.height = height;

    $edges = edges;
    $edges.push(...viewportEdges);
    $vertices = defineVertices(edges);

    maxRayLength = Math.ceil(Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)));

    lineTo = function (x: number, y: number) {
        if (moveToFirstLine) {
            renderingContext.moveTo(widthOffset - position.x + x, heightOffset - position.y + y);

            moveToFirstLine = false;
        } else {
            renderingContext.lineTo(widthOffset - position.x + x, heightOffset - position.y + y);
        }
    };
}

// cast rays towards each vertex on screen
function visualizeLineOfSight(origin: Vector2) {
    // ToDo get intersections of viewport edges

    // ToDo filter offscreen vertices

    // sort vertices (corner points) by ray angle
    $vertices.sort((a, b) => {
        return Math.atan2(a.y - origin.y, a.x - origin.x) > Math.atan2(b.y - origin.y, b.x - origin.x) ? 1 : 0;
    });

    renderingContext.fillRect(0, 0, frameBuffer.width, frameBuffer.height);
    renderingContext.globalCompositeOperation = 'destination-out';
    moveToFirstLine = true;
    renderingContext.beginPath();

    for (let len = $vertices.length, i = 0; i < len; i++) {
        ray.copy(origin).subtract($vertices[i]).normalize().scale(-maxRayLength);
        target.copy(origin).add(ray);
        targetBefore.copy(target).rotateAround(origin, -secondaryRayOffset);
        targetAfter.copy(target).rotateAround(origin, secondaryRayOffset);

        // cast rays before and after a specified vertex
        if (findPointOfIntersection(origin, targetBefore)) {
            lineTo(pointOfIntersection.x, pointOfIntersection.y);
        }
        if (findPointOfIntersection(origin, targetAfter)) {
            lineTo(pointOfIntersection.x, pointOfIntersection.y);
        }
    }

    renderingContext.closePath();
    renderingContext.fill();
    renderingContext.globalCompositeOperation = 'source-over';

    return frameBuffer;
}

function findPointOfIntersection(origin: Vector2, target: Vector2): Vector2|undefined {
    let closestHitDistance = Infinity;
    let linesIntersecting = false;

    const {x: lineAp1X, y: lineAp1Y} = origin;
    const {x: lineAp2X, y: lineAp2Y} = target;

    // https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
    for (let len = $edges.length, i = 0; i < len; i++) {
        const {startPoint: {x: lineBp1X, y: lineBp1Y}, endPoint: {x: lineBp2X, y: lineBp2Y}} = $edges[i];
        // ToDo continue if edge is offscreen

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
        // ToDo rm
        visualizeHitPosition(origin, pointOfIntersection);
        visualizeRay(origin, target);
        return pointOfIntersection;
    }
}

function defineVertices(edges: LineSegment[]) {
    const vertexIndices: Map<string, Vector2> = new Map();

    edges.forEach(({startPoint: vertexA, endPoint: vertexB}) => {
        // every vertex is duplicated by the edges, override the ones with same indices
        vertexIndices.set(`${vertexA.x}_${vertexA.y}`, vertexA);
        vertexIndices.set(`${vertexB.x}_${vertexB.y}`, vertexB);
    });

    return Array.from(vertexIndices.values());
}

// rm
function visualizeRay(origin, endPoint) {
    (<any>window).drawLine({
        x: 256 - origin.x + origin.x,
        y: 256 - origin.y + origin.y,
    }, {
        x: 256 - origin.x + endPoint.x,
        y: 256 - origin.y + endPoint.y,
    });
}

function visualizeHitPosition(origin, hitPosition) {
    (window as any).drawPoint({
        x: 256 - origin.x + hitPosition.x,
        y: 256 - origin.y + hitPosition.y,
    });
}
