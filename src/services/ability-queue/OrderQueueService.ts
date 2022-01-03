import { Point, Unit, Widget } from "w3ts";
import { OrderId } from "w3ts/globals/order";
import { IAbilityEvent } from "../../systems/ability-events/event-models/IAbilityEvent";

export interface QueuedOrder {
    id: number,
    type: 'target' | 'point' | 'immediate' | 'effect',
    targetWidget?: Widget,
    targetPoint?: Point,
    effect?: () => void,
}

export class OrderQueueService {

    private readonly unitQueue: Record<number, QueuedOrder[]> = {};

    constructor() {
        
    }

    IsOrderQueued(unit: Unit, orderId: number): boolean {
        const unitId = unit.id;
        if (unitId in this.unitQueue) {

            if (this.unitQueue[unitId].length > 0)
            return this.unitQueue[unitId][0].id == orderId;
        }
        return false;
    }

    QueueOrder(unit: Unit, order: QueuedOrder, override: boolean) {

        const unitId = unit.id;
        if (unitId in this.unitQueue == false || override)
            this.unitQueue[unitId] = [];

        this.unitQueue[unitId].push(order);
    }

    QueueIssuedOrder(unit: Unit, override: boolean) {

        let queuedOrder: QueuedOrder;

        // Unit target
        if (GetOrderTargetUnit()) {
            queuedOrder = {
                id: GetIssuedOrderId(),
                type: 'target',
                targetWidget: Widget.fromHandle(GetOrderTargetUnit())
            }
        } else if (GetOrderTargetDestructable()) {
            queuedOrder = {
                id: GetIssuedOrderId(),
                type: 'target',
                targetWidget: Widget.fromHandle(GetOrderTargetDestructable())
            }
        } else if (GetOrderTargetItem()) {
            queuedOrder = {
                id: GetIssuedOrderId(),
                type: 'target',
                targetWidget: Widget.fromHandle(GetOrderTargetItem())
            }
        } else if (GetOrderPointLoc()) {
            queuedOrder = {
                id: GetIssuedOrderId(),
                type: 'point',
                targetPoint: Point.fromHandle(GetSpellTargetLoc())
            }
        } else {
            queuedOrder = {
                id: GetIssuedOrderId(),
                type: 'immediate',
            }
        }
        
        this.QueueOrder(unit, queuedOrder, override);
    }

    GetQueueSize(caster: Unit): number {
        if (caster.id in this.unitQueue == false) return 0;
        return this.unitQueue[caster.id].length;
    }

    ResolveQueuedOrder(unit: Unit): boolean {

        const unitId = unit.id;
        if (unitId in this.unitQueue) {

            let order = this.unitQueue[unitId].pop();
            if (order) {
                unit.issueImmediateOrder(OrderId.Stop);
                switch (order.type) {
                    case "target":
                        if (order.targetWidget) unit.issueTargetOrder(order.id, order.targetWidget);
                        break;
                    case 'point':
                        if (order.targetPoint) unit.issuePointOrder(order.id, order.targetPoint);
                        break;
                    case 'immediate':
                        unit.issueImmediateOrder(order.id);
                        break;
                    case 'effect':
                        if (order.effect) order.effect();
                        break;
                }
                return true;
            }
        }
        return false;
    }
}