export interface Wc3AbilityData {

    codeId: string,

    name: string,

    tooltip?: string,
}

export interface Wc3ToggleAbility extends Wc3AbilityData {
    nameOn: string,
    tooltipOn?: string
}