import { Effect, Timer, Unit } from "w3ts";
import { OrderId } from "w3ts/globals/order";
import { Log } from "../../../Log";
import { IDamageService } from "../../../services/damage/IDamageService";
import { LastTargetService } from "../../../services/last-target/LastTargetService";
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
import { ICastBarService } from "../../../systems/progress-bars/ICastBarService";
import { SpellcastingService } from "../../../systems/progress-bars/SpellcastingService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";
import { HotStreak } from "./HotStreak";
import { Ignite } from "./Ignite";

export interface ScorchConfig extends Wc3AbilityData {
    scorchFirestarterCodeId: string,
    removedBuffCodeId: string,
    sfxModel: string,
    nonInterruptOrderId: number[],
}

export type ScorchUnitData = {
    Damage: number
    CastTime: number,
    Firestarter: boolean,
    Range: number,
    CritBonus: number,
    NonInterruptOrderId: number | null,
}

export class Scorch extends AbilityBase implements IUnitConfigurable<ScorchUnitData> {

    public readonly unitConfig = new UnitConfigurable<ScorchUnitData>(() => ({
        Damage: 20,
        CastTime: 2.0,
        Range: 1000,
        Firestarter: false,
        CritBonus: 0.0,
        NonInterruptOrderId: null,
    }));

    private readonly removedBuffId: number;
    private readonly nonInterruptOrderId: number[];
    private readonly sfxModelPath: string;

    constructor(
        data: ScorchConfig,
        abilityEventHandler: IAbilityEventHandler,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
        private readonly lastTargetService: LastTargetService,
        private readonly spellcastingService: SpellcastingService,
        private readonly ignite: Ignite,
    ) {
        super(data);
        this.removedBuffId = FourCC(data.removedBuffCodeId);
        this.nonInterruptOrderId = data.nonInterruptOrderId;
        this.sfxModelPath = data.sfxModel;

        abilityEventHandler.OnAbilityCast(this.id, e => this.Execute(e));
    }

    Execute(e: IAbilityEvent): boolean {
        
        // print("SCORCH")
        let caster = e.caster;
        
        if (this.spellcastingService.TryToQueueAbility(caster, this.orderId, e, e => this.Execute(e))) return false;

        let data = this.GetUnitConfig(caster);

        let target = this.lastTargetService.Get(caster);
        if (!target) return false;

        if (caster.inRangeOfUnit(target, data.Range)) {

            let victim = target;
            SetUnitFacing(caster.handle, Atan2(caster.y-target.y, caster.x-target.x));
            this.spellcastingService.CastSpell(caster, this.id, data.CastTime, bar => {
                
                let tim = new Timer();
                tim.start(0.3, false, () => {

                    let int = this.statService.GetStat(caster, HeroStat.Int);
                    this.statService.DoWithModifiedStat(caster, HeroStat.CritChance, data.CritBonus, () => {
                        let damageEvent = this.damageService.UnitDamageTarget(caster, victim, int + data.Damage, AttackType.Spell, DamageType.Fire);
                        this.ignite.AddIfHasAbility(victim, caster, damageEvent.damage);
                    });

                    new Effect(this.sfxModelPath, victim, 'chest').destroy();
                    tim.destroy();
                });
                // if (this.spellcastingService.HasQueuedAbility(caster) == false)
                caster.issueTargetOrder(OrderId.Attack, victim);

            }, (orderId: number, castBar: CastBar) => {

                if (orderId != data.NonInterruptOrderId)
                    castBar.alive = false;

                if (castBar.isDone)
                    return false;
                
                return true;
            });
        }

        return true;
    }

    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (this: void, config: ScorchUnitData) => void): void {
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