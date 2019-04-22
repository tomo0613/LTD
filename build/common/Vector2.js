export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        return this;
    }
    normalize() {
        return this.scale(1 / (this.length || 1));
    }
    add(vector) {
        return this.set(this.x + vector.x, this.y + vector.y);
    }
    subtract(vector) {
        return this.set(this.x - vector.x, this.y - vector.y);
    }
    scale(scalar) {
        return this.set(this.x * scalar, this.y * scalar);
    }
    rotateAround(pivot, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const { x, y } = this.subtract(pivot);
        return this.set(x * cos - y * sin + pivot.x, x * sin + y * cos + pivot.y);
    }
    copy(vector) {
        return this.set(vector.x, vector.y);
    }
    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }
    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
Object.defineProperty(Vector2, 'ZERO', {
    value: new Vector2(),
    writable: false,
    enumerable: true,
    configurable: false,
});
//# sourceMappingURL=Vector2.js.map