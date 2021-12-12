import { Unit } from "w3ts";
import { ITalentTreeBuilder } from "../../systems/talents/Interfaces/ITalentTreeBuilder";
import { ActivationEvent } from "../../systems/talents/Models/Talent";
import { TalentTree } from "../../systems/talents/Models/TalentTree";
import { TalentTreeBuilder } from "../../systems/talents/Models/TalentTreeBuilder";
import { Fireball } from "../spells/fire-mage/Fireball";
import { FireBlast } from "../spells/fire-mage/FireBlast";

export class FireMage extends TalentTree {

    get talentPoints(): number {
        return this.ownerPlayer.getState(PLAYER_STATE_RESOURCE_LUMBER);
    }
    set talentPoints(value: number) {
        this.ownerPlayer.setState(PLAYER_STATE_RESOURCE_LUMBER, value)
    }

    constructor(
        unit: Unit,
        private readonly abilities: {
            fireball: Fireball,
            fireBlast: FireBlast,
    }) {
        super(unit);
        this.Initialize(new TalentTreeBuilder(this));
    }

    // // Overriden stub methods ==================================================
    // GetTalentPoints(nothing returns integer
    //     return GetPlayerState(this.ownerPlayer, PLAYER_STATE_RESOURCE_LUMBER)
    // }

    // SetTalentPoints(integer points {
    //     SetPlayerState(this.ownerPlayer, PLAYER_STATE_RESOURCE_LUMBER, points)
    //     // STK_UpdateTalentViews(this.ownerPlayer)
    // }

    // GetTitle(nothing returns string
    //     return this.title
    // }
    // =========================================================================

