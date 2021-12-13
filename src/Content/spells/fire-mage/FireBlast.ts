import { Timer, Unit } from "w3ts";
import { Log } from "../../../Log";
import { IDamageService } from "../../../services/damage/IDamageService";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/Wc3AbilityData";
import { AbilityEvent } from "../../../systems/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { AttackType } from "../../../systems/damage/AttackType";
import { DamageType } from "../../../systems/damage/DamageType";
import { HeroStat } from "../../../systems/hero-stats/HeroStat";
import { IHeroStatService } from "../../../systems/hero-stats/IHeroStatService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";

type FireBlastUnitData = {
    Damage: number,
    Range: number,
    Cost: number,
    Cooldown: number,
    Speed: number,
    CastableWhileMoving: boolean
}

export class FireBlast extends AbilityBase implements IUnitConfigurable<FireBlastUnitData> {

    public unitConfig = new UnitConfigurable<FireBlastUnitData>(() => ({
        Damage: 20,
        Range: 1000,
        Cost: 13,
        Cooldown: 4.5,
        Speed: 1200,
        CastableWhileMoving: false
    }));

    constructor(
        data: Wc3AbilityData,
        abilityEventHandler: IAbilityEventHandler,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
    ) {
        super(data);
        abilityEventHandler.OnAbilityEnd(this.id, e => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        Log.Info("Cast Fire blast");

        let caster = e.caster;
        let target = e.targetUnit ?? caster;
        if (!target) return;

        let data = this.GetUnitConfig(caster);
        let int = this.statService.GetStat(caster, HeroStat.Int);

        this.damageService.UnitDamageTarget(caster, target, data.Damage + int, AttackType.Spell, DamageType.Fire);

        new Timer().start(1, false, () => this.statService.UpdateStat(caster, HeroStat.Int, 1));
    }
    
    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (config: FireBlastUnitData) => void): void {
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