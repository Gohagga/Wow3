import { Coords } from "systems/coord/Coords";
import { IDelayedTargetEffect } from "systems/dummies/interfaces/IDelayedTargetEffect";
import { IDummyAbilityFactory } from "systems/dummies/interfaces/IDummyAbilityFactory";
import { Unit } from "w3ts";
import { Log } from "../../../Log";
import { IDamageService } from "../../../services/damage/IDamageService";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/Wc3AbilityData";
import { IAbilityEvent } from "../../../systems/ability-events/event-models/IAbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { AttackType } from "../../../systems/damage/AttackType";
import { DamageType } from "../../../systems/damage/DamageType";
import { HeroStat } from "../../../systems/hero-stats/HeroStat";
import { IHeroStatService } from "../../../systems/hero-stats/IHeroStatService";
import { CastBar } from "../../../systems/progress-bars/CastBar";
import { SpellcastingService } from "../../../systems/progress-bars/SpellcastingService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";
import { NaturalBalance } from "./NaturalBalance";

export interface WrathConfig extends Wc3AbilityData {
    dummyWrath: {
        spellCodeId: string,
        orderId: number
    }
}

type WrathUnitData = {
    Damage: number,
    CastTime: number,
    Radius: number,
    Cost: number,
    Cooldown: number,

    NonInterruptOrderId: number,
}

export class Wrath extends AbilityBase implements IUnitConfigurable<WrathUnitData> {

    public unitConfig = new UnitConfigurable<WrathUnitData>(() => ({
        Damage: 20,
        CastTime: 2.5,
        CleaveRadius: 0,
        Radius: 1000,
        Cost: 13,
        Cooldown: 4.5,

        NonInterruptOrderId: FourCC('AC13')
    }));

    projectile: IDelayedTargetEffect<null>;

    constructor(
        data: WrathConfig,
        abilityEventHandler: IAbilityEventHandler,
        dummyAbilityFactory: IDummyAbilityFactory,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
        private readonly spellcastingService: SpellcastingService,
        private readonly naturalBalance: NaturalBalance,
    ) {
        super(data);
        abilityEventHandler.OnAbilityCast(this.id, e => this.Execute(e));

        this.projectile = dummyAbilityFactory.CreateDelayedTargetEffect(FourCC(data.dummyWrath.spellCodeId), data.dummyWrath.orderId);
    }

    Execute(e: IAbilityEvent): void {
        Log.Info("Cast Wrath");

        let caster = e.caster;
        let target = e.targetUnit;
        let data = this.GetUnitConfig(caster);

        if (!target) return;

        if (this.spellcastingService.TryQueueOrder(caster, this.orderId, 'target', target)) return;
    
        const victim = target;
        this.spellcastingService.CastSpell(caster, this.id, data.CastTime, () => {
            let int = this.statService.GetStat(caster, HeroStat.Int);
            caster.queueAnimation("spell");
            this.projectile.Cast(Coords.fromUnit(caster), victim, 1, null, () => {
                this.damageService.UnitDamageTarget(caster, victim, int + data.Damage, AttackType.Spell, DamageType.Fire);
            });
            this.naturalBalance.SwapToSolar(caster);
        }, (orderId: number, castBar: CastBar) => {
            
            if (orderId != data.NonInterruptOrderId)
                castBar.alive = false;

            if (castBar.isDone)
                return false;
            
            return true;
        });
    }
    
    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (this: void, config: WrathUnitData) => void): void {
        this.unitConfig.UpdateUnitConfig(unit, cb);
        this.UpdateUnitSkill(unit);
    }

    UpdateUnitSkill(unit: Unit) {
        const data = this.unitConfig.GetUnitConfig(unit);
        const int = this.statService.GetStat(unit, HeroStat.Int);
        const dmg = string.format("%.2f", data.Damage + int);
        
        let tooltip = 
`Inflicts ${dmg} Arcane damage to the targeted enemy.

|cffffd9b3Cooldown ${data.Cooldown}s|r`

        this.UpdateUnitAbilityBase(unit, tooltip);
    }

}