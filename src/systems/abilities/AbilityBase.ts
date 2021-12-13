import { Unit } from "w3ts";
import { Log } from "../../Log";
import { ISkill } from "../skill-manager/ISkill";
import { Wc3AbilityData } from "./Wc3AbilityData";

export abstract class AbilityBase implements ISkill {

    public readonly id: number;
    public readonly codeId: string;
    public readonly name: string;
    public readonly orderId: number;

    constructor(data: Wc3AbilityData) {

        this.id = FourCC(data.codeId);
        this.codeId = data.codeId;
        this.name = data.name;
        this.orderId = data.orderId;

        if (!this.id) Log.Error(this.name, "Failed to translate Ability Id", data.codeId);
        
        BlzSetAbilityTooltip(this.id, data.name, 0);
        if (data.tooltip) BlzSetAbilityExtendedTooltip(this.id, data.tooltip, 0);
    }

    abstract UpdateUnitSkill(unit: Unit): void;

    protected UpdateUnitAbilityBase(unit: Unit, tooltip?: string, cost?: number, cooldown?: number) {
        let lvl = unit.getAbilityLevel(this.id) - 1;
        if (cost) unit.setAbilityManaCost(this.id, lvl, cost);
        if (cooldown) unit.setAbilityCooldown(this.id, lvl, cooldown);
        if (tooltip) BlzSetAbilityStringLevelField(unit.getAbility(this.id), ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, lvl, tooltip);
    }

    AddToUnit(unit: Unit): boolean {
        let added = unit.addAbility(this.id);
        if (added) this.UpdateUnitSkill(unit);
        return added;
    }

    RemoveFromUnit(unit: Unit): boolean {
        return unit.removeAbility(this.id);
    }
}