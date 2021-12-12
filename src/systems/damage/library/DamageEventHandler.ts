import { Log } from "../../../Log";
import { Unit } from "w3ts/handles/unit";
import { DamageEvent } from "../DamageEvent";
import { DamageEventSubscription } from "./DamageEventSubscription";
import { IDamageEventHandler } from "./IDamageEventHandler";

export class DamageEventHandler<ActionOrder> implements IDamageEventHandler<ActionOrder, DamageEvent> {

    private handles: DamageEventSubscription<DamageEvent>[] = [];

    Subscribe(type: ActionOrder, callback: (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => void): DamageEventSubscription<DamageEvent>;
    Subscribe(type: ActionOrder, callback: (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => void, filter: { source?: Unit, target?: Unit }): DamageEventSubscription<DamageEvent>;
    Subscribe(type: ActionOrder, callback: (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => void, filter?: { source?: Unit, target?: Unit }): DamageEventSubscription<DamageEvent> {
        
        let newSubscription: DamageEventSubscription<DamageEvent>;
        // If filter exists, apply the thing
        if (filter && filter.source && filter.target) {
            let src = filter.source.handle;
            let targ = filter.target.handle;
            newSubscription = new DamageEventSubscription<DamageEvent>(Number(type), (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => {
                if (filter.source && filter.source.handle == GetEventDamageSource() && filter.target && filter.target.handle == BlzGetEventDamageTarget())
                    return callback(e, sub);
                return true;
            });
        } else if (filter && filter.source) {
            Log.Info("Source filter");
            let src = filter.source.handle;
            newSubscription = new DamageEventSubscription<DamageEvent>(Number(type), (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => {
                if (src == e.source.handle)
                    return callback(e, sub);
                return true;
            });
        } else if (filter && filter.target) {
            let targ = filter.target.handle;
            newSubscription = new DamageEventSubscription<DamageEvent>(Number(type), (e: DamageEvent, sub: DamageEventSubscription<DamageEvent>) => {
                if (targ == e.targetUnit.handle)
                    return callback(e, sub);
                return true;
            });
        } else {
            // If filter doesn't exist, just register the callback directly
            newSubscription = new DamageEventSubscription<DamageEvent>(Number(type), callback);
        }

        // Insert the damage action into the action list
        this.handles.push(newSubscription);

        // Sort the damage actions based on priority
        this.handles = this.handles.sort((a, b) => a.priority - b.priority);

        return newSubscription;
    }
    
    Register(event: DamageEvent): DamageEvent {
        
        if (!this.handles || this.handles.length == 0) return event;
        let remaining: DamageEventSubscription<DamageEvent>[] = [];

        for (let sub of this.handles) {

            // Execute the callback.
            if (sub.alive) {
                sub.callback(event, sub);
                remaining.push(sub);
            }
        }

        // If someone modified the event, reflect those changes in the game
        BlzSetEventDamage(event.damage);
        // BlzSetEventDamageType()
        // BlzSetEventAttackType()

        // Save the remaining to this._subscriptions
        this.handles = remaining;
        return event;
    }
}