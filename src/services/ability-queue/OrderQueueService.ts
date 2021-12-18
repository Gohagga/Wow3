import { Point, Unit, Widget } from "w3ts";
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
        if (unitId in this.unitQueue && this.unitQueue[unitId].length > 0)
            return this.unitQueue[unitId][0].id == orderId;

        return false;
    }

    QueueOrder(unit: Unit, order: QueuedOrder, override: boolean) {

        const unitId = unit.id;
        if (unitId in this.unitQueue == false || override)
            this.unitQueue[unitId] = [];

        print(order.id, order.type);
        
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

    ResolveQueuedOrder(unit: Unit): boolean {

        const unitId = unit.id;
        print("Resolving queued order for", unit.name);
        if (unitId in this.unitQueue) {

            print("Unit has a q");
            print(this.unitQueue[unitId].length, "orders queued");
            let order = this.unitQueue[unitId].pop();
            if (order) {
                print("order", order.id, order.type, order.targetWidget && GetObjectName(order.targetWidget.id));
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