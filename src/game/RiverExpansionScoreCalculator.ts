import { BaseScoreCalculator } from "./BaseScoreCalculator";
import { Board } from "./Board";

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
        this.expansionScore = 0;
    }
}