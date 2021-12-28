import { Unit } from "w3ts";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";
import { Moonfire } from "./Moonfire";
import { Sunfire } from "./Sunfire";

type NaturalBalanceUnitData = {
    moonfire: boolean,
    sunfire: boolean,    
}

export class NaturalBalance implements IUnitConfigurable<NaturalBalanceUnitData> {

    public unitConfig = new UnitConfigurable<NaturalBalanceUnitData>(() => ({
        moonfire: false,
        sunfire: false,
    }));

    constructor(
        private readonly moonfire: Moonfire,
        private readonly sunfire: Sunfire,
    ) {
    }

    SwapToSolar(caster: Unit): void {

        let data = this.GetUnitConfig(caster);
        if (data.sunfire && caster.getAbilityLevel(this.moonfire.id)) {
            this.sunfire.AddToUnit(caster);
            this.moonfire.RemoveFromUnit(caster);
        }
    }

    SwapToLunar(caster: Unit): void {

        let data = this.GetUnitConfig(caster);
        if (data.moonfire && caster.getAbilityLevel(this.sunfire.id)) {
            this.moonfire.AddToUnit(caster);
            this.sunfire.RemoveFromUnit(caster);
        }
    }
    
    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (this: void, config: NaturalBalanceUnitData) => void): void {
        this.unitConfig.UpdateUnitConfig(unit, cb);
    }
}