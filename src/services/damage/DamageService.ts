import { Unit } from "w3ts";
import { Log } from "../../Log";
import { AttackType } from "../../systems/damage/AttackType";
import { DamageEvent } from "../../systems/damage/DamageEvent";
import { DamageType } from "../../systems/damage/DamageType";
import { IWowDamageEventHandler } from "../../systems/damage/IWowDamageEventHandler";
import { IDamageEventHandler } from "../../systems/damage/library/IDamageEventHandler";
import { DamageDisplayManager } from "../damage-display/DamageDisplayManager";
import { IDamageService } from "./IDamageService";

export class DamageService implements IDamageService {

    constructor(
        private damageEventHandler: IWowDamageEventHandler,
        private damageDisplayManager: DamageDisplayManager
    ) { }

    CreateDamageEvent({
        source,
        target,
        damage,
        attackType = AttackType.Untyped,
        damageType = DamageType.Untyped,
        isCrit = false
    }: {
        source: Unit,
        target: Unit,
        damage: number,
        strain?: number,
        attackType?: AttackType,
        damageType?: DamageType,
        isCrit?: boolean
    }): DamageEvent {

        let count = 0;
        if ((damageType & DamageType.Bludgeon) == DamageType.Bludgeon) count++;
        if ((damageType & DamageType.Slashing) == DamageType.Slashing) count++;
        if ((damageType & DamageType.Piercing) == DamageType.Piercing) count++;


        let event = new DamageEvent({
            source: source,
            targetUnit: target,
            damageType: damageType,
            damageTypeCount: count,
            attackType: attackType,
            damage: damage,
            isCrit: isCrit
        });
        return event;
    }

    UnitDamageTarget(source: Unit, target: Unit, amount: number, attackType: AttackType, damageType: DamageType, isCrit: boolean = false): void {
        
        Log.Info("Called UnitDamageTarget");
        let event = this.CreateDamageEvent({
            source,
            target,
            damage: amount,
            attackType,
            damageType,
            isCrit
        });

        event = this.damageEventHandler.Register(event);
        event.damage = math.ceil(event.damage);
        source.damageTarget(event.targetUnit.handle, event.damage, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNIVERSAL, WEAPON_TYPE_WHOKNOWS);
        this.damageDisplayManager.DisplayDamageEvent(event);
    }

    UnitHealTarget(source: Unit, target: Unit, amount: number, attackType: AttackType, damageType: DamageType, isCrit: boolean = false): void {
        let event = this.CreateDamageEvent({
            source,
            target,
            damage: -amount,
            damageType,
            attackType,
            isCrit
        });

        event = this.damageEventHandler.Register(event);
        let targetUnit = event.targetUnit.handle;
        event.damage = math.floor(event.damage + 0.5);
        SetWidgetLife(targetUnit, GetWidgetLife(targetUnit) - event.damage);
    }
}