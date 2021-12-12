import { Timer } from "w3ts/handles/timer";
import { Trigger } from "w3ts/handles/trigger";
import { Unit } from "w3ts/handles/unit";
import { Coords } from "../../coord/Coords";
import { IDelayedTargetEffect } from "../interfaces/IDelayedTargetEffect";
import { IDummyUnitManager } from "../interfaces/IDummyUnitManager";

export class DelayedTargetEffect<ContextType> implements IDelayedTargetEffect<ContextType> {

    private readonly trigger: Trigger;
    private readonly instances: Record<number, () => void> = {};

    constructor(
        private readonly dummyUnitManager: IDummyUnitManager,
        private readonly abilityId: number,
        private readonly orderId: number,
        private readonly duration?: number,
    ) {
        this.trigger = new Trigger();
        this.trigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        this.trigger.addAction(() => {
            print("d", GetEventDamage());
            let u = Unit.fromHandle(GetEventDamageSource());
            let id = u.id;
            if (id in this.instances) {
                print("target hit", GetEventDamage());
                this.Resolve(u);
            }
        });
    }

    Cast(origin: Coords, target: Unit, level: number, context: ContextType, effect: (context: ContextType) => void): void {
        let dummy = this.dummyUnitManager.GetDummy();
        dummy.x = origin.x;
        dummy.y = origin.y;

        dummy.addAbility(this.abilityId);
        dummy.setAbilityLevel(this.abilityId, level);

        dummy.issueTargetOrder(this.orderId, target);

        this.instances[dummy.id] = () => {
            print("Resolving effect")
            effect(context);
        }

        // If duration is given, start a timer to recycle the dummy
        if (this.duration) {
            new Timer().start(this.duration, false, () => {
                this.dummyUnitManager.RecycleDummy(dummy);
                DestroyTimer(GetExpiredTimer());
            });
        }
    }

    Resolve(source: Unit) {
        print("Recycling unit", source.name)
        this.instances[source.id]();
        if (!this.duration) {
            delete this.instances[source.id];
            this.dummyUnitManager.RecycleDummy(source);
        }
    }
}