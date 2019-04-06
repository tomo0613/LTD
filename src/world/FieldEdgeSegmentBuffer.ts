export type EdgeSegmentIndex = 'top'|'right'|'bottom'|'left';
type EdgeSegmentId = number;

export class FieldEdgeSegmentBuffer {
    public top: EdgeSegmentId;
    public right: EdgeSegmentId;
    public bottom: EdgeSegmentId;
    public left: EdgeSegmentId;

    constructor(topEdgeId = 0, rightEdgeId = 0, bottomEdgeId = 0, leftEdgeId = 0) {
        this.top = topEdgeId;
        this.right = rightEdgeId;
        this.bottom = bottomEdgeId;
        this.left = leftEdgeId;
    }
}
