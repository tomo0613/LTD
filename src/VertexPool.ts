import {Vector2} from './common/Vector2.js';

export class VertexPool {
    vertices: Vector2[];
    index = 0;

    constructor(initialVertexCount = 0) {
        this.vertices = Array.from({length: initialVertexCount}).map(_ => new Vector2());
    }

    obtain({x, y}: Vector2) {
        let vertex: Vector2;

        if (this.index > this.vertices.length - 1) {
            vertex = new Vector2(x, y);

            this.vertices.push(vertex);
        } else {
            vertex = this.vertices[this.index].set(x, y);
        }

        this.index++;

        return vertex;
    }

    reset() {
        this.index = 0;
    }
}
