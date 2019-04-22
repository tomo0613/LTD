import { DynamicObject } from './DynamicObject.js';
import { AnimationHandler } from './AnimationHandler.js';
export var State;
(function (State) {
    State[State["Idle"] = 0] = "Idle";
    State[State["Walk"] = 1] = "Walk";
    State[State["Run"] = 2] = "Run";
    State[State["Attack"] = 3] = "Attack";
    State[State["Die"] = 4] = "Die";
})(State || (State = {}));
export class Entity extends DynamicObject {
    constructor(width, height, x, y, graphics) {
        super(width, height, x, y);
        this.movementSpeed = 200;
        this.animation = new AnimationHandler(graphics);
    }
}
//# sourceMappingURL=Entity.js.map