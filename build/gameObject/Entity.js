import { DynamicObject } from './DynamicObject.js';
export var State;
(function (State) {
    State[State["Idle"] = 0] = "Idle";
    State[State["Walk"] = 1] = "Walk";
    State[State["Run"] = 2] = "Run";
    State[State["Attack"] = 3] = "Attack";
    State[State["Die"] = 4] = "Die";
})(State || (State = {}));
export class Entity extends DynamicObject {
    constructor(width, height, x, y) {
        super(width, height, x, y);
        this.movementSpeed = 200;
    }
}
//# sourceMappingURL=Entity.js.map