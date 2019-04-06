export class LineSegment {
    constructor(startPoint, endPoint) {
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
//# sourceMappingURL=LineSegment.js.map