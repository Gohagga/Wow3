export const enum DamageType {

    Untyped = 1 << 0,

    /**Damage that is caused by strain overlfow.*/
    Strain = 1 << 1,

    /**Deals strain damage based on damage dealt.*/
    Bludgeon = 1 << 2,
    /**On critical strike applies or increases a permanent bleed effect.*/
    Slashing = 1 << 3,
    /**Deals 100% bonus damage on critical strike.*/
    Piercing = 1 << 4,

    Fire = 1 << 5,
    Arcane = 1 << 6,
}