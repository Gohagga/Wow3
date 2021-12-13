import { Unit } from "w3ts/handles/unit";
import { AttackType } from "../damage/AttackType";
import { DamageType } from "../damage/DamageType";
import { ISkillManager } from "../skill-manager/ISkillManager";
import { HeroStat } from "./HeroStat";
import { IHeroStatService } from "./IHeroStatService";

export class HeroStatService implements IHeroStatService {

    private heroStats: Record<number, Partial<Record<HeroStat, number>>> = {};

    private applyEffects: Partial<Record<HeroStat, ((u: Unit, value: number) => void)>> = {
        [HeroStat.Str]: (u, v) => u.setStrength(v, true),
        [HeroStat.Int]: (u, v) => u.setIntelligence(v, true)
    }

    constructor(
        private readonly defaultStats: Record<HeroStat, number>,
        private readonly skillManager: ISkillManager,
    ) {
        
    }

    InternalUpdateStat(unit: Unit, stat: HeroStat, value: number) {
        const unitId = unit.id;

        if (unitId in this.heroStats == false)
            this.heroStats[unitId] = {};

        let newValue = (this.heroStats[unitId][stat] ?? this.defaultStats[stat]) + value;
        this.heroStats[unitId][stat] = newValue;
        let effect = this.applyEffects[stat];
        if (effect) effect(unit, newValue);
    }

    UpdateStat(unit: Unit, stat: HeroStat, value: number){
        this.InternalUpdateStat(unit, stat, value);
        this.skillManager.UpdateUnitSkills(unit);
    }

    GetStat<T extends number = number>(unit: Unit, stat: HeroStat) {
        const unitId = unit.id;

        if (unitId in this.heroStats == false)
            this.heroStats[unitId] = {};

        return <T>(this.heroStats[unitId][stat] ?? this.defaultStats[stat]);
    }

    DoWithModifiedStat(unit: Unit, stat: HeroStat, value: number, action: () => void) {
        this.InternalUpdateStat(unit, stat, value);
        action();
        this.InternalUpdateStat(unit, stat, -value);
    }
}