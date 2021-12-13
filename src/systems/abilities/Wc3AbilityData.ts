export interface Wc3AbilityData {

    codeId: string,

    name: string,

    orderId: number,
    
    tooltip?: string,
}

export interface Wc3ToggleAbility extends Wc3AbilityData {
    nameOn: string,
    tooltipOn?: string
}