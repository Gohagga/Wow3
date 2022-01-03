import { Effect, Timer, Unit } from "w3ts";
import { Log } from "../../../Log";
import { IDamageService } from "../../../services/damage/IDamageService";
import { IEnumUnitService } from "../../../services/enum-service/IEnumUnitService";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/Wc3AbilityData";
import { Coords } from "../../../systems/coord/Coords";
import { AttackType } from "../../../systems/damage/AttackType";
import { DamageType } from "../../../systems/damage/DamageType";
import { HeroStat } from "../../../systems/hero-stats/HeroStat";
import { IHeroStatService } from "../../../systems/hero-stats/IHeroStatService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";

export interface IgniteConfig extends Wc3AbilityData {
    sfxModelPath: string,
}

export type IgniteUnitData = {
    Duration: number,
    DamageAmount: number,
    Wildfire: boolean,
    DamageTickTime: number,
    SpreadTickTime: number,
    SpreadRadius: number,
}

export type IgniteInstance = {
    caster: Unit,
    target: Unit,
    bank: number,
    ticks: number,
    spreadTicks: number | null,
    spreadRadius: number | null,

    ticksToSpread: number,
    timer: Timer,
};

export class Ignite extends AbilityBase implements IUnitConfigurable<IgniteUnitData> {
    
    public unitConfig = new UnitConfigurable<IgniteUnitData>(() => ({
        Duration: 9,
        DamageAmount: 0,
        Wildfire: false,
        DamageTickTime: 1.0,
        SpreadTickTime: 2.0,
        SpreadRadius: 300.0
    }));

    private casterIgnites: Record<number, Record<number, IgniteInstance>> = {};

    private readonly sfxModelPath: string;

    constructor(
        data: IgniteConfig,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
        private readonly enumService: IEnumUnitService,
    ) {
        super(data);
        this.sfxModelPath = data.sfxModelPath;
    }

    public AddIfHasAbility(target: Unit, caster: Unit, damageDealt: number) {
        if (caster.getAbilityLevel(this.id) < 1) return;
        return this.Add(target, caster, damageDealt);
    }

    public Add(target: Unit, caster: Unit, damageDealt: number): IgniteInstance {
        
        const data = this.GetUnitConfig(caster);
        // print("Add ignite", damageDealt, data.DamageAmount, this.statService.GetStat(caster, HeroStat.Mastery) * 0.01 + 1);
        const damage = damageDealt * data.DamageAmount * (this.statService.GetStat(caster, HeroStat.Mastery) * 0.01 + 1);
        
        const casterId = caster.id;
        const targetId = target.id;
        let instance: IgniteInstance;
        if (casterId in this.casterIgnites == false) this.casterIgnites[casterId] = {};

        if (targetId in this.casterIgnites[casterId]) {
            instance = this.casterIgnites[casterId][targetId];

            // If target already has ignite, just add the damage to the bank
            // PauseTimer(instance.timer);
            instance.bank += damage;
            instance.ticks = data.Duration;
            
            instance.spreadTicks = data.SpreadTickTime;
            instance.spreadRadius = data.SpreadRadius;
            if (!data.Wildfire) {
                instance.spreadTicks = null;
                instance.spreadRadius = null;
            }

        } else {
            
            instance = {
                caster: caster,
                target: target,
                bank: damage,
                ticks: data.Duration,
                spreadTicks: data.SpreadTickTime,
                spreadRadius: data.SpreadRadius,

                ticksToSpread: 0,
                timer: new Timer()
            };

            if (!data.Wildfire) {
                instance.spreadTicks = null;
                instance.spreadRadius = null;
            }

            instance.timer.start(data.DamageTickTime, true, () => this.Damage(instance));
        }

        this.casterIgnites[casterId][targetId] = instance;
        return instance;
    }

    private Damage(instance: IgniteInstance): void {

        const damageTick = instance.bank / instance.ticks;
        instance.bank -= damageTick;
        instance.ticks--;

        if (instance.ticks > 0) {
            // print("Tick", damageTick)
            this.damageService.UnitDamageTarget(instance.caster, instance.target, 1 + damageTick, AttackType.Untyped, DamageType.Fire);
            
            new Effect(this.sfxModelPath, instance.target, "head").destroy();

            if (instance.spreadTicks) {
                instance.ticksToSpread++;
                // print("spread?", instance.spreadTicks, instance.ticksToSpread, instance.spreadTicks)
                if (instance.ticksToSpread % instance.spreadTicks == 0) {
                    this.Spread(instance);
                }
            }
        } else {
            instance.timer.pause();
            instance.timer.destroy();
            
            // print("Destroying Ignite instance")
            delete this.casterIgnites[instance.caster.id][instance.target.id];
            // print(this.casterIgnites[instance.caster.id][instance.target.id])
        }
    }

    private Spread(instance: IgniteInstance): void {
        
        // print("Attempting to spread")
        let targets = this.enumService.EnumUnitsInRange(Coords.fromUnit(instance.target), instance.spreadRadius || 0, t =>
            t.id != instance.target.id &&
            !t.isUnitType(UNIT_TYPE_MAGIC_IMMUNE) &&
            t.life > 0.405);

        // print("Potential targets", targets.length)
        if (targets.length == 0) return;

        const casterId = instance.caster.id;
        const data = this.GetUnitConfig(instance.caster);

        let u: Unit | undefined = undefined;
        let selected: Unit | null = null;
        let uInstance: IgniteInstance;

        while (((u = targets.pop()) != null) && !selected) {
            // // print("loop u", u.name);
            // Try to get picked up unit's Ignite instance
            uInstance = this.casterIgnites[casterId][u.id];
            // If picked unit already has ignite, spread to it only if its bank is less than this
            // // print("has?", uInstance != null, uInstance != null && uInstance.bank, instance.bank)
            if (uInstance && uInstance.bank < instance.bank) {
                selected = u;
            }
            // Otherwise only spread to picked unit if it doesn't have an Ignite effect from this caster at all
            else if (!uInstance) {
                // // print("not has")
                selected = u;
            }
        }

        
        if (selected) {
            // print("Got selected unit", selected.name);

            const selectedId = selected.id;
            if (selectedId in this.casterIgnites[casterId]) {
                let ig = this.casterIgnites[casterId][selectedId];
                ig.bank = instance.bank;
                ig.ticks = instance.ticks;
                ig.ticksToSpread = 0;
            } else {
                // print("Creating new ignite");
                const newIgnite: IgniteInstance = {
                    caster: instance.caster,
                    target: selected,
                    bank: instance.bank,
                    ticks: instance.ticks,
                    spreadTicks: instance.spreadTicks,
                    spreadRadius: instance.spreadRadius,
                    
                    ticksToSpread: 0,
                    timer: new Timer()
                };
    
                newIgnite.timer.start(data.DamageTickTime, true, () => this.Damage(newIgnite));
                this.casterIgnites[casterId][selectedId] = newIgnite;
            }

        }
    }
    
    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (config: IgniteUnitData) => void): void {
        this.unitConfig.UpdateUnitConfig(unit, cb);
        this.UpdateUnitSkill(unit);
    }

    UpdateUnitSkill(unit: Unit): void {
        
    }
}
