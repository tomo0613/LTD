type AnimationFrames = HTMLImageElement[]|HTMLCanvasElement[];

export type Animations = Record<string, AnimationFrames>;

export class GraphicsComponent {
    paused = false;
    speed = 60;
    horizontalCenterOffset = 0;
    verticalCenterOffset = 0;
    private startTime = performance.now();
    private currentFrameIndex = 0;
    private clips: Animations;
    private frames: AnimationFrames;

    constructor(animationClips?: Animations) {
        if (animationClips) {
            this.init(animationClips);
        }
    }

    init(animationClips: Animations) {
        this.clips = animationClips;

        return this;
    }

    setClip(clipId: string) {
        this.frames = this.clips[clipId];

        return this;
    }

    setSpeed(animationSpeed: number) {
        this.speed = animationSpeed;

        return this;
    }

    setCenterOffset(horizontal = 0, vertical = 0) {
        this.horizontalCenterOffset = horizontal;
        this.verticalCenterOffset = vertical;

        return this;
    }

    getNextFrame() {
        this.currentFrameIndex = this.frames.length > 1 ? this.getNextFrameIndex() : 0;

        return this.frames[this.currentFrameIndex];
    }

    getNextFrameIndex() {
        if (this.paused) {
            return this.currentFrameIndex;
        }
        return Math.floor((performance.now() - this.startTime) / this.speed % this.frames.length);
    }

    stop() {
        this.paused = true;
    }

    play(clipId?: string) {
        if (clipId) {
            this.setClip(clipId);
        }
        this.paused = false;
        this.startTime = performance.now();
    }
}
// convert -coalesce anim.gif anim%02d.png
//
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
