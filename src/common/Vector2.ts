export class Vector2 {
    public x: number;
    public y: number;

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

    add(vector: Vector2) {
        return this.set(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector2) {
        return this.set(this.x - vector.x, this.y - vector.y);
    }

    scale(scalar: number) {
        return this.set(this.x * scalar, this.y * scalar);
    }

    rotateAround(pivot: Vector2, angle: number) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const {x, y} = this.subtract(pivot);

        return this.set(x * cos - y * sin + pivot.x, x * sin + y * cos + pivot.y);
    }

    copy(vector: Vector2) {
        return this.set(vector.x, vector.y);
    }

    equals(vector: Vector2) {
        return this.x === vector.x && this.y === vector.y;
    }

    get length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
}
