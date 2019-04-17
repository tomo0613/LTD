import inputChangeObserver from '../inputHandler.js';
import { Vector2 } from '../common/Vector2.js';
import { AnimationHandler } from './AnimationHandler.js';
export class Entity {
    constructor(x, y, animationClips) {
        this.position = new Vector2();
        this.velocity = new Vector2();
        this.movementSpeed = 200;
        this.applyControls = (commands) => {
            this.velocity.set(commands.has('moveRight') ? -1 : commands.has('moveLeft') ? 1 : 0, commands.has('moveUp') ? -1 : commands.has('moveDown') ? 1 : 0).normalize().scale(this.movementSpeed);
        };
        this.position.set(x, y);
        this.animation = new AnimationHandler(animationClips);
        inputChangeObserver.subscribe(this.applyControls);
    }
    update(dt) {
        // ToDo collision
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }
}
//# sourceMappingURL=Entity.js.map