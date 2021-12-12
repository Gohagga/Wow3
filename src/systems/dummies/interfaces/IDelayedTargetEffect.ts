import { Unit } from "w3ts/handles/unit";
import { Coords } from "../../coord/Coords";

export interface IDelayedTargetEffect<ContextType> {
    Cast(origin: Coords, target: Unit, level: number, context: ContextType, effect: (context: ContextType) => void): void;
}