import { Trigger, Unit } from "w3ts";
import { DamageDisplayManager } from "../../services/damage-display/DamageDisplayManager";
import { HeroStat } from "../hero-stats/HeroStat";
import { IHeroStatService } from "../hero-stats/IHeroStatService";
import { AttackType } from "./AttackType";
import { DamageEvent } from "./DamageEvent";
import { DamageType } from "./DamageType";
import { IWowDamageEventHandler } from "./IWowDamageEventHandler";
import { IDamageEventHandler } from "./library/IDamageEventHandler";

export class AutoattackEventProvider {

    damageEventTrigger: Trigger;

    constructor(
        private readonly damageEventHandler: IWowDamageEventHandler,
        private readonly damageDisplayManager: DamageDisplayManager,
        private readonly heroStatService: IHeroStatService,
    ) {

        this.damageEventTrigger = new Trigger();
        this.damageEventTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGING);
        this.damageEventTrigger.addAction(() => {
            
            const dmgType = BlzGetEventDamageType();
            if (dmgType != DAMAGE_TYPE_NORMAL) return;
            
            const source = Unit.fromHandle(GetEventDamageSource());
            const targetUnit = Unit.fromHandle(BlzGetEventDamageTarget());
            // const targetWidget = Widget.from(GetTriggerWidget());

            const event = new DamageEvent({
                source,
                targetUnit: targetUnit,
                // targetWidget: targetWidget,
                damageType: this.heroStatService.GetStat<DamageType>(source, HeroStat.AutoDamageType),
                damageTypeCount: 1,
                attackType: AttackType.Autoattack,
                damage: GetEventDamage(),
                isCrit: false
            });
            
            // // If it wasn't a melee attack but a ranged one instead, need to create a missile
            // if (source.attackMethod) {
            //     if (!source.attackMethod(event))
            //         return;
            // }
            
            // If it was melee attack, need to recognize it and create a damage event
            this.damageEventHandler.Register(event);

            this.damageDisplayManager.DisplayDamageEvent(event);
        });
    }
}