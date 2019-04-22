export class AnimationHandler {
    constructor(animationClips) {
        this.paused = false;
        this.speed = 60;
        this.horizontalCenterOffset = 0;
        this.verticalCenterOffset = 0;
        this.startTime = performance.now();
        this.currentFrameIndex = 0;
        this.clips = animationClips;
    }
    setClip(clipId) {
        this.frames = this.clips[clipId];
        return this;
    }
    setSpeed(animationSpeed) {
        this.speed = animationSpeed;
        return this;
    }
    setCenterOffset(horizontal = 0, vertical = 0) {
        this.horizontalCenterOffset = horizontal;
        this.verticalCenterOffset = vertical;
        return this;
    }
    getNextFrame() {
        this.currentFrameIndex = this.getNextFrameIndex();
        return this.frames[this.currentFrameIndex];
    }
    getNextFrameIndex() {
        if (this.frames.length === 1 || this.paused) {
            return this.currentFrameIndex;
        }
        return Math.floor((performance.now() - this.startTime) / this.speed % this.frames.length);
    }
    stop() {
        this.paused = true;
    }
    play(clipId) {
        if (clipId) {
            this.setClip(clipId);
        }
        this.paused = false;
        this.startTime = performance.now();
    }
}
// Static / Dynamic (interact)
//           Creature
// >>> myImg = gimp.image_list()[0]
// >>> for l in myImg.layers:
// ... 	pdb.gimp_selection_none(myImg)
// ... 	pdb.gimp_context_set_sample_threshold_int(0)
// ... 	pdb.gimp_image_select_color(myImg, 0, l, '#5c5c5c')
// ... 	pdb.gimp_edit_clear(l)
// ...
// >>> for l in myImg.layers:
// ... 	pdb.gimp_layer_resize_to_image_size(l)
// ...
//# sourceMappingURL=AnimationHandler.js.map