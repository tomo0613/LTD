import {EventObserver} from './common/EventObserver.js';

const changeObserver = new EventObserver();
const activeCommands: Set<string> = new Set();
const browserNavigationKeys = new Set([
    ' ',
    'Home', 'End',
    'PageUp', 'PageDown',
    'ArrowUp', 'ArrowRight', 'ArrowLeft', 'ArrowDown',
]);
const controls = {
    W: 'moveUp',
    S: 'moveDown',
    A: 'moveRight',
    D: 'moveLeft',
    CONTROL: 'attack',

    L: 'log', // rm
    P: 'pause',
};

window.onkeydown = window.onkeyup = ({key, type, repeat, preventDefault}) => {
    // prevent page scrolling
    if (browserNavigationKeys.has(key)) {
        preventDefault();
    }

    const command = controls[key.toUpperCase()];

    if (!command || type === 'keydown' && repeat) {
        return;
    }

    if (type === 'keydown') {
        activeCommands.add(command);
    } else {
        activeCommands.delete(command);
    }

    changeObserver.broadcast(activeCommands);
};

export default changeObserver;
