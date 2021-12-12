import { Unit } from "w3ts/handles/unit";
import { DamageEventSubscription } from "./DamageEventSubscription";

export interface IDamageEventHandler<ActionOrder, DamageEvent> {

    Subscribe(type: ActionOrder, callback: (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => void): DamageEventSubscription<DamageEvent>;
    Subscribe(type: ActionOrder, callback: (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => void, filter: { source?: Unit, target?: Unit }): DamageEventSubscription<DamageEvent>;

    Register(event: DamageEvent): DamageEvent;
}