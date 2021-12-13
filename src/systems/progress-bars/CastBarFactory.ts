import { Point, Unit, Widget } from "w3ts"
import { OrderId } from "w3ts/globals/order";
import { OrderQueueService, QueuedOrder } from "../../services/ability-queue/OrderQueueService";
import { InterruptableService } from "../interruptable/InterruptableService";
import { CastBar } from "./CastBar"

export interface CastBarServiceConfig {
    model: string,
    updatePeriod: number,
    size: number,
    defaultHeight: number,
    queueTreshold: number;
}

export class CastBarService {
    
    private readonly castBars: Record<number, CastBar> = {};

    private readonly sfxModelPath: string;
    private readonly updatePeriod: number;
    private readonly castBarSize: number;
    private readonly defaultHeight: number;
    private readonly queueTreshold: number;

    constructor(
        config: CastBarServiceConfig,
        private readonly interruptableService: InterruptableService,
        private readonly orderQueueService: OrderQueueService,
    ) {
        this.sfxModelPath = config.model;
        this.updatePeriod = config.updatePeriod;
        this.castBarSize = config.size;
        this.defaultHeight = config.defaultHeight;
        this.queueTreshold = config.queueTreshold;
    }

    GetCurrentlyCastingSpell(caster: Unit) {
        const casterId = caster.id;
        if (casterId in this.castBars && this.castBars[casterId]) {
            return this.castBars[casterId].spellId;
        }
        return -1;
    }

    TryToQueue(caster: Unit, orderId: number, type: 'target' | 'point' | 'immediate', targetWidget?: Widget, targetPoint?: Point): boolean {
        
        let casterId = caster.id;

        if (casterId in this.castBars && this.castBars[casterId] && this.castBars[casterId].RemainingTime() < this.queueTreshold) {
            print("Queueing spell...")
            let order: QueuedOrder = {
                id: orderId,
                type,
                targetPoint,
                targetWidget
            };
            this.orderQueueService.QueueOrder(caster, order, true);
            return true;
        }

        return false;
    }

    CreateCastBar(unit: Unit, spellId: number, castTime: number, afterFinish: (bar: CastBar) => void) {
        let castBar = new CastBar(unit, this.sfxModelPath, this.updatePeriod, this.castBarSize, spellId, this.defaultHeight);
        let unitId = unit.id;
        this.castBars[unitId] = castBar;
        castBar.CastSpell(spellId, castTime, bar => {
            bar.Finish();
            if (this.castBars[unitId] == castBar) delete this.castBars[unitId];
            afterFinish(bar);
            if (this.orderQueueService.ResolveQueuedOrder(unit)) {
                return;
            }
            unit.issueImmediateOrder(OrderId.Stop);
        });

        return {
            OnInterrupt: (action: (castBar: CastBar, orderId: number) => 'finishCastBar' | 'destroyCastBar' | 'ignore') => this.OnInterrupt(castBar, unit, action)
        }
    }

    /**
     * 
     * @param action return false to interrupt the cast
     */
    public OnInterrupt(castBar: CastBar, caster: Unit, action: (castBar: CastBar, orderId: number) => 'finishCastBar' | 'destroyCastBar' | 'ignore') {
        this.interruptableService.Register(caster.handle, orderId => {
            
            let casterId = caster.id;
            let retVal = false;
            this.interruptableService.WithinLock(() => {

                let result = action(castBar, orderId);
                print("interrupt action", result)
                if (result == 'ignore') retVal = true;
                if (result == 'finishCastBar') castBar.Finish();
                if (result == 'destroyCastBar') castBar.Destroy();
                
                retVal = false;
                if (!retVal && this.castBars[casterId] == castBar) delete this.castBars[casterId];
            });

            return retVal;
        });
    }
}