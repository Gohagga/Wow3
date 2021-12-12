import { IDelayedTargetEffect } from "./IDelayedTargetEffect";

export const enum TargetType {
    Unit,
    Point,
    Instant,
}

export interface IDummyAbilityFactory {

    // SingleTargetDelayedSpell(point: Coords, target: Unit): void;

    // MultiTargetDelayedSpell(point: Coords, ): void;

    // MultiTargetDelayedSpell(): void;

    // CreateSingleDelayedDamageEffect(targetType: TargetType, dummySpellId: number, order: number): number;

    // CreateInstantEffect(targetType: TargetType, dummySpellId: number, order: number): number;

    // CreateMultiDelayedDamageEffect(targetType: TargetType, dummySpellId: number, order: number, timeout: number): number;

    /**
     * If duration is null, custom effect only resolves once. Otherwise it resolves for every unit it hits until 'duration' seconds pass.
     * @param duration Amount of seconds after which the projectile will be cleaned up.
     */
     CreateDelayedTargetEffect<ContextType>(dummyAbilityId: number, orderId: number, duration?: number): IDelayedTargetEffect<ContextType>;

    CreateDelayedPointEffect(dummySpellId: number, order: number, timeout?: number): number;

    CreateDelayedPointEffect(dummySpellId: number, order: number, timeout?: number): number;

    CreateDelayedInstantEffect(dummySpellId: number, order: number, timeout?: number): number;
}

