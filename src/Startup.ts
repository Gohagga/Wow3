import { Config } from "Config/BlackrockCaverns";
import { Fireball } from "Content/spells/fire-mage/Fireball";
import { AbilityEventHandler } from "systems/ability-events/AbilityEventHandler";
import { DamageEventHandler } from "systems/damage/library/DamageEventHandler";
import { DummyAbilityFactory } from "systems/dummies/DummyAbilityFactory";
import { DummyUnitManager } from "systems/dummies/DummyUnitManager";
import { Frame, MapPlayer, Unit } from "w3ts";
import { FireMage } from "./Content/Classes/FireMage";
import { FireBlast } from "./Content/spells/fire-mage/FireBlast";
import { Level, Log } from "./Log";
import { AbilityEventProvider } from "./systems/ability-events/AbilityEventProvider";
import { BasicTalentTreeViewModel } from "./systems/talents/ViewModels/BasicTalentTreeViewModel";
import { BasicTalentViewModel } from "./systems/talents/ViewModels/BasicTalentViewModel";
import { GenerateBasicTalentTreeView } from "./UI/STK/Views/BasicTalentTreeView";
import { GenerateBasicTalentView } from "./UI/STK/Views/BasicTalentView";

export function Startup() {
    
    const config = new Config();
    Log.Level = Level.All;

    const damageEventHandler = new DamageEventHandler();
    const abilityEvent = new AbilityEventHandler();
    const dummyAbilityEventProvider = new AbilityEventProvider(abilityEvent);
    const dummyUnitManager = new DummyUnitManager(config.dummies);
    const dummyAbilityFactory = new DummyAbilityFactory(dummyUnitManager);

    const abilities = {
        fireball: new Fireball(config.fireball, dummyAbilityFactory, abilityEvent),
        fireBlast: new FireBlast(config.fireBlast, abilityEvent),
    }

    try {
        print(1)
        const treeUi = GenerateBasicTalentTreeView(config.talentTreeView, Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0));
        print(2)
    
        const treeVm = new BasicTalentTreeViewModel(config.talentTreeViewModel, MapPlayer.fromIndex(0), treeUi,
            (i) => new BasicTalentViewModel(config.talentViewModel, GenerateBasicTalentView(config.talentView, treeUi.window, i.toString())));
        print(3)
    
        const tree = new FireMage(Unit.fromHandle(gg_unit_H000_0020), abilities);
        print(4)
    
        treeVm.SetTree(tree);
        print(5)
        treeVm.Show();
        print(6)
    } catch (ex: any) {
        Log.Error(ex);
    }
}