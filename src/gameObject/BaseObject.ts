import {Vector2} from '../common/Vector2.js';

export class BaseObject {
    width: number;
    height: number;
    position: Vector2;

    constructor(width: number, height: number, x = 0, y = 0) {
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
    }
}
