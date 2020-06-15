import { BaseScoreCalculator } from "./BaseScoreCalculator";
import { Board } from "./Board";
import { Edge } from "../common/Enums";
import { LakeMeasurer } from "./TileVisitor";

export class LakeExpansionScoreCalculator extends BaseScoreCalculator{
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
        const lakeScores: number[] = [];
        const countedLakeTiles = {};
        const lakeTiles = this.board.GetTilesOfType(Edge.lake);
        const lakeMeasurer = new LakeMeasurer(this.board, countedLakeTiles);
        for(let i = 0; i < lakeTiles.length; i++){
            const lakeTile = lakeTiles[i];
            if(lakeTile && !countedLakeTiles.hasOwnProperty(lakeTile.GetTileId())){
                lakeScores.push(lakeMeasurer.MeasureLake(lakeTile));
            }
        }
        this.expansionScore = Math.min.apply(undefined, lakeScores);
    }
}