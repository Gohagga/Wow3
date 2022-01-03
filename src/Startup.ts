import { Config } from "config/BlackrockCaverns";
import { BalanceDruid } from "Content/Classes/BalanceDruid";
import { Moonfire } from "Content/spells/balance-druid/Moonfire";
import { NaturalBalance } from "Content/spells/balance-druid/NaturalBalance";
import { Starfire } from "Content/spells/balance-druid/Starfire";
import { Sunfire } from "Content/spells/balance-druid/Sunfire";
import { Wrath } from "Content/spells/balance-druid/Wrath";
import { Fireball } from "content/spells/fire-mage/Fireball";
import { AbilityEventHandler } from "systems/ability-events/AbilityEventHandler";
import { DamageEventHandler } from "systems/damage/library/DamageEventHandler";
import { DummyAbilityFactory } from "systems/dummies/DummyAbilityFactory";
import { DummyUnitManager } from "systems/dummies/DummyUnitManager";
import { Frame, MapPlayer, Trigger, Unit } from "w3ts";
import { FireMage } from "./content/Classes/FireMage";
import { FireBlast } from "./content/spells/fire-mage/FireBlast";
import { HotStreak } from "./content/spells/fire-mage/HotStreak";
import { Ignite } from "./content/spells/fire-mage/Ignite";
import { Pyroblast } from "./content/spells/fire-mage/Pyroblast";
import { Scorch } from "./content/spells/fire-mage/Scorch";
import { ScorchFirestarter } from "./content/spells/fire-mage/ScorchFirestarter";
import { Level, Log } from "./Log";
import { OrderQueueService } from "./services/ability-queue/OrderQueueService";
import { DamageDisplayManager } from "./services/damage-display/DamageDisplayManager";
import { DamageService } from "./services/damage/DamageService";
import { EnumUnitService } from "./services/enum-service/EnumUnitService";
import { LastTargetService } from "./services/last-target/LastTargetService";
import { AbilityEventProvider } from "./systems/ability-events/AbilityEventProvider";
import { AutoattackEventProvider } from "./systems/damage/AutoattackEventProvider";
import { CritManager } from "./systems/damage/CritManager";
import { HeroStatService } from "./systems/hero-stats/HeroStatService";
import { InterruptableService } from "./systems/interruptable/InterruptableService";
import { CastBarService } from "./systems/progress-bars/CastBarService";
import { CastBarService2 } from "./systems/progress-bars/CastBarService2";
import { CastBarService3 } from "./systems/progress-bars/CastBarService3";
import { SpellcastingService } from "./systems/progress-bars/SpellcastingService";
import { SkillManager } from "./systems/skill-manager/SkillManager";
import { BasicTalentTreeViewModel } from "./systems/talents/ViewModels/BasicTalentTreeViewModel";
import { BasicTalentViewModel } from "./systems/talents/ViewModels/BasicTalentViewModel";
import { GenerateBasicTalentTreeView } from "./UI/STK/Views/BasicTalentTreeView";
import { GenerateBasicTalentView } from "./UI/STK/Views/BasicTalentView";