    public Initialize(builder: ITalentTreeBuilder): void {

        print("Initialize func called");
        builder.SetColumnsRows(4, 7);
        print("cols rows set")
        builder.title = "Fire Mage";
        print("title set")
        builder.talentPoints = 6;
        print("talent points set")

        let { fireball, fireBlast } = this.abilities;
        // builder.backgroundImage = "balancebg.blp";

        // The tree should be built with talents here
        // ==============================================

        const goldCost = (cost: number) => {
            return {
                Image: "ReplaceableTextures/CommandButtons/BTNspell_nature_abolishmagic",
                Text: cost.toString()
            }
        };
        const magic = {
            Image: "ReplaceableTextures/CommandButtons/BTNspell_nature_abolishmagic",
            Text: "abc"
        }

        let debugInfo = 0;
        print(debugInfo++)
        // Fire Blast <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(1, 2, {
            Name: 'Fire Blast',
            Description: "Instantly deal moderate fire damage to the last targeted enemy.|n|n|cffffd9b3Cast time: Instant|r|n|cffffd9b3Cooldown 6s|r",
            Icon: 'spell_fire_fireball',
            Dependency: { down: 1 },
            OnActivate: (e) => fireBlast.AddToUnit(this.unit),
        });
        print(debugInfo++)
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Scorch <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(1, 0, {
            Name: "Scorch",
            Description: "Scorch the last targeted enemy with fire damage.|n|n|cffffd9b3Cast time: 2 sec.",
            Icon: 'SoulBurn',
            OnActivate: (e) => {
            }
        });
        print(debugInfo++)
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Pyroblast <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(3, 0, {
            Name: "Pyroblast",
            Description: "Hurls an immense fiery boulder that causes high Fire damage.|n|n|cffffd9b3Cast time: 4 sec.",
            Icon: 'Spell_Fire_Fireball02',
            OnActivate: (e) => {
            }
        });

        print(debugInfo++)
        // Firestarter
        builder.AddTalent(0, 1, {
            Name: "Firestarter",
            Description: "Scorch is castable while moving and attacking.",
            Icon: 'spell_fire_playingwithfire',
            Dependency: { right: 3 },
        });

        print(debugInfo++)
        // Improved Scorch
        builder.AddMultirankTalent(1, 1, 3, lvl => {
            let bonus = 8
            return {
                Name: "Improved Scorch",
                Description:  `Your Scorch has ${lvl*10}% increased chance to critically strike.`,
                Icon:  'SoulBurn',
                Dependency: { down: 1 }
            }
        });

        print(debugInfo++)
        // Ignite
        builder.AddMultirankTalent(3, 1, 3, lvl => {
            return {
                Name: "Ignite",
                Description: `Your target burns for an additional ${lvl*15}% of the total direct damage caused by your autoattack, Fire Blast, Scorch, Pyroblast and Flamestrike over 9 sec. If this effect is reapplied, any remaining damage will be added to the new Ignite.`,
                Icon: 'Incinerate',
                Dependency: { down: 1 }
            }
        });

        print(debugInfo++)
        // Wildfire
        builder.AddTalent(2, 1, {
            Name: "Wildfire",
            Description: "Every 2 sec, your Ignites may spread to another nearby enemy.",
            Icon: 'ability_mage_worldinflames',
            Dependency: { right: 1 }
        });

        print(debugInfo++)
        // Hot Streak
        builder.AddTalent(3, 2, {
            Name: "Hot Streak",
            Description: "Two critical strikes within 3 sec will make your next Pyroblast within 6.0 sec instant cast.",
            Icon: 'ability_mage_hotstreak',
            Dependency: { down: 1 }
        });

        print(debugInfo++)
        // Impact
        builder.AddMultirankTalent(1, 3, 4, lvl => {
            let bonus = 8
            return {
                Name: "Impact",
                Description:  `Your Fire Blast has ${lvl*25}% increased chance to critically strike.`,
                Icon:  'WallOfFire',
                Dependency: { "down": 1 }
            };
        });

        print(debugInfo++)
        // Faster Blaster
        builder.AddTalent(2, 3, {
            Name: "Faster Blaster",
            Description: "Fire Blast is castable while moving and castable while casting other spells.",
            Icon: 'IncinerateWoW',
            Dependency: { left: 1 }
        });

        print(debugInfo++)
        // Improved Hot Streak
        builder.AddTalent(3, 3, {
            Name: "Improved Hot Streak",
            Description: "Pyroblast cast with Hot Streak! causes double the normal Ignite damage.",
            Icon: 'ability_mage_hotstreak',
            Dependency: { down: 1 },
        });
            
        print(debugInfo++)
        // Critical Mass
        builder.AddMultirankTalent(0, 3, 3, lvl => {
            return {
                Name: "Critical Mass",
                Description:  `Your spells have ${lvl*5}% increased chance to critically strike.`,
                Icon:  'ability_mage_firestarter',
            }
        });

        // Only need to this if some talents start with certain rank
        // this.SaveTalentRankState()
    }


    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Can use these methods inside Activate/Deactivate/Allocate/Deallocate/Requirements functions

    // Returns unit that owns the talent tree
    // static GetEventUnit(nothing returns unit
    // thistype.GetEventUnit()

    // Returns talent object that is being resolved
    // static GetEventTalent(nothing returns STKTalent_Talent
    // thistype.GetEventTalent()

    // Returns rank of the talent that is being activated
    // static GetEventRank(nothing returns integer
    // thistype.GetEventRank()

    // Returns "this"
    // static GetEventTalentTree(nothing returns TalentTree
    // thistype.GetEventTalentTree()

    // Needs to be called within Requirements function to disable the talent
    // static SetTalentRequirementsResult(string requirements {
    // thistype.SetTalentRequirementsResult("8 litres of milk",

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    Activate_CallSheep(e: ActivationEvent): void {
        // let u = thistype.GetEventUnit()
        // CreateUnit(GetOwningPlayer(u), 'nshe', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    }

    Activate_CallFlyingSheep(e: ActivationEvent) {
        // let unit u = thistype.GetEventUnit()
        // CreateUnit(GetOwningPlayer(u), 'nshf', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    }

    // static Activate_GainApprentice(nothing {
    //     let unit u = thistype.GetEventUnit()
    //     CreateUnit(GetOwningPlayer(u), 'hpea', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    // }

    // static Activate_Gain2Guards(nothing {
    //     let unit u = thistype.GetEventUnit()
    //     CreateUnit(GetOwningPlayer(u), 'hfoo', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //     CreateUnit(GetOwningPlayer(u), 'hfoo', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    // }

    // static Activate_ComingOfTheLambs(nothing {
    //     let unit u = thistype.GetEventUnit()
    //     let integer i = thistype.GetEventRank()
    //     loop
    //         exitwhen i <= 0
    //         CreateUnit(GetOwningPlayer(u), 'nshe', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //         CreateUnit(GetOwningPlayer(u), 'nshf', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //         i = i - 1
    //     endloop
    // }

    // static Activate_CallOfTheWilds(nothing {
    //     let unit u = thistype.GetEventUnit()
    //     let integer i = 0
    //     loop
    //         exitwhen i > 5
    //         CreateUnit(Player(PLAYER_NEUTRAL_AGGRESSIVE), 'nwlt', GetUnitX(u), GetUnitY(u), GetRandomDirectionDeg())
    //         i = i + 1
    //     endloop
    // }

    // static IsEnumUnitSheepFilter(nothing returns boolean
    //     return GetUnitTypeId(GetFilterUnit()) == 'nshe' or GetUnitTypeId(GetFilterUnit()) == 'nshf'
    // }

    // Requirement_CallOfTheWilds() {
    //     let unit u = thistype.GetEventUnit()
    //     let group g = CreateGroup()
    //     GroupEnumUnitsInRange(g, GetUnitX(u), GetUnitY(u), 5000, Filter((e) => this.IsEnumUnitSheepFilter))
    //     if (CountUnitsInGroup(g) < 8) then
    //         thistype.SetTalentRequirementsResult("8 nearby sheep",
    //     }
    // }
}