import {DynamicObject} from './DynamicObject.js';
import {AnimationHandler, Animations} from './AnimationHandler.js';

export enum State {
    Idle,
    Walk,
    Run,
    Attack,
    Die,
}

export class Entity extends DynamicObject {
    movementSpeed = 200;
    animation: AnimationHandler;
    state: State;

    constructor(width: number, height: number, x: number, y: number, graphics: Animations) {
        super(width, height, x, y);

        this.animation = new AnimationHandler(graphics);
    }
}
