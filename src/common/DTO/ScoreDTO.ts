/**
 * Represents the end of game score. 
 */
export class ScoreDTO{
    public ExitScore: number;
    public LongestRailScore: number;
    public LongestRoadScore: number;
    public CenterSquareScore: number;
    public ErrorScore: number;
    public ExpansionScore: number;
    public get TotalScore(): number{
        return this.ExitScore
            + this.LongestRailScore
            + this.LongestRoadScore
            + this.CenterSquareScore
            + this.ErrorScore
            + this.ExpansionScore;
    }

    constructor(exitScore: number, longestRailScore: number, longestRoadScore: number, centerSquareScore: number, errorScore: number, expansionScore: number = 0){
        this.ExitScore = exitScore;
        this.LongestRailScore = longestRailScore;
        this.LongestRoadScore = longestRoadScore;
        this.CenterSquareScore = centerSquareScore;
        this.ErrorScore = errorScore;
        this.ExpansionScore = expansionScore;
    }
}