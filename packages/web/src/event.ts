type Callback<T> = (payload: T) => void;

export class Event<T> {
  events = new Set<Callback<T>>();
  emit(payload?: T) {
    this.events.forEach((cb) => cb(payload as T));
  }
  subscribe(cb: Callback<T>) {
    this.events.add(cb);
    return () => {
      this.events.delete(cb);
    };
  }
}
