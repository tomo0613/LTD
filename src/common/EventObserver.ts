export class EventObserver {
    private observers: Set<Function> = new Set();

    subscribe(observer: Function) {
        this.observers.add(observer);
    }

    unsubscribe(observer: Function) {
        this.observers.delete(observer);
    }

    broadcast(...args: any) {
        this.observers.forEach(observer => observer(...args));
    }
}
