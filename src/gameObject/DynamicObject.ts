import {BaseObject} from './BaseObject.js';
import {Vector2} from '../common/Vector2.js';
import {Field} from './Field.js';

export class DynamicObject extends BaseObject {
    velocity = new Vector2();
    // intersectingObjects: BaseObject[];

    constructor(width: number, height: number, x = 0, y = 0) {
        super(width, height, x, y);
    }

    update(dt: number, blockingFields: Field[]) {
        const {x: positionX, y: positionY} = this.position;
        const {x: velocityX, y: velocityY} = this.velocity;

        if (velocityX) {
            const originX = positionX;

            this.position.x += velocityX * dt;

            if (this.detectIntersection(blockingFields)) {
                this.position.x = originX;
                // this.velocity.x = 0;
                // broadcast collision event
            }
        }

        if (velocityY) {
            const originY = positionY;

            this.position.y += velocityY * dt;

            if (this.detectIntersection(blockingFields)) {
                this.position.y = originY;
                // this.velocity.y = 0;
            }
        }
    }

    detectIntersection(objList: BaseObject[]) {
        for (let len = objList.length, i = 0; i < len; i++) {
            const obj = objList[i];

            if (this.position.x + this.width / 2 > obj.position.x - obj.width / 2
                && this.position.y + this.height / 2 > obj.position.y - obj.height / 2
                && this.position.x - this.width / 2 < obj.position.x + obj.width / 2
                && this.position.y - this.height / 2 < obj.position.y + obj.height / 2) {
                return true;
            }
        }
    }
}
