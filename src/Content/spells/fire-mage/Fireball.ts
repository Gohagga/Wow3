import { Unit } from "w3ts";
import { Log } from "../../../Log";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/Wc3AbilityData";
import { AbilityEvent } from "../../../systems/ability-events/event-models/AbilityEvent";
import { IAbilityEvent } from "../../../systems/ability-events/event-models/IAbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { Coords } from "../../../systems/coord/Coords";
import { IDelayedTargetEffect } from "../../../systems/dummies/interfaces/IDelayedTargetEffect";
import { IDummyAbilityFactory } from "../../../systems/dummies/interfaces/IDummyAbilityFactory";
import { SpellcastingService } from "../../../systems/progress-bars/SpellcastingService";

export interface FireballConfig extends Wc3AbilityData {
    dummyFireball: {
        spellCodeId: string,
        orderId: number
    }
}

type FireballContext = {
    caster: Unit,
    target: Unit,
}

export class Fireball extends AbilityBase {

    UpdateUnitSkill(unit: Unit): void {
        // throw new Error("Method not implemented.");
    }
    
    private readonly projectile: IDelayedTargetEffect<FireballContext>;

    constructor(
        config: FireballConfig,
        dummyAbilityFactory: IDummyAbilityFactory,
        private readonly abilityEvent: IAbilityEventHandler,
        private readonly spellcastingService: SpellcastingService
    ) {
        super(config);
        abilityEvent.OnAbilityCast(this.id, (e) => this.Execute(e));

        this.projectile = dummyAbilityFactory.CreateDelayedTargetEffect<FireballContext>(FourCC(config.dummyFireball.spellCodeId), config.dummyFireball.orderId);
    }

    Execute(e: IAbilityEvent): boolean {

        let caster = e.caster;
        let target = e.targetUnit;
        if (!target) return false;

        if (this.spellcastingService.TryQueueOrder(caster, this.orderId, 'target', target)) return false;

        let context: FireballContext = { caster, target };
        let cb = this.spellcastingService.CastSpell(caster, this.id, 2.5, () => {

            this.projectile.Cast(Coords.fromUnit(caster), context.target, 1, context, (context) => this.OnHit(context));
        });

        return true;
    }

    OnHit({ caster, target }: FireballContext): void {
        // Log.Info("Fireball hit, cast by", caster.name, "at", target.name);
    }
}