import { ITalentBuilder } from "../Interfaces/ITalentBuilder";
import { ITalentTreeBuilder } from "../Interfaces/ITalentTreeBuilder";
import { TalentData } from "./Talent";
import { TalentTree } from "./TalentTree";

export class TalentTreeBuilder implements ITalentTreeBuilder {
    
    constructor(private tree: TalentTree) {
    }

    get title() { return this.tree.title; }
    set title(v: string) { this.tree.title = v; }
    get talentPoints() { return this.tree.talentPoints; }
    set talentPoints(v: number) { this.tree.talentPoints = v; }
    get backgroundImage() { return this.tree.backgroundImage; }
    set backgroundImage(v: string | null) { this.tree.backgroundImage = v; }

    AddTalent(x: number, y: number, talentData: TalentData): ITalentBuilder {
        this.tree.AddTalent(x, y, talentData);
        return {
            NextRank: (next: TalentData) => this.AddTalent(x, y, next)
        }
    }

    SetColumnsRows(columns: number, rows: number): void {
        this.tree.SetColumnsRows(columns, rows);
    }

    AddMultirankTalent(x: number, y: number, maxRank: number, talentDataBuilder: (level: number) => TalentData): ITalentTreeBuilder {
        
        for (let i = 1; i <= maxRank; i++) {
            this.AddTalent(x, y, talentDataBuilder(i));
        }
        return this;
    }
}