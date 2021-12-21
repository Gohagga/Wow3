import { Effect, Timer, Unit } from "w3ts";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/Wc3AbilityData";
import { ActionOrder } from "../../../systems/damage/ActionOrder";
import { AttackType } from "../../../systems/damage/AttackType";
import { IWowDamageEventHandler } from "../../../systems/damage/IWowDamageEventHandler";

export interface HotStreakConfig extends Wc3AbilityData {
    duration: [number, number],
    attachPoint: [string, string],
    sfxModel: [string, string],
    heatingUpBuffCodeId: string,
    hotStreakBuffCodeId: string,
}

export interface HotStreakUnitData {

}

interface HotStreakInstance {
    caster: Unit,
    sfx: Effect,
    expireTimer: Timer,
}

export class HotStreak extends AbilityBase {

    private duration: [number, number];
    private attachPoint: [string, string];
    private sfxModel: [string, string];
    private buff1: number;
    private buff2: number;
    private readonly hotStreaks: Record<number, HotStreakInstance> = {};

    constructor(
        data: HotStreakConfig,
        damageEventHandler: IWowDamageEventHandler,
    ) {
        super(data);
        this.duration = data.duration;
        this.attachPoint = data.attachPoint;
        this.sfxModel = data.sfxModel;
        
        this.buff1 = FourCC(data.heatingUpBuffCodeId);
        this.buff2 = FourCC(data.hotStreakBuffCodeId);

        damageEventHandler.Subscribe(ActionOrder.HotStreak, (e, sub) => {

            print("Damage event~", e.isCrit, e.attackType);
            if ((e.source.getAbilityLevel(this.id) > 0) && e.isCrit && (e.attackType == AttackType.Autoattack || e.attackType == AttackType.Spell)) {
                print("HotStreak");
                this.AddStack(e.source);
            }
        });
    }

    public AddStack(caster: Unit) {

        const lvl = caster.getAbilityLevel(this.id);
        if (lvl > 0 && lvl < 3) {

            let instance: HotStreakInstance;
            const casterId = caster.id;
            if (casterId in this.hotStreaks) {

                instance = this.hotStreaks[casterId];
                instance.sfx.destroy();
                instance.expireTimer.pause();
                instance.sfx = new Effect(this.sfxModel[lvl - 1], caster, this.attachPoint[lvl - 1]);
            } else {

                instance = {
                    caster,
                    expireTimer: new Timer(),
                    sfx: new Effect(this.sfxModel[lvl - 1], caster, this.attachPoint[lvl - 1]),
                };
            }
            caster.removeAbility(this.buff1);
            caster.setAbilityLevel(this.id, lvl + 1);
            instance.expireTimer.start(this.duration[lvl - 1], false, () => this.Remove(caster));
            this.hotStreaks[casterId] = instance;
        }
    }

    public HeatUp(caster: Unit) {

        const lvl = caster.getAbilityLevel(this.id);
        if (lvl == 1) {

            let instance: HotStreakInstance;
            const casterId = caster.id;
            if (casterId in this.hotStreaks) {

                instance = this.hotStreaks[casterId];
                instance.sfx.destroy();
                instance.expireTimer.pause();
                instance.sfx = new Effect(this.sfxModel[0], caster, this.attachPoint[0]);
            } else {

                instance = {
                    caster,
                    expireTimer: new Timer(),
                    sfx: new Effect(this.sfxModel[0], caster, this.attachPoint[0])
                };
            }
            caster.removeAbility(this.buff1);
            caster.setAbilityLevel(this.id, 2);
            instance.expireTimer.start(this.duration[0], false, () => this.Remove(caster));
            this.hotStreaks[casterId] = instance;
        }
    }

    public Consume(caster: Unit) {

        if (caster.getAbilityLevel(this.id) == 3) {
            const casterId = caster.id;
            if (casterId in this.hotStreaks) {
                this.Remove(caster);
                return true;
            }
        }
        return false;
    }

    public Remove(caster: Unit) {
        const casterId = caster.id;
        if (casterId in this.hotStreaks == false) return;

        let instance: HotStreakInstance = this.hotStreaks[casterId];
        instance.caster.setAbilityLevel(this.id, 1);
        instance.caster.removeAbility(this.buff1);
        instance.caster.removeAbility(this.buff2);
        instance.sfx.destroy();
    }

    UpdateUnitSkill(unit: Unit): void {
        
    }
}