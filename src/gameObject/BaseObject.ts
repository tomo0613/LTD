import {Vector2} from '../common/Vector2.js';
import {GraphicsComponent} from './GraphicsComponent.js';

export class BaseObject {
    width: number;
    height: number;
    position: Vector2;
    graphics = new GraphicsComponent();

    constructor(width: number, height: number, x = 0, y = 0) {
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
    }
}
