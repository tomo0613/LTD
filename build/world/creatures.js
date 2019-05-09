import { parseSpriteSheet } from '../utilities/spriteSheetParser.js';
export const creatureAnimations = {
    skeleton: undefined,
};
export function setCreatureGraphics(creatureImages) {
    Object.keys(creatureImages).forEach((key) => {
        creatureAnimations[key] = parseGraphics(creatureImages, key);
    });
}
function parseGraphics(creatureImages, key) {
    const img = creatureImages[key];
    switch (key) {
        case 'skeleton':
            return parseSpriteSheet(img, 32, 32, spriteSheet => ({
                idle: spriteSheet.get([0, 0]),
                walk: spriteSheet.from(1, 0).to(1, 3).get(),
            }), { scale: 2 });
    }
}
/*
    bhv

    if spot target & far
    - lurking

    if threatened
    - mates nearby ? signal them : flee

    if surprised

    if get hit
    - barely damaged ? rage
    - barely survived ? flee

    if face 2 face & alone
    - try get behind

    if behind
    - attack
*/
//# sourceMappingURL=creatures.js.map