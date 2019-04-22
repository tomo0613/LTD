import { Vector2 } from '../common/Vector2.js';
export class BaseObject {
    constructor(width, height, x = 0, y = 0) {
        this.width = width;
        this.height = height;
        this.position = new Vector2(x, y);
    }
}
//# sourceMappingURL=BaseObject.js.map