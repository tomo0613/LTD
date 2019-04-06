// Advance the simulation by this amount of time (ms) in every step
const simulationStep = 1 / 60;
// Count of maximum allowed simulations between each render
const simulationLimit = 120;

let prevTimeStamp = performance.now();
let simulationDepth = 0;
let simulationCount: number;
let paused = true;

let updateWorld: (dt: number) => void = () => {};
let drawScene: () => void = () => {};

export type GameLoop = typeof gameLoop;

export const gameLoop = {
    init(_drawScene: typeof drawScene, _updateWorld: typeof updateWorld) {
        updateWorld = _updateWorld;
        drawScene = _drawScene;
    },
    start() {
        paused = false;
        tick();
    },
    pause() {
        paused = true;
    },
};

function simulate(elapsedTime: number) {
    simulationCount = 0;
    simulationDepth += elapsedTime;

    while (simulationDepth > simulationStep) {
        updateWorld(simulationStep);
        simulationDepth -= simulationStep;

        if (++simulationCount >= simulationLimit) {
            simulationDepth = 0;
            break;
        }
    }
}

function tick(timeStamp = performance.now()) {
    if (paused) {
        return;
    }
    simulate((timeStamp - prevTimeStamp) / 1000);
    drawScene();

    prevTimeStamp = timeStamp;

    requestAnimationFrame(tick);
}
