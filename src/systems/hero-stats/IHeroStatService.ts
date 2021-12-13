import { Unit } from "w3ts";
import { HeroStat } from "./HeroStat";

export interface IHeroStatService {

    UpdateStat<T extends number = number>(unit: Unit, stat: HeroStat, value: T): void;

    GetStat<T extends number = number>(unit: Unit, stat: HeroStat): T;

    DoWithModifiedStat<T extends number = number>(unit: Unit, stat: HeroStat, value: T, action: () => void): void;
}