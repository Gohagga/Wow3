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
import { CastBar } from "../../../systems/progress-bars/CastBar";
import { SpellcastingService } from "../../../systems/progress-bars/SpellcastingService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";
import { NaturalBalance } from "./NaturalBalance";

export interface StarfireConfig extends Wc3AbilityData {
    sfxModelPath: string,
}

type StarfireUnitData = {
    Damage: number,
    CastTime: number,
    CleaveRadius: number,
    Radius: number,
    Cost: number,
    Cooldown: number,

    NonInterruptOrderId: number,
}

export class Starfire extends AbilityBase implements IUnitConfigurable<StarfireUnitData> {

    public unitConfig = new UnitConfigurable<StarfireUnitData>(() => ({
        Damage: 20,
        CastTime: 2.5,
        CleaveRadius: 0,
        Radius: 1000,
        Cost: 13,
        Cooldown: 4.5,

        NonInterruptOrderId: FourCC('AC13')
    }));

    private readonly sfxModelPath: string;

    constructor(
        data: StarfireConfig,
        abilityEventHandler: IAbilityEventHandler,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
        private readonly spellcastingService: SpellcastingService,
        private readonly naturalBalance: NaturalBalance,
    ) {
        super(data);
        this.sfxModelPath = data.sfxModelPath;
        abilityEventHandler.OnAbilityCast(this.id, e => this.Execute(e));
    }

    Execute(e: IAbilityEvent): void {
        Log.Info("Cast Starfire");

        let caster = e.caster;
        let target = e.targetUnit;
        let data = this.GetUnitConfig(caster);

        if (!target) return;

        if (this.spellcastingService.TryQueueOrder(caster, this.orderId, 'target', target)) return;
    
        const victim = target;
        this.spellcastingService.CastSpell(caster, this.id, data.CastTime, () => {
            let int = this.statService.GetStat(caster, HeroStat.Int);
            this.damageService.UnitDamageTarget(caster, victim, data.Damage + int, AttackType.Spell, DamageType.Arcane);
            let eff = new Effect(this.sfxModelPath, victim, 'origin')
            eff.setTimeScale(1.5);
            eff.destroy();
            this.naturalBalance.SwapToLunar(caster);            
        }, (orderId: number, castBar: CastBar) => {
            
            if (orderId != data.NonInterruptOrderId)
                castBar.alive = false;

            if (castBar.isDone)
                return false;
            
            return true;
        });
    }
    
    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (this: void, config: StarfireUnitData) => void): void {
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