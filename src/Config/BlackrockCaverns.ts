import { StarfireConfig } from "Content/spells/balance-druid/Starfire";
import { WrathConfig } from "Content/spells/balance-druid/Wrath";
import { FireballConfig } from "content/spells/fire-mage/Fireball";
import { DummyUnitManagerConfig } from "systems/dummies/DummyUnitManager";
import { OrderId } from 'w3ts/globals/order'
import { FireBlastConfig } from "../content/spells/fire-mage/FireBlast";
import { HotStreakConfig } from "../content/spells/fire-mage/HotStreak";
import { IgniteConfig } from "../content/spells/fire-mage/Ignite";
import { PyroblastConfig } from "../content/spells/fire-mage/Pyroblast";
import { ScorchConfig } from "../content/spells/fire-mage/Scorch";
import { Wc3AbilityData } from "../systems/abilities/Wc3AbilityData";
import { AttackType } from "../systems/damage/AttackType";
import { DamageType } from "../systems/damage/DamageType";
import { HeroStat } from "../systems/hero-stats/HeroStat";
import { CastBarServiceConfig } from "../systems/progress-bars/CastBarService";
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
        [HeroStat.Mastery]: 0,
        [HeroStat.CritChance]: 0.05,
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
        codeId: 'AC22',
        name: 'Fire Blast',
        orderId: OrderId.Berserk,
        sfxModelPath: 'Models/Fire Crescent Tailed',
    }
    
    pyroblast: PyroblastConfig = {
        codeId: 'AC21',
        name: 'Pyroblast',
        orderId: OrderId.Nightelfbuild,
        dummyPyroblast: {
            orderId: OrderId.Shadowstrike,
            spellCodeId: 'AP02',
        }
    }

    hotStreak: HotStreakConfig = {
        codeId: 'AC25',
        name: 'Hot Streak',
        tooltip: 'Super hot',
        duration: [3, 6],
        attachPoint: ['chest', 'origin'],
        orderId: 0,
        sfxModel: [
            'Abilities/Spells/Orc/SpiritLink/SpiritLinkTarget.mdl',
            'Models/DoomTarget_01'
        ],
        heatingUpBuffCodeId: 'BC21',
        hotStreakBuffCodeId: 'BC22',
    }

    scorch: ScorchConfig = {
        codeId: 'AC23',
        scorchFirestarterCodeId: 'AC24',
        name: 'Scorch',
        orderId: OrderId.Manashieldon,
        sfxModel: 'Models/Airstrike Rocket.mdl',
        removedBuffCodeId: 'BNms',
        nonInterruptOrderId: [ OrderId.Manashieldon ],
    }

    wrath: WrathConfig = {
        codeId: 'AC11',
        name: 'Wrath',
        orderId: OrderId.Whirlwind,
        dummyWrath: {
            orderId: OrderId.Shadowstrike,
            spellCodeId: 'AP01',
        }
    }

    starfire: StarfireConfig = {
        codeId: 'AC12',
        name: 'Starfire',
        orderId: OrderId.Windwalk,
        sfxModelPath: 'Models/OrbitalRay_01'
    }

    moonfire: FireBlastConfig = {
        codeId: 'AC14',
        name: 'Moonfire',
        orderId: OrderId.Monsoon,
        sfxModelPath: 'Abilities/Spells/Other/Monsoon/MonsoonBoltTarget.mdl',
    }

    sunfire: FireBlastConfig = {
        codeId: 'AC15',
        name: 'Sunfire',
        orderId: OrderId.Monsoon,
        sfxModelPath: 'Abilities/Spells/Other/Doom/DoomDeath',
    }
    
    ignite: IgniteConfig = {
        codeId: 'A010',
        name: 'Ignite',
        orderId: OrderId.Manashieldon,
        sfxModelPath: 'Environment/SmallBuildingFire/SmallBuildingFire2',
    }
}

