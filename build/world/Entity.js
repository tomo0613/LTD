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
// https://opengameart.org/content/pixel-character-0
// https://opengameart.org/content/low-poly-hooded-character-rigged-blender
// https://opengameart.org/art-search?keys=character&page=50
// https://www.artstation.com/artwork/y5LeR 128x64
// >>> myImg = gimp.image_list()[0]
// >>> myImg
// <gimp.Image 'skeletonwarrior.xcf'>
// >>> for l in myImg.layers:
// ... 	pdb.gimp_selection_none(myImg)
// ... 	pdb.gimp_context_set_sample_threshold_int(0)
// ... 	pdb.gimp_image_select_color(myImg, 0, l, '#5c5c5c')
// ... 	pdb.gimp_edit_clear(l)
// ... 
// >>> for l in myImg.layers:
// ... 	pdb.gimp_layer_resize_to_image_size(l)
// ... 
// https://www.artstation.com/artwork/ygzPn
//# sourceMappingURL=Entity.js.map