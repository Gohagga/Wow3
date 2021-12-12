import { AbilityEventType } from "./AbilityEventType";
import { AbilityEvent } from "./event-models/AbilityEvent";
import { AbilityFinishEvent } from "./event-models/AbilityFinishEvent";

export interface IAbilityEventHandler {

    OnAbilityCast(abilityId: number, callback: (e: AbilityEvent) => void): void;

    OnAbilityEffect(abilityId: number, callback: (e: AbilityEvent) => boolean): void;

    OnAbilityEnd(abilityId: number, callback: (e: AbilityEvent) => void): void;

    OnAbilityFinished(abilityId: number, callback: (e: AbilityFinishEvent) => void): void;

    OnAbilitySuccess(abilityId: number, callback: (e: AbilityEvent) => void): void;

    Raise(type: AbilityEventType, abilityId: number): void;
}