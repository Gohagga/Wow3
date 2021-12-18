import { Unit } from "w3ts";
import { OrderId } from "w3ts/globals/order";
import { Log } from "../../../Log";
import { IDamageService } from "../../../services/damage/IDamageService";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/Wc3AbilityData";
import { AbilityEvent } from "../../../systems/ability-events/event-models/AbilityEvent";
import { IAbilityEvent } from "../../../systems/ability-events/event-models/IAbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { Coords } from "../../../systems/coord/Coords";
import { AttackType } from "../../../systems/damage/AttackType";
import { DamageType } from "../../../systems/damage/DamageType";
import { IDelayedTargetEffect } from "../../../systems/dummies/interfaces/IDelayedTargetEffect";
import { IDummyAbilityFactory } from "../../../systems/dummies/interfaces/IDummyAbilityFactory";
import { HeroStat } from "../../../systems/hero-stats/HeroStat";
import { IHeroStatService } from "../../../systems/hero-stats/IHeroStatService";
import { CastBar } from "../../../systems/progress-bars/CastBar";
import { CastBarService } from "../../../systems/progress-bars/CastBarService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";
import { HotStreak } from "./HotStreak";

export interface PyroblastConfig extends Wc3AbilityData {
    dummyPyroblast: {
        spellCodeId: string,
        orderId: number
    }
}

export type PyroblastUnitData = {
    Damage: number
    CastTime: number,
    NonInterruptOrderId: number | null,
}

export class Pyroblast extends AbilityBase implements IUnitConfigurable<PyroblastUnitData> {

    public readonly unitConfig = new UnitConfigurable<PyroblastUnitData>(() => ({
        Damage: 20,
        CastTime: 3.0,
        NonInterruptOrderId: null,
    }));

    projectile: IDelayedTargetEffect<null>;

    constructor(
        data: PyroblastConfig,
        abilityEventHandler: IAbilityEventHandler,
        dummyAbilityFactory: IDummyAbilityFactory,
        private readonly hotStreak: HotStreak,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
        private readonly castBarService: CastBarService,
    ) {
        super(data);
        abilityEventHandler.OnAbilityEffect(this.id, e => this.Execute(e));
        let dummySpell = FourCC(data.dummyPyroblast.spellCodeId);
        this.projectile = dummyAbilityFactory.CreateDelayedTargetEffect<null>(dummySpell, data.dummyPyroblast.orderId);
    }

    Execute(e: IAbilityEvent): boolean {
        
        print("PYRO")
        let caster = e.caster;
        if (!e.targetUnit) return false;
        let target = e.targetUnit;

        let data = this.GetUnitConfig(caster);
        let int = this.statService.GetStat(caster, HeroStat.Int);

        // If we're already casting this spell, don't cast another
        print("Casting spell", this.castBarService.GetCurrentlyCastingSpell(caster));

        let onLaunch = () => {
            caster.queueAnimation("spell");
            this.projectile.Cast(Coords.fromUnit(caster), target, 1, null, () => {
                this.damageService.UnitDamageTarget(caster, target, int + data.Damage, AttackType.Spell, DamageType.Fire);
            });
        }

        // Insta cast with hotstreak
        if (this.hotStreak.Consume(caster)) {
            caster.issueImmediateOrder(OrderId.Stop);
            onLaunch();
            return true;
        }

        // Try queueing this spell, if yes stop here
        if (this.castBarService.TryToQueue(caster, this.orderId, 'target', target)) return false;
        if (this.castBarService.GetCurrentlyCastingSpell(caster) == this.id) return false;

        // Start casting the spell
        this.castBarService.CreateCastBar(caster, this.id, data.CastTime, bar => {
            onLaunch();
        }).OnInterrupt((bar, orderId) => {

            if (orderId == this.orderId ||
                orderId == data.NonInterruptOrderId) return 'ignore';
                
            caster.issueImmediateOrder(OrderId.Stop);
            return 'destroyCastBar';
        });
        
        return true;
    }

    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (config: PyroblastUnitData) => void): void {
        this.unitConfig.UpdateUnitConfig(unit, cb);
        this.UpdateUnitSkill(unit);
    }

    UpdateUnitSkill(unit: Unit) {
        const data = this.unitConfig.GetUnitConfig(unit);
        const int = this.statService.GetStat(unit, HeroStat.Int);
        const dmg = string.format("%.2f", data.Damage + int);
        
        let tooltip = 
`Inflicts ${dmg} Fire damage to the last targeted enemy.

|cffffd9b3Cooldown ${0}s|r`

        this.UpdateUnitAbilityBase(unit, tooltip);
    }
}