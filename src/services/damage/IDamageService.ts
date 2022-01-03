import { Unit } from "w3ts";
import { AttackType } from "../../systems/damage/AttackType";
import { DamageEvent } from "../../systems/damage/DamageEvent";
import { DamageType } from "../../systems/damage/DamageType";

export interface IDamageService {

    UnitDamageTarget(source: Unit, target: Unit, amount: number, attackType: AttackType, types: DamageType, isCrit?: boolean): DamageEvent;

    UnitHealTarget(source: Unit, target: Unit, amount: number, attackType: AttackType, types: DamageType, isCrit?: boolean): DamageEvent;
}