export function Startup() {
    
    const config = new Config();
    Log.Level = Level.All;
    try {

        const damageEventHandler = new DamageEventHandler();
        const abilityEvent = new AbilityEventHandler();
        const dummyUnitManager = new DummyUnitManager(config.dummies);
        const dummyAbilityFactory = new DummyAbilityFactory(dummyUnitManager);
    
        let x = 0;

        const skillManager = new SkillManager();
        const heroStatService = new HeroStatService(config.defaultHeroStats, skillManager);
        const damageDisplayManager = new DamageDisplayManager();
        const damageService = new DamageService(damageEventHandler, damageDisplayManager);
        const interruptableService = new InterruptableService();
        const orderQueueService = new OrderQueueService();
        const castBarService = new CastBarService3(config.castBars, interruptableService, orderQueueService);
        const critManager = new CritManager(damageEventHandler, heroStatService);
        const enumUnitService = new EnumUnitService();
        const lastTargetService = new LastTargetService();
        
        // Wc3 Event providers
        const autoattackEventProvider = new AutoattackEventProvider(damageEventHandler, damageDisplayManager, heroStatService);
        const abilityEventProvider = new AbilityEventProvider(abilityEvent, interruptableService);

        const spellcastingService = new SpellcastingService(config.castBars, interruptableService, orderQueueService);
    
        let aIgnite = new Ignite(config.ignite, damageService, heroStatService, enumUnitService);
        let aFireball = new Fireball(config.fireball, dummyAbilityFactory, abilityEvent, spellcastingService);
        let aFireBlast = new FireBlast(config.fireBlast, abilityEvent, damageService, heroStatService, lastTargetService, spellcastingService, aIgnite);
        let aHotStreak = new HotStreak(config.hotStreak, damageEventHandler);
        let aPyroblast = new Pyroblast(config.pyroblast, abilityEvent, dummyAbilityFactory, aHotStreak, damageService, heroStatService, spellcastingService, aIgnite);
        let aScorch = new Scorch(config.scorch, abilityEvent, damageService, heroStatService, lastTargetService, spellcastingService, aIgnite);
        let aScorchFirestarter = new ScorchFirestarter(config.scorch, aScorch, abilityEvent, damageService, heroStatService, castBarService, lastTargetService, spellcastingService);

        let aMoonfire = new Moonfire(config.moonfire, abilityEvent, damageService, heroStatService, spellcastingService);
        let aSunfire = new Sunfire(config.sunfire, abilityEvent, damageService, heroStatService, spellcastingService);
        let aNaturalBalance = new NaturalBalance(aMoonfire, aSunfire);
        let aWrath = new Wrath(config.wrath, abilityEvent, dummyAbilityFactory, damageService, heroStatService, spellcastingService, aNaturalBalance);
        let aStarfire = new Starfire(config.starfire, abilityEvent, damageService, heroStatService, spellcastingService, aNaturalBalance);

        const abilities = {
            ignite: aIgnite,
            fireball: aFireball,
            fireBlast: aFireBlast,
            hotStreak: aHotStreak,
            pyroblast: aPyroblast,
            scorch: aScorch,
            scorchFirestarter: aScorchFirestarter,

            wrath: aWrath,
            starfire: aStarfire,
            moonfire: aMoonfire,
            sunfire: aSunfire,
            naturalBalance: aNaturalBalance
        }
    
        // Talent UI
        const treeUi = GenerateBasicTalentTreeView(config.talents.talentTreeView, Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0));
        const treeVm = new BasicTalentTreeViewModel(config.talents.talentTreeViewModel, MapPlayer.fromIndex(0), treeUi,
            (i) => new BasicTalentViewModel(config.talents.talentViewModel, GenerateBasicTalentView(config.talents.talentView, treeUi.window, i.toString())));

        const testUnit = Unit.fromHandle(gg_unit_E000_0003);
        const tree = new BalanceDruid(testUnit, skillManager, heroStatService, abilities);
        // treeVm.SetTree(tree);
        // treeVm.Show();

        const testUnit2 = Unit.fromHandle(gg_unit_Hblm_0002);
        const tree2 = new FireMage(testUnit2, skillManager, heroStatService, abilities);
        // treeVm.SetTree(tree2);
        // treeVm.Show();

        let t = new Trigger();
        t.registerPlayerChatEvent(MapPlayer.fromIndex(0), '-druid', true);
        t.addAction(() => {
            treeVm.SetTree(tree);
            treeVm.Show();
        });

        let t2 = new Trigger();
        t2.registerPlayerChatEvent(MapPlayer.fromIndex(0), '-mage', true);
        t2.addAction(() => {
            treeVm.SetTree(tree2);
            treeVm.Show();
        });
        
    } catch (ex: any) {
        Log.Error(ex);
    }

}