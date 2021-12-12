import { Unit } from "w3ts";
import { Log } from "../../../Log";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { Wc3AbilityData } from "../../../systems/abilities/AbilityConfig";
import { AbilityEvent } from "../../../systems/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";

type FireBlastUnitData = {
    Damage: number,
    Range: number,
    Cost: number,
    Cooldown: number,
    Speed: number,
    CastableWhileMoving: boolean
}

export class FireBlast extends AbilityBase implements IUnitConfigurable<FireBlastUnitData> {

    public unitConfig = new UnitConfigurable<FireBlastUnitData>(() => { return {
        Damage: 20,
        Range: 1000,
        Cost: 13,
        Cooldown: 4.5,
        Speed: 1200,
        CastableWhileMoving: false
    }});

    constructor(
        data: Wc3AbilityData,
        private readonly abilityEventHandler: IAbilityEventHandler,
    ) {
        super(data);

        abilityEventHandler.OnAbilityEnd(this.id, e => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        Log.Info("Cast Fire blast");
    }
    
    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (config: FireBlastUnitData) => void): void {
        this.unitConfig.UpdateUnitConfig(unit, cb);
        this.UpdateUnitAbility(unit);
    }

    UpdateUnitAbility(unit: Unit) {
        print("Updating unit ability")
        const data = this.unitConfig.GetUnitConfig(unit);
        const dmg = string.format("%.2f", data.Damage);
        
        let tooltip = 
`Inflicts ${dmg} Fire damage to the last targeted enemy.

|cffffd9b3Cooldown ${data.Cooldown}s|r`

        if (data.CastableWhileMoving) 
            tooltip += "\n|cffffd9b3Castable while moving and while casting other spells.|r";

        this.UpdateUnitAbilityBase(unit, tooltip);
    }

}