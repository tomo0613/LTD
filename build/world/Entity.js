import inputChangeObserver from '../inputHandler.js';
import { Vector2 } from '../common/Vector2.js';
export class Entity {
    constructor(x, y) {
        this.position = new Vector2();
        this.velocity = new Vector2();
        this.movementSpeed = 200;
        this.applyControls = (commands) => {
            this.velocity.set(commands.has('moveRight') ? -1 : commands.has('moveLeft') ? 1 : 0, commands.has('moveUp') ? -1 : commands.has('moveDown') ? 1 : 0).normalize().scale(this.movementSpeed);
        };
        this.position.set(x, y);
        inputChangeObserver.subscribe(this.applyControls);
    }
    move(dt) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }
}
// Static / Dynamic (interact)
//           Creature
// https://www.youtube.com/watch?v=EHlaJvQpW3U
// https://www.youtube.com/watch?v=oJvJZNyW_rw
//# sourceMappingURL=Entity.js.map