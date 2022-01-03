import { Unit } from "w3ts";
import { Talent, TalentData } from "../Models/Talent";

export interface ITalentBuilder {
    NextRank: (next: TalentData) => ITalentBuilder,
    Talent: Talent
}
