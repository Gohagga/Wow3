import { Effect, Timer, Unit } from "w3ts";
import { Log } from "../../../Log";
import { IDamageService } from "../../../services/damage/IDamageService";
import { LastTargetService } from "../../../services/last-target/LastTargetService";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/Wc3AbilityData";
import { AbilityEvent } from "../../../systems/ability-events/event-models/AbilityEvent";
import { IAbilityEvent } from "../../../systems/ability-events/event-models/IAbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { AttackType } from "../../../systems/damage/AttackType";
import { DamageType } from "../../../systems/damage/DamageType";
import { HeroStat } from "../../../systems/hero-stats/HeroStat";
import { IHeroStatService } from "../../../systems/hero-stats/IHeroStatService";
import { SpellcastingService } from "../../../systems/progress-bars/SpellcastingService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";

export interface SunfireConfig extends Wc3AbilityData {
    sfxModelPath: string,
}

type SunfireUnitData = {
    Damage: number,
    Range: number,
    Cost: number,
    Cooldown: number,
    BonusCrit: number,
    CastableWhileMoving: boolean
}

export class Sunfire extends AbilityBase implements IUnitConfigurable<SunfireUnitData> {

    public unitConfig = new UnitConfigurable<SunfireUnitData>(() => ({
        Damage: 20,
        Range: 1000,
        Cost: 13,
        Cooldown: 4.5,
        BonusCrit: 0,
        CastableWhileMoving: false
    }));

    private readonly sfxModelPath: string;

    constructor(
        data: SunfireConfig,
        abilityEventHandler: IAbilityEventHandler,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
        private readonly spellcastingService: SpellcastingService
    ) {
        super(data);
        this.sfxModelPath = data.sfxModelPath;
        abilityEventHandler.OnAbilityCast(this.id, e => this.Execute(e));
    }

    Execute(e: IAbilityEvent): void {
        Log.Info("Cast Fire blast");

        let caster = e.caster;
        let target = e.targetUnit;
        let data = this.GetUnitConfig(caster);

        if (!target) {
            // Return no target error
            return; 
        } else if (!caster.inRangeOfUnit(target, data.Range)) {
            // If target is in range error
            return;
        }

        if (this.spellcastingService.TryQueueOrder(caster, this.orderId, 'target', target)) return;
    
        const victim = target;
        this.statService.DoWithModifiedStat(caster, HeroStat.CritChance, data.BonusCrit, () => {

            let int = this.statService.GetStat(caster, HeroStat.Int);
            this.damageService.UnitDamageTarget(caster, victim, data.Damage + int, AttackType.Spell, DamageType.Fire);
            let eff = new Effect(this.sfxModelPath, victim, 'origin');
            eff.destroy();
            caster.queueAnimation("spell");
        });
    }
    
    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (this: void, config: SunfireUnitData) => void): void {
        this.unitConfig.UpdateUnitConfig(unit, cb);
        this.UpdateUnitSkill(unit);
    }

    UpdateUnitSkill(unit: Unit) {
        const data = this.unitConfig.GetUnitConfig(unit);
        const int = this.statService.GetStat(unit, HeroStat.Int);
        const dmg = string.format("%.2f", data.Damage + int);
        
        let tooltip = 
`Inflicts ${dmg} Fire damage to the last targeted enemy.

|cffffd9b3Cooldown ${data.Cooldown}s|r`

        if (data.CastableWhileMoving) 
            tooltip += "\n|cffffd9b3Castable while moving and while casting other spells.|r";

        this.UpdateUnitAbilityBase(unit, tooltip);
    }

}