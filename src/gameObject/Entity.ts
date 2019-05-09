import {DynamicObject} from './DynamicObject.js';

export enum State {
    Idle,
    Walk,
    Run,
    Attack,
    Die,
}

export class Entity extends DynamicObject {
    movementSpeed = 200;
    state: State;

    constructor(width: number, height: number, x: number, y: number) {
        super(width, height, x, y);
    }
}
