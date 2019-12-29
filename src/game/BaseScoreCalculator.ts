import { Board } from "./Board";
import { ScoreDTO } from "../common/DTO/ScoreDTO";

export class BaseScoreCalculator{
    
    private board: Board;
    private finalScore: ScoreDTO;
    private exitScore: number = 0;
    private longestRailScore: number = 0;
    private longestRoadScore: number = 0;
    private centerScore: number = 0;
    private errorScore: number = 0;
    private expansionScore: number = 0; 

    constructor(board: Board){
        this.board = board;
        this.score();
    }

    public GetScore(): ScoreDTO{
        return this.finalScore;
    }

    private score(): void{
        this.scoreExitPoints();
        this.scoreLongestRoadPoints();
        this.scoreLongestRailPoints();
        this.scoreCenterPoints();
        this.scoreErrorPoints();
        this.createScoreDTO();
    }

    private createScoreDTO(): void{
        this.finalScore = new ScoreDTO(this.exitScore, this.longestRailScore, this.longestRoadScore, this.centerScore, this.errorScore, this.expansionScore);
    }

    /**
     * Awards points for each "network" of exits. In each network (connected rails and road), the points are calculated via the formula:
     * ((# of Exits in network) - 1) * 4
     */
    private scoreExitPoints(): void{

    }

    /**
     * Awards 1 point for each tile in the longest continuous section of road.
     */
    private scoreLongestRoadPoints(): void{

    }

    /** 
     * Awards 1 point for each tile in the longest continuous section of rail.
     */
    private scoreLongestRailPoints(): void{

    }

    /**
     * Awards 1 point for each tile placed in the center of the board. The center is defined as all squares more than 2 squares from an edge. 
     */
    private scoreCenterPoints(): void{
        const boardWidth = this.board.GetPlayableBoardWidth();
        const boardHeight = this.board.GetPlayableBoardHeight();
        for(var i = 2; i < boardWidth - 2; i++){
            for(var j = 2; j < boardHeight - 2; j++){
                const tile = this.board.GetTile(i, j);
                if(tile !== undefined){
                    this.centerScore++;
                }
            }
        }
    }

    /**
     * Deducts 1 point for each edge of a tile that doesn't connect to a wall or a matching edge type.
     * Does not deduct points for lakes or meteors since they don't have connection requirements.
     */
    private scoreErrorPoints(): void{

    }
}