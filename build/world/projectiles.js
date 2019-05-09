import { DynamicObject } from '../gameObject/DynamicObject.js';
import { parseSpriteSheet } from '../utilities/spriteSheetParser.js';
export const projectilePool = (function (poolSize = 10) {
    const projectiles = Array.from({ length: poolSize }).map(_ => new DynamicObject(0, 0));
    let activeCount = 0;
    return {
        obtain,
        release,
        items: projectiles,
        get activeCount() {
            return activeCount;
        },
    };
    function obtain() {
        // ToDo if index > activeCount & handle max count
        const firstInactive = projectiles[activeCount];
        activeCount++;
        return firstInactive;
    }
    function release(projectile) {
        activeCount--;
        const index = projectiles.indexOf(projectile);
        const lastActive = projectiles[activeCount];
        projectiles[activeCount] = projectiles[index];
        projectiles[index] = lastActive;
    }
})();
export const projectileAnimations = {
    // arrow: undefined,
    fireBall: undefined,
};
export function setProjectileGraphics(projectileImages) {
    Object.keys(projectileImages).forEach((key) => {
        projectileAnimations[key] = parseGraphics(projectileImages, key);
    });
}
function parseGraphics(projectileImages, key) {
    const img = projectileImages[key];
    switch (key) {
        case 'fireBall':
            return parseSpriteSheet(img, img.width / 4, img.height, spriteSheet => ({
                fly: spriteSheet.to(0, 3).get(),
            }));
    }
}
//# sourceMappingURL=projectiles.js.map