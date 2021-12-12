import { DamageEvent } from "../DamageEvent";

export class DamageEventSubscription<DamageEvent> {
    
    private _priority: number;
    public callback: (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => void;

    public alive = true;
    
    constructor(priority: number, callback: (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => void) {
        this._priority = priority;
        this.callback = (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => callback(e, this);
    }

    Unregister(): void {
        this.alive = false;
    }

    get priority() {
        return this._priority;
    }
    set priority(v: number) {
        this._priority = v;
    }
}