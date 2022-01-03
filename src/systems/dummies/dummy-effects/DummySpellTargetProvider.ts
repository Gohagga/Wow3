// import { Unit } from "w3ts";

// export type IDummySpellProviderConfig = {
//     dummyOwningPlayer: number,
//     dummyUnitId: number,
// }

// export class DummySpellProvider {

//     private readonly config: IDummySpellProviderConfig;
//     private readonly dummy: Unit;
//     private readonly ability: ability;

//     constructor(svc: {
//         config: IDummySpellProviderConfig
//     },
//         private readonly order: number | string,
//         abilityId: number,
//         level: number = 1)
//     {
//         // print("Registerinng this", svc.config.dummyOwningPlayer, svc.config?.dummyUnitId, order, abilityId, level);
//         this.config = svc.config;
//         this.dummy = new Unit(svc.config.dummyOwningPlayer, svc.config.dummyUnitId, 0, 0, 0, 0);
//         this.dummy.addAbility(abilityId);
//         this.dummy.setAbilityLevel(abilityId, level);
//         this.dummy.removeGuardPosition();
//         this.ability = this.dummy.getAbility(abilityId);
//         // print("Registered");
//     }

//     Modify(cb: (ability: ability) => void): void {
//         cb(this.ability);
//     };

//     CastAt(target: Unit): void {
//         this.dummy.setPosition(target.x, target.y);
//         this.dummy.issueTargetOrder(this.order, target);
//     }

//     CastAtTargets(targets: Unit[]): void {
//         for (let t of targets) {
//             this.dummy.setPosition(t.x, t.y);
//             this.dummy.issueTargetOrder(this.order, t);
//         }
//     }
// }