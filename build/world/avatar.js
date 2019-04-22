import inputChangeObserver from '../inputHandler.js';
import { Vector2 } from '../common/Vector2.js';
import { Entity, State } from '../gameObject/Entity.js';
import { parseSpriteSheet } from '../utilities/spriteSheetParser.js';
export function createAvatar(avatarImg) {
    const avatarAnimations = parseSpriteSheet(avatarImg, avatarImg.width / 6, avatarImg.height / 3, spriteSheet => ({
        idle: spriteSheet.to(0, 3).get(),
        walk: spriteSheet.from(1, 0).to(1, 5).get(),
        attack: spriteSheet.from(2, 0).to(2, 3).get(),
    }), { scale: 2 });
    const avatar = new Entity(36, 66, 256, 256, avatarAnimations);
    inputChangeObserver.subscribe(handleControls);
    avatar.animation.setSpeed(220).setCenterOffset(-12, -5).play('idle');
    return avatar;
    function handleControls(commands) {
        avatar.velocity.set(commands.has('moveRight') ? -1 : commands.has('moveLeft') ? 1 : 0, commands.has('moveUp') ? -1 : commands.has('moveDown') ? 1 : 0).normalize().scale(avatar.movementSpeed);
        if (avatar.velocity.equals(Vector2.ZERO) && avatar.state !== State.Idle) {
            avatar.state = State.Idle;
            avatar.animation.setClip('idle');
        }
        else if (avatar.state !== State.Walk) {
            avatar.state = State.Walk;
            avatar.animation.setClip('walk');
        }
        if (commands.has('attack')) {
            avatar.state = State.Attack;
            avatar.animation.play('attack');
        }
    }
}
//# sourceMappingURL=avatar.js.map