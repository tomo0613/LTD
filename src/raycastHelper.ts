import {LineSegment} from './common/LineSegment.js';
import {Vector2} from './common/Vector2.js';
import {Viewport} from './viewport.js';
import {VertexPool} from './VertexPool.js';

const frameBuffer = document.createElement('canvas');
const renderingContext = frameBuffer.getContext('2d');
const shadowColor = '#131720';

const ray = new Vector2();
const target = new Vector2();
const targetBefore = new Vector2();
const targetAfter = new Vector2();
const rayOffset = 0.0001;
let maxRayLength = 1;

const pointOfIntersection = new Vector2();
const vertexPool = new VertexPool(10);

let visibleVertices: Vector2[] = [];
let worldEdges: LineSegment[] = [];
let worldVertices: Vector2[] = [];

let moveToFirstLine: boolean;
let lineTo: (x: number, y: number) => void;
let defineViewportEdgeIntersections: () => void;
let isVertexVisible: (vertex: Vector2) => boolean;

export default {
    init,
    visualizeLineOfSight,
};

function init({width, height, position: viewportPosition, ...viewport}: Viewport, edges: LineSegment[]) {
    const horizontalOffset = width / 2;
    const verticalOffset = height / 2;
    const viewportEdges = Object.values(viewport.edges);
    const viewportEdgeGroupA = [viewport.edges.top, viewport.edges.right];
    const viewportEdgeGroupB = [viewport.edges.bottom, viewport.edges.left];

    frameBuffer.width = width;
    frameBuffer.height = height;

    worldEdges = edges;
    worldVertices = defineVertices(edges);

    renderingContext.fillStyle = shadowColor;

    worldEdges.push(...viewportEdges);
    worldVertices.push(...Object.values(viewport.corners));

    maxRayLength = Math.ceil(Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)));

    lineTo = function (x: number, y: number) {
        if (moveToFirstLine) {
            renderingContext.moveTo(horizontalOffset - viewportPosition.x + x, verticalOffset - viewportPosition.y + y);

            moveToFirstLine = false;
        } else {
            renderingContext.lineTo(horizontalOffset - viewportPosition.x + x, verticalOffset - viewportPosition.y + y);
        }
    };

    defineViewportEdgeIntersections = function () {
        for (let len = worldEdges.length, i = 0; i < len; i++) {
            const edge = worldEdges[i];
            const {startPoint, endPoint} = edge;
            const edgeTop = Math.min(startPoint.y, endPoint.y);
            const edgeRight = Math.max(startPoint.x, endPoint.x);
            const edgeBottom = Math.max(startPoint.y, endPoint.y);
            const edgeLeft = Math.min(startPoint.x, endPoint.x);
            const {startPoint: {x: viewportRight, y: viewportTop}} = viewport.edges.right;
            const {startPoint: {x: viewportLeft, y: viewportBottom}} = viewport.edges.left;

            if (edge.vertical) {
                if (edgeLeft <= viewportLeft || viewportRight <= edgeRight
                    || edgeBottom <= viewportTop || viewportBottom <= edgeTop
                    || viewportTop <= edgeTop && edgeBottom <= viewportBottom
                ) {
                    continue;
                }
            }

            if (edge.horizontal) {
                if (edgeTop <= viewportTop || viewportBottom <= edgeBottom
                    || viewportRight <= edgeLeft || edgeRight <= viewportLeft
                    || viewportLeft <= edgeLeft && edgeRight <= viewportRight
                ) {
                    continue;
                }
            }

            if (findPointOfIntersection(startPoint, endPoint, viewportEdgeGroupA)) {
                visibleVertices.push(vertexPool.obtain(pointOfIntersection));
            }
            if (findPointOfIntersection(startPoint, endPoint, viewportEdgeGroupB)) {
                visibleVertices.push(vertexPool.obtain(pointOfIntersection));
            }
        }
    };

    isVertexVisible = function ({x, y}: Vector2) {
        const {x: viewportRight, y: viewportTop} = viewport.corners.topRight;
        const {x: viewportLeft, y: viewportBottom} = viewport.corners.bottomLeft;

        return viewportLeft <= x && x <= viewportRight
            && viewportTop <= y && y <= viewportBottom;
    };
}

// cast rays towards each vertex on screen
function visualizeLineOfSight(origin: Vector2) {
    // ToDo refactor - do not create new array if possible
    visibleVertices = worldVertices.filter(isVertexVisible);

    defineViewportEdgeIntersections();

    // sort vertices (corner points) by ray angle
    visibleVertices.sort((a, b) => {
        return Math.atan2(a.y - origin.y, a.x - origin.x) > Math.atan2(b.y - origin.y, b.x - origin.x) ? 1 : -1;
    });

    renderingContext.globalCompositeOperation = 'source-over';
    renderingContext.fillRect(0, 0, frameBuffer.width, frameBuffer.height);
    renderingContext.globalCompositeOperation = 'destination-out';
    moveToFirstLine = true;
    renderingContext.beginPath();

    for (let len = visibleVertices.length, i = 0; i < len; i++) {
        ray.copy(origin).subtract(visibleVertices[i]).normalize().scale(-maxRayLength);
        target.copy(origin).add(ray);
        targetBefore.copy(target).rotateAround(origin, -rayOffset);
        targetAfter.copy(target).rotateAround(origin, rayOffset);

        // cast rays before and after a specified vertex
        if (findPointOfIntersection(origin, targetBefore, worldEdges)) {
            lineTo(pointOfIntersection.x, pointOfIntersection.y);
        }
        if (findPointOfIntersection(origin, targetAfter, worldEdges)) {
            lineTo(pointOfIntersection.x, pointOfIntersection.y);
        }
    }

    renderingContext.closePath();
    renderingContext.fill();

    return frameBuffer;
}

function findPointOfIntersection(origin: Vector2, target: Vector2, edges: LineSegment[]): Vector2|undefined {
    let closestHitDistance = Infinity;
    let linesIntersecting = false;

    const {x: lineAp1X, y: lineAp1Y} = origin;
    const {x: lineAp2X, y: lineAp2Y} = target;

    // https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
    for (let len = edges.length, i = 0; i < len; i++) {
        const {startPoint: {x: lineBp1X, y: lineBp1Y}, endPoint: {x: lineBp2X, y: lineBp2Y}} = edges[i];
        // ToDo ?? continue if edge is offscreen

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

function defineVertices(edges: LineSegment[]) {
    const vertexIndices: Map<string, Vector2> = new Map();

    edges.forEach(({startPoint: vertexA, endPoint: vertexB}) => {
        // every vertex is duplicated by the edges, override the ones with same indices
        vertexIndices.set(`${vertexA.x}_${vertexA.y}`, vertexA);
        vertexIndices.set(`${vertexB.x}_${vertexB.y}`, vertexB);
    });

    return Array.from(vertexIndices.values());
}
