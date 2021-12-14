import { Trigger, Unit } from "w3ts";

export class LastTargetService {

    private readonly instances: Record<number, Unit | null> = {};

    constructor() {
        
        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_UNIT_ORDER)
        t.addAction(() => {
            this.Set(Unit.fromHandle(GetOrderedUnit()), Unit.fromHandle(GetOrderTargetUnit()));
        })
    }

    Set(unit: Unit, target: Unit) {
        this.instances[unit.id] = target;
    }

    Get(unit: Unit) {
        return this.instances[unit.id];
    }
}