import { Moonfire } from "Content/spells/balance-druid/Moonfire";
import { NaturalBalance } from "Content/spells/balance-druid/NaturalBalance";
import { Starfire } from "Content/spells/balance-druid/Starfire";
import { Sunfire } from "Content/spells/balance-druid/Sunfire";
import { Wrath } from "Content/spells/balance-druid/Wrath";
import { Unit } from "w3ts";
import { IHeroStatService } from "../../systems/hero-stats/IHeroStatService";
import { ISkillManager } from "../../systems/skill-manager/ISkillManager";
import { ITalentTreeBuilder } from "../../systems/talents/Interfaces/ITalentTreeBuilder";
import { ActivationEvent, Talent } from "../../systems/talents/Models/Talent";
import { TalentTree } from "../../systems/talents/Models/TalentTree";
import { TalentTreeBuilder } from "../../systems/talents/Models/TalentTreeBuilder";

export class BalanceDruid extends TalentTree {

    get talentPoints(): number {
        return this.ownerPlayer.getState(PLAYER_STATE_RESOURCE_LUMBER);
    }
    set talentPoints(value: number) {
        this.ownerPlayer.setState(PLAYER_STATE_RESOURCE_LUMBER, value)
    }

    constructor(
        unit: Unit,
        private readonly skillManager: ISkillManager,
        private readonly heroStatService: IHeroStatService,
        private readonly abilities: {
            wrath: Wrath,
            starfire: Starfire,
            moonfire: Moonfire,
            sunfire: Sunfire,
            naturalBalance: NaturalBalance
    }) {
        super(unit);
        this.Initialize(new TalentTreeBuilder(this));
    }

