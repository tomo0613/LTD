export class AnimationClip {
    constructor(animationFrames, animationSpeed = 60) {
        this.startTime = performance.now();
        this.currentFrameIndex = 0;
        this.paused = false;
        this.frames = animationFrames;
        this.speed = animationSpeed;
    }
    setFrames(animationFrames) {
        this.frames = animationFrames;
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
    play() {
        this.paused = false;
        this.startTime = performance.now();
    }
}
//# sourceMappingURL=animation.js.map