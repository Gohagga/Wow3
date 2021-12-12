import { Unit } from "w3ts";
import { Log } from "../../../Log";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/AbilityConfig";
import { AbilityEvent } from "../../../systems/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { Coords } from "../../../systems/coord/Coords";
import { IDelayedTargetEffect } from "../../../systems/dummies/interfaces/IDelayedTargetEffect";
import { IDummyAbilityFactory } from "../../../systems/dummies/interfaces/IDummyAbilityFactory";

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
    UpdateUnitAbility(unit: Unit): void {
        throw new Error("Method not implemented.");
    }
    
    private readonly projectile: IDelayedTargetEffect<FireballContext>;

    constructor(
        config: FireballConfig,
        dummyAbilityFactory: IDummyAbilityFactory,
        private readonly abilityEvent: IAbilityEventHandler,
    ) {
        super(config);
        abilityEvent.OnAbilityEffect(this.id, (e) => this.Execute(e));

        this.projectile = dummyAbilityFactory.CreateDelayedTargetEffect<FireballContext>(FourCC(config.dummyFireball.spellCodeId), config.dummyFireball.orderId);
    }

    Execute(e: AbilityEvent): boolean {

        print("Fireball cast")

        let caster = e.caster;
        let target = e.targetUnit;
        if (!target) return false;

        let context: FireballContext = { caster, target };
        this.projectile.Cast(Coords.fromUnit(caster), target, 1, context, (context) => this.OnHit(context));
        print("Projectile cast");
        return true;
    }

    OnHit({ caster, target }: FireballContext): void {
        Log.Info("Fireball hit, cast by", caster.name, "at", target.name);
    }
}