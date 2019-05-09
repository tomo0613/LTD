import {parseSpriteSheet} from '../utilities/spriteSheetParser.js';

type Creatures = keyof typeof creatureAnimations;

type Animations = Record<string, HTMLCanvasElement[]>;

export const creatureAnimations: Record<string, Animations> = {
    skeleton: undefined,
};

export function setCreatureGraphics(creatureImages: Record<Creatures, HTMLImageElement>) {
    Object.keys(creatureImages).forEach((key: Creatures) => {
        creatureAnimations[key] = parseGraphics(creatureImages, key);
    });
}

function parseGraphics(creatureImages: Record<Creatures, HTMLImageElement>, key: Creatures) {
    const img = creatureImages[key];

    switch (key) {
        case 'skeleton':
            return parseSpriteSheet(img, 32, 32, spriteSheet => ({
                idle: spriteSheet.get([0, 0]),
                walk: spriteSheet.from(1, 0).to(1, 3).get(),
                // run: spriteSheet.from().to().get(),
                // attack: spriteSheet.from().to().get(),
            }), {scale: 2});
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
