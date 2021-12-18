import { Config } from "config/BlackrockCaverns";
import { Fireball } from "content/spells/fire-mage/Fireball";
import { AbilityEventHandler } from "systems/ability-events/AbilityEventHandler";
import { DamageEventHandler } from "systems/damage/library/DamageEventHandler";
import { DummyAbilityFactory } from "systems/dummies/DummyAbilityFactory";
import { DummyUnitManager } from "systems/dummies/DummyUnitManager";
import { Frame, MapPlayer, Unit } from "w3ts";
import { FireMage } from "./content/Classes/FireMage";
import { FireBlast } from "./content/spells/fire-mage/FireBlast";
import { HotStreak } from "./content/spells/fire-mage/HotStreak";
import { Pyroblast } from "./content/spells/fire-mage/Pyroblast";
import { Scorch } from "./content/spells/fire-mage/Scorch";
import { ScorchFirestarter } from "./content/spells/fire-mage/ScorchFirestarter";
import { Level, Log } from "./Log";
import { OrderQueueService } from "./services/ability-queue/OrderQueueService";
import { DamageDisplayManager } from "./services/damage-display/DamageDisplayManager";
import { DamageService } from "./services/damage/DamageService";
import { LastTargetService } from "./services/last-target/LastTargetService";
import { AbilityEventProvider } from "./systems/ability-events/AbilityEventProvider";
import { AutoattackEventProvider } from "./systems/damage/AutoattackEventProvider";
import { CritManager } from "./systems/damage/CritManager";
import { HeroStatService } from "./systems/hero-stats/HeroStatService";
import { InterruptableService } from "./systems/interruptable/InterruptableService";
import { CastBarService } from "./systems/progress-bars/CastBarService";
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
        const castBarService = new CastBarService(config.castBars, interruptableService, orderQueueService);
        const critManager = new CritManager(damageEventHandler, heroStatService);
        const lastTargetService = new LastTargetService();
        
        // Wc3 Event providers
        const autoattackEventProvider = new AutoattackEventProvider(damageEventHandler, damageDisplayManager, heroStatService);
        const abilityEventProvider = new AbilityEventProvider(abilityEvent);
    
        let aFireball = new Fireball(config.fireball, dummyAbilityFactory, abilityEvent);
        let aFireBlast = new FireBlast(config.fireBlast, abilityEvent, damageService, heroStatService, lastTargetService);
        let aHotStreak = new HotStreak(config.hotStreak, damageEventHandler);
        let aPyroblast = new Pyroblast(config.pyroblast, abilityEvent, dummyAbilityFactory, aHotStreak, damageService, heroStatService, castBarService);
        let aScorch = new Scorch(config.scorch, abilityEvent, damageService, heroStatService, castBarService, lastTargetService);
        let aScorchFirestarter = new ScorchFirestarter(config.scorch, aScorch, abilityEvent, damageService, heroStatService, castBarService, lastTargetService);

        const abilities = {
            fireball: aFireball,
            fireBlast: aFireBlast,
            hotStreak: aHotStreak,
            pyroblast: aPyroblast,
            scorch: aScorch,
            scorchFirestarter: aScorchFirestarter
        }
    
        // Talent UI
        const treeUi = GenerateBasicTalentTreeView(config.talents.talentTreeView, Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0));
        const treeVm = new BasicTalentTreeViewModel(config.talents.talentTreeViewModel, MapPlayer.fromIndex(0), treeUi,
            (i) => new BasicTalentViewModel(config.talents.talentViewModel, GenerateBasicTalentView(config.talents.talentView, treeUi.window, i.toString())));

        const tree = new FireMage(Unit.fromHandle(gg_unit_H000_0020), skillManager, abilities);
        treeVm.SetTree(tree);
        treeVm.Show();
        
    } catch (ex: any) {
        Log.Error(ex);
    }

}