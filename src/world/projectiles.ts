import {DynamicObject} from '../gameObject/DynamicObject.js';
import {parseSpriteSheet} from '../utilities/spriteSheetParser.js';

export const projectilePool = (function (poolSize = 10) {
    const projectiles = Array.from({length: poolSize}).map(_ => new DynamicObject(0, 0));

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

    function release(projectile: DynamicObject) {
        activeCount--;

        const index = projectiles.indexOf(projectile);
        const lastActive = projectiles[activeCount];
        projectiles[activeCount] = projectiles[index];
        projectiles[index] = lastActive;
    }
})();

type Projectiles = keyof typeof projectileAnimations;

type Animations = Record<string, HTMLCanvasElement[]>;

export const projectileAnimations: Record<string, Animations> = {
    // arrow: undefined,
    fireBall: undefined,
};

export function setProjectileGraphics(projectileImages: Record<Projectiles, HTMLImageElement>) {
    Object.keys(projectileImages).forEach((key: Projectiles) => {
        projectileAnimations[key] = parseGraphics(projectileImages, key);
    });
}

function parseGraphics(projectileImages: Record<Projectiles, HTMLImageElement>, key: Projectiles) {
    const img = projectileImages[key];

    switch (key) {
        case 'fireBall':
            return parseSpriteSheet(img, img.width / 4, img.height, spriteSheet => ({
                fly: spriteSheet.to(0, 3).get(),
            }));
    }
}
