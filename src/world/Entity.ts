import inputChangeObserver from '../inputHandler.js';
import {Vector2} from '../common/Vector2.js';

export class Entity {
    public position = new Vector2();
    public velocity = new Vector2();
    public width: number;
    public height: number;
    public movementSpeed = 100;

    constructor(x: number, y: number) {
        this.position.set(x, y);

        inputChangeObserver.subscribe(this.applyControls);
    }

    applyControls = (commands: Set<string>) => {
        this.velocity.set(
            commands.has('moveRight') ? -1 : commands.has('moveLeft') ? 1 : 0,
            commands.has('moveUp') ? -1 : commands.has('moveDown') ? 1 : 0,
        ).normalize().scale(this.movementSpeed);
    }

    move(dt: number) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }
}

// Static / Dynamic (interact)
//           Creature
// https://www.youtube.com/watch?v=EHlaJvQpW3U
// https://www.youtube.com/watch?v=oJvJZNyW_rw
