import { Unit } from "w3ts";
import { DelayedTargetEffect } from "./dummy-effects/DelayedTargetEffect";
import { IDelayedTargetEffect as IDelayedTargetEffect } from "./interfaces/IDelayedTargetEffect";
import { IDummyAbilityFactory, TargetType } from "./interfaces/IDummyAbilityFactory";
import { IDummyUnitManager } from "./interfaces/IDummyUnitManager";

export class DummyAbilityFactory implements IDummyAbilityFactory {

    constructor(
        private readonly dummyUnitManager: IDummyUnitManager
    ) {

    }

    CreateDelayedTargetEffect<ContextType>(dummyAbilityId: number, orderId: number, duration?: number): IDelayedTargetEffect<ContextType> {
        
        let effect = new DelayedTargetEffect<ContextType>(this.dummyUnitManager, dummyAbilityId, orderId, duration);
        return effect;
    }

    CreateDelayedPointEffect(dummySpellId: number, order: number, timeout?: number): number {
        throw new Error("Method not implemented.");
    }

    CreateDelayedInstantEffect(dummySpellId: number, order: number, timeout?: number): number {
        throw new Error("Method not implemented.");
    }
}

