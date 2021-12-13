import { HeroStat } from "../hero-stats/HeroStat";
import { IHeroStatService } from "../hero-stats/IHeroStatService";
import { ActionOrder } from "./ActionOrder";
import { DamageType } from "./DamageType";
import { IWowDamageEventHandler } from "./IWowDamageEventHandler";
import { IDamageEventHandler } from "./library/IDamageEventHandler";

export class CritManager {

    constructor(
        damageEventHandler: IWowDamageEventHandler,
        private heroStatService: IHeroStatService,
    ) {
        damageEventHandler.Subscribe(ActionOrder.CritCalculation, e => {

            let source = e.source;
            
            if (e.isCrit == false) {

                let chance = this.heroStatService.GetStat(source, HeroStat.CritChance);
                let critMulti = this.heroStatService.GetStat(source, HeroStat.CritMultiplier);

                if (math.random() < chance) {
                    e.damage *= critMulti;
                    e.isCrit = true;
                }
            }
        });
    }
}