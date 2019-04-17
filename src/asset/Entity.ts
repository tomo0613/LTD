import inputChangeObserver from '../inputHandler.js';
import {Vector2} from '../common/Vector2.js';
import {AnimationHandler, AnimationClips} from './AnimationHandler.js';

export class Entity {
    public position = new Vector2();
    public velocity = new Vector2();
    public width: number;
    public height: number;
    public movementSpeed = 200;
    public animation: AnimationHandler;

    constructor(x: number, y: number, animationClips: AnimationClips) {
        this.position.set(x, y);
        this.animation = new AnimationHandler(animationClips);

        inputChangeObserver.subscribe(this.applyControls);
    }

    applyControls = (commands: Set<string>) => {
        this.velocity.set(
            commands.has('moveRight') ? -1 : commands.has('moveLeft') ? 1 : 0,
            commands.has('moveUp') ? -1 : commands.has('moveDown') ? 1 : 0,
        ).normalize().scale(this.movementSpeed);
    }

    update(dt: number) {
        // ToDo collision
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }
}
