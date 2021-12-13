import { Unit } from "w3ts/handles/unit";
import { AttackType } from "./AttackType";
import { DamageType } from "./DamageType";

export class DamageEvent {
    
    private _source: Unit;
    private _targetUnit: Unit;
    // private _targetWidget: Widget;
    private _damageType: DamageType;
    private _damageTypeCount: number;
    private _damage: number;
    private _isCrit: boolean;
    private _attackType: AttackType;

    constructor(data: {
        source: Unit,
        targetUnit: Unit,
        // targetWidget: Widget,
        damageType: DamageType,
        damageTypeCount: number,
        attackType: AttackType,
        damage: number,
        isCrit: boolean,
    }) { 
        this._source = data.source;
        this._targetUnit = data.targetUnit;
        this._damageType = data.damageType;
        this._damageTypeCount = data.damageTypeCount;
        this._attackType = data.attackType;
        this._damage = data.damage;
        this._isCrit = data.isCrit;
    }

    public get source(): Unit { return this._source; }
    public get targetUnit(): Unit { return this._targetUnit; }
    // public get targetWidget(): Widget { return this._targetWidget; }
    public get damageType(): DamageType { return this._damageType; }
    public get damageTypeCount(): number { return this._damageTypeCount; }
    public get attackType(): AttackType { return this._attackType; }
    public get damage(): number { return this._damage; }
    public get isCrit(): boolean { return this._isCrit; }

    public set damageType(v: DamageType) {
        this._damageType = v;
        // BlzSetEventDamageType(v);
    }

    public set damage(v: number) {
        this._damage = v;
    }

    public set isCrit(v: boolean) {
        this._isCrit = v;
    }
}