export class EventObserver {
    constructor() {
        this.observers = new Set();
    }
    subscribe(observer) {
        this.observers.add(observer);
    }
    unsubscribe(observer) {
        this.observers.delete(observer);
    }
    broadcast(...args) {
        this.observers.forEach(observer => observer(...args));
    }
}
//# sourceMappingURL=EventObserver.js.map