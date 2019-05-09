import inputChangeObserver from '../inputHandler.js';
import { Vector2 } from '../common/Vector2.js';
import { Entity, State } from '../gameObject/Entity.js';
import { parseSpriteSheet } from '../utilities/spriteSheetParser.js';
import { projectilePool, projectileAnimations } from './projectiles.js';
export function createAvatar(avatarImg) {
    const avatarAnimations = parseSpriteSheet(avatarImg, 32, 32, spriteSheet => ({
        idle: spriteSheet.to(0, 1).get(),
        walk: spriteSheet.from(1, 0).to(1, 3).get(),
        attack: spriteSheet.from(2, 0).to(2, 3).get(),
    }), { scale: 2 });
    const avatar = new Entity(30, 60, 256, 256);
    avatar.graphics.init(avatarAnimations).setSpeed(250).setCenterOffset(-14, -4).play('idle');
    inputChangeObserver.subscribe(handleControls);
    return avatar;
    function handleControls(commands) {
        avatar.velocity.set(commands.has('moveRight') ? -1 : commands.has('moveLeft') ? 1 : 0, commands.has('moveUp') ? -1 : commands.has('moveDown') ? 1 : 0).normalize().scale(avatar.movementSpeed);
        if (avatar.velocity.equals(Vector2.ZERO) && avatar.state !== State.Idle) {
            avatar.state = State.Idle;
            avatar.graphics.setClip('idle');
        }
        else if (avatar.state !== State.Walk) {
            avatar.state = State.Walk;
            avatar.graphics.setClip('walk');
        }
        if (commands.has('attack')) {
            avatar.state = State.Attack;
            avatar.graphics.play('attack');
            fireProjectile();
        }
        // ToDo charge + fire projectile
    }
    function fireProjectile() {
        const projectileIndex = projectilePool.activeCount;
        const projectile = projectilePool.obtain();
        // set prototype
        projectile.width = projectile.height = 40;
        projectile.position.copy(avatar.position);
        projectile.velocity.set(100, 0); // direction
        projectile.graphics.init(projectileAnimations.fireBall).setCenterOffset(-12, -16).setClip('fly');
        projectile.intersectionObserver.subscribe(projectileIntersectionHandler);
        function projectileIntersectionHandler(intersectingObjects) {
            projectile.intersectionObserver.unsubscribe(projectileIntersectionHandler);
            projectilePool.release(projectile);
            console.log('hit --- release ', projectileIndex);
        }
    }
}
//# sourceMappingURL=avatar.js.map