    public Initialize(builder: ITalentTreeBuilder): void {

        builder.SetColumnsRows(4, 7);
        builder.title = "Balance Druid";
        builder.talentPoints = 25;
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

        // Fire Blast <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // builder.AddTalent(1, 2, {
        //     Name: 'Fire Blast',
        //     Description: "Instantly deal moderate fire damage to the last targeted enemy.|n|n|cffffd9b3Cast time: Instant|r|n|cffffd9b3Cooldown 6s|r",
        //     Icon: 'spell_fire_fireball',
        //     Dependency: { down: 1 },
        //     OnActivate: (e) => this.skillManager.UnitAddSkill(this.unit, this.abilities.fireBlast),
        // });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Scorch <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(1, 0, {
            Name: "Starfire",
            Description: "Hurls an immense fiery boulder that causes high Fire damage.|n|n|cffffd9b3Cast time: 4 sec.",
            Icon: '_StarBlast',
            OnActivate: (e) => {
                this.skillManager.UnitAddSkill(this.unit, this.abilities.starfire)
                // this.abilities.fireball.AddToUnit(this.unit);
            }
        });
        // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        // Pyroblast <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        builder.AddTalent(3, 0, {
            Name: "Wrath",
            Description: "Scorch the last targeted enemy with fire damage.|n|n|cffffd9b3Cast time: 2 sec.",
            Icon: 'StarWand',
            OnActivate: (e) => this.skillManager.UnitAddSkill(this.unit, this.abilities.wrath),
        });

        builder.AddTalent(2, 0, {
            Name: 'Wrath, Starfire',
            IsLink: true,
            Dependency: { left: 1, right: 1 }
        });

        builder.AddTalent(2, 1, {
            Name: 'Natural Balance',
            Description: 'Lower casting time of Wrath and Starfire by 0.5 sec.\n\nCasting Wrath causes the druid to enter Solar mode giving these spells: Sunfire.\n\nAfter casting Starfire enter Lunar mode, changing to: Moonfire.,',
            Icon: 'ability_druid_manatree',
            Dependency: { down: 2 },
            OnActivate: (e) => {
                this.abilities.wrath.UpdateUnitConfig(this.unit, cb => cb.CastTime -= 0.5);
                this.abilities.starfire.UpdateUnitConfig(this.unit, cb => cb.CastTime -= 0.5);
            }
        })

        let moonfire: Talent;
        let sunfire: Talent;

        moonfire = builder.AddTalent(1, 1, {
            Name: "Moonfire",
            Description: "Scorch the last targeted enemy with fire damage.|n|n|cffffd9b3Cast time: 2 sec.",
            Icon: 'Starfall',
            Dependency: { down: 1 },
            OnActivate: (e) => {
                this.abilities.naturalBalance.UpdateUnitConfig(this.unit, cb => cb.moonfire = true);
                this.skillManager.UnitAddSkill(this.unit, this.abilities.moonfire);
            },
            OnAllocate: (e) => {
                sunfire.dependency = { down: 1, left: 1 };
            },
            OnDeallocate: (e) => {
                sunfire.dependency = { down: 1 };
            }
            // Requirements: (e) => {
            //     if (this.GetTalentTempStateXy(3, 1) != 0
            //         && this.GetTalentTempStateXy(2, 1) == 0)
            //         return [false, "Natural Balance"];

            //     return [true]
            // } 
        }).Talent;

        sunfire = builder.AddTalent(3, 1, {
            Name: "Sunfire",
            Description: "Scorch the last targeted enemy with fire damage.|n|n|cffffd9b3Cast time: 2 sec.",
            Icon: 'ability_mage_firestarter',
            Dependency: { down: 1 },
            OnActivate: (e) => {
                this.abilities.naturalBalance.UpdateUnitConfig(this.unit, cb => cb.sunfire = true);
                this.skillManager.UnitAddSkill(this.unit, this.abilities.sunfire);
            },
            OnAllocate: (e) => {
                moonfire.dependency = { down: 1, right: 1 };
            },
            OnDeallocate: (e) => {
                moonfire.dependency = { down: 1 };
            }
            // Requirements: (e) => {
            //     if (this.GetTalentTempStateXy(1, 1) != 0
            //         && this.GetTalentTempStateXy(2, 1) == 0)
            //         return [false, "Natural Balance"];

            //     return [true]
            // }
        }).Talent;

        // // Firestarter
        // builder.AddTalent(0, 1, {
        //     Name: "Firestarter",
        //     Description: "Scorch is castable while moving and attacking.",
        //     Icon: 'spell_fire_playingwithfire',
        //     Dependency: { right: 3 },
        //     OnActivate: (e) => {
        //         this.skillManager.UnitRemoveSkill(this.unit, this.abilities.scorch);
        //         this.skillManager.UnitAddSkill(this.unit, this.abilities.scorchFirestarter);
        //         this.abilities.scorchFirestarter.UpdateUnitConfig(this.unit, cb => cb.Firestarter = true);
        //     }
        // });

        // // Improved Scorch
        // builder.AddMultirankTalent(1, 1, 3, lvl => {
        //     let bonus = 8
        //     return {
        //         Name: "Improved Scorch",
        //         Description:  `Your Scorch has ${lvl*10}% increased chance to critically strike.`,
        //         Icon:  'SoulBurn',
        //         Dependency: { down: 1 },
        //         OnActivate: (e) => this.abilities.scorch.UpdateUnitConfig(this.unit, cb => cb.CritBonus = lvl * 0.1),
        //     }
        // });

        // // Ignite
        // builder.AddMultirankTalent(3, 1, 3, lvl => {
        //     return {
        //         Name: "Ignite",
        //         Description: `Your target burns for an additional ${lvl*15}% of the total direct damage caused by your autoattack, Fire Blast, Scorch, Pyroblast and Flamestrike over 9 sec. If this effect is reapplied, any remaining damage will be added to the new Ignite.`,
        //         Icon: 'Incinerate',
        //         Dependency: { down: 1 }
        //     }
        // });

        // // Wildfire
        // builder.AddTalent(2, 1, {
        //     Name: "Wildfire",
        //     Description: "Every 2 sec, your Ignites may spread to another nearby enemy.",
        //     Icon: 'ability_mage_worldinflames',
        //     Dependency: { right: 1 }
        // });

        // // Hot Streak
        // builder.AddTalent(3, 2, {
        //     Name: "Hot Streak",
        //     Description: "Two critical strikes within 3 sec will make your next Pyroblast within 6.0 sec instant cast.",
        //     Icon: 'ability_mage_hotstreak',
        //     Dependency: { down: 1 },
        //     OnActivate: (e) => this.abilities.hotStreak.AddToUnit(this.unit),
        // });

        // // Impact
        // builder.AddMultirankTalent(1, 3, 4, lvl => {
        //     let bonus = 8
        //     return {
        //         Name: "Impact",
        //         Description:  `Your Fire Blast has ${lvl*25}% increased chance to critically strike.`,
        //         Icon:  'WallOfFire',
        //         Dependency: { "down": 1 },
        //         OnActivate: (e) => this.abilities.fireBlast.UpdateUnitConfig(this.unit, cb => cb.BonusCrit = lvl * 0.25)
        //     };
        // });

        // // Faster Blaster
        // builder.AddTalent(2, 3, {
        //     Name: "Faster Blaster",
        //     Description: "Fire Blast is castable while moving and castable while casting other spells.",
        //     Icon: 'IncinerateWoW',
        //     Dependency: { left: 1 },
        //     OnActivate: (e) => {
        //         this.abilities.pyroblast.UpdateUnitConfig(this.unit, cb => cb.NonInterruptOrderId = this.abilities.fireBlast.id);
        //         this.abilities.scorch.UpdateUnitConfig(this.unit, cb => cb.NonInterruptOrderId = this.abilities.fireBlast.id);
        //     },
        // });

        // // Improved Hot Streak
        // builder.AddTalent(3, 3, {
        //     Name: "Improved Hot Streak",
        //     Description: "Pyroblast cast with Hot Streak! causes double the normal Ignite damage.",
        //     Icon: 'ability_mage_hotstreak',
        //     Dependency: { down: 1 },
        // });
            
        // // Critical Mass
        // builder.AddMultirankTalent(0, 3, 3, lvl => {
        //     return {
        //         Name: "Critical Mass",
        //         Description:  `Your spells have ${lvl*5}% increased chance to critically strike.`,
        //         Icon:  'ability_mage_firestarter',
        //         OnActivate: (e) => this.heroStatService.UpdateStat(this.unit, HeroStat.CritChance, 0.05),
        //     }
        // });

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