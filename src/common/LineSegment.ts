import {Vector2} from './Vector2.js';

export class LineSegment {
    public startPoint: Vector2;
    public endPoint: Vector2;
    public vertical?: boolean;
    public horizontal?: boolean;

    constructor(startPoint: Vector2, endPoint: Vector2) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;

        if (startPoint.x === endPoint.x) {
            this.vertical = true;
        }
        if (startPoint.y === endPoint.y) {
            this.horizontal = true;
        }
    }
}
