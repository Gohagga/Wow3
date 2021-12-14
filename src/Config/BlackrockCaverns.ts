import { FireballConfig } from "content/spells/fire-mage/Fireball";
import { DummyUnitManagerConfig } from "systems/dummies/DummyUnitManager";
import { OrderId } from 'w3ts/globals/order'
import { FireBlastConfig } from "../content/spells/fire-mage/FireBlast";
import { HotStreakConfig } from "../content/spells/fire-mage/HotStreak";
import { PyroblastConfig } from "../content/spells/fire-mage/Pyroblast";
import { ScorchConfig } from "../content/spells/fire-mage/Scorch";
import { Wc3AbilityData } from "../systems/abilities/Wc3AbilityData";
import { AttackType } from "../systems/damage/AttackType";
import { DamageType } from "../systems/damage/DamageType";
import { HeroStat } from "../systems/hero-stats/HeroStat";
import { CastBarServiceConfig } from "../systems/progress-bars/CastBarFactory";
import { TalentsConfig } from "./TalentConfig";

export class Config {
    
    public static DummyId = 'nDUM';

    dummies: DummyUnitManagerConfig = {
        dummyUnitCodeId: Config.DummyId,
        dummyUnitOwnerPlayerId: PLAYER_NEUTRAL_PASSIVE,
    }

    talents: TalentsConfig = new TalentsConfig();
    
    defaultHeroStats: Record<HeroStat, number> = {
        [HeroStat.Str]: 1,
        [HeroStat.Int]: 1,
        [HeroStat.Agi]: 1,
        [HeroStat.Spr]: 1,
        [HeroStat.CritChance]: 0.25,
        [HeroStat.CritMultiplier]: 1.5,

        [HeroStat.AutoDamageType]: DamageType.Untyped,
        [HeroStat.AutoAttackType]: AttackType.Autoattack,
    }

    castBars: CastBarServiceConfig = {
        updatePeriod: 0.03,
        defaultHeight: 250,
        model: 'Models/Progressbar_01.mdl',
        size: 1.5,
        queueTreshold: 0.5,
    }

    fireball: FireballConfig = {
        codeId: 'A00G',
        name: 'Fireball',
        orderId: OrderId.Firebolt,
        dummyFireball: {
            orderId: OrderId.Shadowstrike,
            spellCodeId: 'A00Y',
        }
    }

    fireBlast: FireBlastConfig = {
        codeId: 'A00F',
        name: 'Fire Blast',
        orderId: OrderId.Berserk,
        sfxModelPath: 'Models/Fire Crescent Tailed',
    }
    
    pyroblast: PyroblastConfig = {
        codeId: 'A00X',
        name: 'Pyroblast',
        orderId: OrderId.Nightelfbuild,
        dummyPyroblast: {
            orderId: OrderId.Shadowstrike,
            spellCodeId: 'A00Y',
        }
    }

    hotStreak: HotStreakConfig = {
        codeId: 'A00Z',
        name: 'Hot Streak',
        tooltip: 'Super hot',
        duration: [3, 6],
        attachPoint: ['chest', 'origin'],
        orderId: 0,
        sfxModel: [
            'Abilities/Spells/Orc/SpiritLink/SpiritLinkTarget.mdl',
            'Models/DoomTarget_01'
        ],
        heatingUpBuffCodeId: 'B006',
        hotStreakBuffCodeId: 'B004',
    }

    scorch: ScorchConfig = {
        codeId: 'A00W',
        name: 'Scorch',
        orderId: OrderId.Manashieldon,
        sfxModel: 'Models/Airstrike Rocket.mdl',
        removedBuffCodeId: 'BNms',
        nonInterruptOrderId: [ OrderId.Manashieldon ],
    }
}

