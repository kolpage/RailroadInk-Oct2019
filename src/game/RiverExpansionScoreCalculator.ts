import { BaseScoreCalculator } from "./BaseScoreCalculator";
import { Board } from "./Board";
import { BestScoringRiverDetector } from "./LongestPathDetector";

export class RiverExpansionScoreCalculator extends BaseScoreCalculator{
    constructor(){
        super();
    }

    /** Scores the given board. Should only be called once per score calc. */
    public ScoreBoard(board: Board): void{
        super.ScoreBoard(board);
        this.scoreExpansionPoints();
    }

    /** Scores the expansion points. */
    private scoreExpansionPoints(){
        const bestScoringRiverDetector = new BestScoringRiverDetector(this.board);
        this.expansionScore = bestScoringRiverDetector.Score();
    }
}