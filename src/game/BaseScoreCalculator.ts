import { Board } from "./Board";
import { ScoreDTO } from "../common/DTO/ScoreDTO";
import { PlayableBaseTile } from "./tiles";
import { EdgeMatchingStatus } from "../common/Enums";
import { PositionValidator } from "../common/PositionValidator";
import { ExitNetworkLabeler } from "./TileVisitor";
import { LongestRoadDetector, LongestRailDetector } from "./LongestPathDetector";

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
        this.exitScore = 0;
        const exitDictionary = {};
        const exitNetworkLabeler = new ExitNetworkLabeler(this.board);
        const exits = this.board.GetExits();
        for(const exit of exits){
            const exitNetworkId = exit.GetNetworkId();
            if(exitNetworkId !== undefined){
                let exitCount = exitDictionary[exitNetworkId];
                if(exitCount === undefined){
                    exitDictionary[exitNetworkId] = 1;
                }
                else{
                    exitDictionary[exitNetworkId] = (exitCount + 1);
                }
            }
        }

        for(const networkId in exitDictionary){
            const exitCount = exitDictionary[networkId];
            const networkScore = (exitCount -1) * 4;
            this.exitScore += networkScore;
        }
    }

    /**
     * Awards 1 point for each tile in the longest continuous section of road.
     */
    private scoreLongestRoadPoints(): void{
        const longestRoadDetector = new LongestRoadDetector(this.board);
        this.longestRoadScore = longestRoadDetector.GetLongestPath();
    }

    /** 
     * Awards 1 point for each tile in the longest continuous section of rail.
     */
    private scoreLongestRailPoints(): void{
        const longestRailDetector = new LongestRailDetector(this.board);
        this.longestRailScore = longestRailDetector.GetLongestPath();
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
        const boardWidth = this.board.GetPlayableBoardWidth();
        const boardHeight = this.board.GetPlayableBoardHeight();
        for(var i = 0; i < boardWidth; i++){
            for(var j = 0; j < boardHeight; j++){
                const tile = this.board.GetTile(i, j);
                if(tile !== undefined){
                    this.checkTileForErrors(tile);
                }
            }
        }
    }

    private checkTileForErrors(tile: PlayableBaseTile):void {
        let matchingStatus: EdgeMatchingStatus;
        //Check up
        const aboveTile = this.board.GetTileAbove(tile);
        const aboveTileEdge = aboveTile && aboveTile.GetBottomEdge();
        matchingStatus = PositionValidator.ValidateEdges(tile.GetTopEdge(), aboveTileEdge);
        this.tallyErrorPoints(matchingStatus);
        
        //Check right
        const rightTile = this.board.GetTileRight(tile);
        const rightTileEdge = rightTile && rightTile.GetLeftEdge();
        matchingStatus = PositionValidator.ValidateEdges(tile.GetRightEdge(), rightTileEdge);
        this.tallyErrorPoints(matchingStatus);
        
        //Check Down
        const belowTile = this.board.GetTileBelow(tile);
        const belowTileEdge = belowTile && belowTile.GetTopEdge();
        matchingStatus = PositionValidator.ValidateEdges(tile.GetBottomEdge(), belowTileEdge);
        this.tallyErrorPoints(matchingStatus);
        
        //Check Left
        const leftTile = this.board.GetTileLeft(tile);
        const leftTileEdge = leftTile && leftTile.GetRightEdge();
        matchingStatus = PositionValidator.ValidateEdges(tile.GetLeftEdge(), leftTileEdge);
        this.tallyErrorPoints(matchingStatus);
        
    }

    /**
     * Tallies error points for a given edge matching status. Tallies -1 point for an open 
     * since there is only 1 tile so the error point will only be counted once. Tallies -0.5 points 
     * for a mismatch since the mismatch will be counted twice.
     * @param matchingStatus The matching status points are being tallied for.
     */
    private tallyErrorPoints(matchingStatus: EdgeMatchingStatus): void{
        if(matchingStatus === EdgeMatchingStatus.open){
            this.errorScore--;
        }
        else if(matchingStatus === EdgeMatchingStatus.mismatch){
            this.errorScore -= 0.5;
        }
    }
}