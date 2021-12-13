export type InterruptableCondition = (orderId: number) => boolean

export class InterruptableService {
    
    private instance: Record<number, InterruptableCondition[]> = {}

    private lock: boolean = false;

    constructor() {
        const t = CreateTrigger();
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_ORDER);
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
        TriggerAddAction(t, () => {

            if (this.lock) return;

            const unit = GetTriggerUnit();
            const unitId = GetHandleId(unit);
            if (!(unitId !in this.instance)) return;
            const instance = this.instance[unitId];
            let remaining: InterruptableCondition[] = [];
            let order = GetIssuedOrderId();

            if (instance.length > 0) {
                // I think this is learning abilities order ids
                if ((order+'').substr(0, 6) == "109367") return;
            }

            for (let i = 0; i < instance.length; i++) {

                this.lock = true;
                if (instance[i](GetIssuedOrderId())) {
                    remaining.push(instance[i]);
                }
                this.lock = false;
            }
            this.instance[unitId] = remaining;
        })
    }

    public WithinLock(action: () => void) {
        this.lock = true;
        action();
        this.lock = false;
    }

    public Register(unit: unit, condition: InterruptableCondition) {
        
        const unitId = GetHandleId(unit);
        if (!(unitId in this.instance)) {
            this.instance[unitId] = [];
        }
        this.instance[unitId].push(condition);
    }
}