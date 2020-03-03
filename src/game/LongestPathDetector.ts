import { BaseTile, EdgeBaseTile, RiverExpansionTile, WallEdgeTile } from "./tiles";
import { Edge } from "../common/Enums";
import { Board } from "./Board";

export class LongestPathDetector{
    protected edgeType: Edge;
    protected board: Board;
    //Every tile that needs to have a DFS run.
    protected tilesToCheck: BaseTile[];

    //Tiles seen on the current path
    protected tilesSeen: string[];

    //Longest path found so far.
    protected currentLongestPath: number;

    constructor(edgeType: Edge, board: Board){
        this.edgeType = edgeType;
        this.board = board;
        this.tilesToCheck = this.board.GetTilesOfType(this.edgeType);
        this.currentLongestPath = -1;
    }

    /** Score the longest path and return the score. */
    public Score(): number{
        this.findLongestPath();
        return this.currentLongestPath;
    }

    /** Gets the length of the longest path */
    public GetLongestPath(): number{
        return this.currentLongestPath;
    }

    protected findLongestPath(): void{
        for(const tileToCheck of this.tilesToCheck){
            //Reset DFS tracking
            this.tilesSeen = [];

            this.visitNextTile(tileToCheck);
        }
    }

    protected visitNextTile(tile: BaseTile): void{
        const tilesToVisit: BaseTile[] = [];
        this.tilesSeen.push(tile.GetTileId());
        this.addTilesToVisitList(tile, tilesToVisit);
        for(const tileToVisit of tilesToVisit){
            this.visitNextTile(tileToVisit);
        }
        if(this.tilesSeen.length > this.currentLongestPath){
            this.currentLongestPath = this.tilesSeen.length;
        }
        this.tilesSeen.pop();
    }

    protected addTilesToVisitList(tile: BaseTile, tilesToVisit: BaseTile[]): void{
        //Check top tile
        const topEdge = tile.GetTopEdge();
        if(topEdge === this.edgeType){
            const topTile = this.board.GetTileAbove(tile);
            if(topTile !== undefined 
                && !(topTile instanceof EdgeBaseTile)
                && topTile.GetBottomEdge() === this.edgeType
                && this.tilesSeen.indexOf(topTile.GetTileId()) < 0
            )
            {
                tilesToVisit.push(topTile);
            }
        }
        
        //Check right tile
        const rightEdge = tile.GetRightEdge();
        if(rightEdge === this.edgeType){
            const rightTile = this.board.GetTileRight(tile);
            if(rightTile !== undefined 
                && !(rightTile instanceof EdgeBaseTile)
                && rightTile.GetLeftEdge() === this.edgeType
                && this.tilesSeen.indexOf(rightTile.GetTileId()) < 0
            )
            {
                tilesToVisit.push(rightTile);
            }
        }

        //Check bottom tile
        const bottomEdge = tile.GetBottomEdge();
        if(bottomEdge === this.edgeType){
            const bottomTile = this.board.GetTileBelow(tile);
            if(bottomTile !== undefined 
                && !(bottomTile instanceof EdgeBaseTile)
                && bottomTile.GetTopEdge() === this.edgeType
                && this.tilesSeen.indexOf(bottomTile.GetTileId()) < 0
            )
            {
                tilesToVisit.push(bottomTile);
            }
        }

        //Check left tile
        const leftEdge = tile.GetLeftEdge();
        if(leftEdge === this.edgeType){
            const leftTile = this.board.GetTileLeft(tile);
            if(leftTile !== undefined 
                && !(leftTile instanceof EdgeBaseTile)
                && leftTile.GetRightEdge() === this.edgeType
                && this.tilesSeen.indexOf(leftTile.GetTileId()) < 0
            )
            {
                tilesToVisit.push(leftTile);
            }
        }
    } 
}

export class LongestRoadDetector extends LongestPathDetector{
    constructor(board: Board){
        super(Edge.road, board);
    }
}

export class LongestRailDetector extends LongestPathDetector{
    constructor(board: Board){
        super(Edge.rail, board);
    }
}

export class BestScoringRiverDetector extends LongestPathDetector{
    private highestRiverScore: number = -1;

    constructor(board: Board){
        super(Edge.river, board);
    }

    /** Scores the best river and returns the score. */
    public Score(): number{
        this.findLongestPath();
        return this.highestRiverScore;
    }

    /** Gets the score of the best river. */
    public GetBestRiverScore(): number{
        return this.highestRiverScore;
    }


    protected visitNextTile(tile: BaseTile): void{
        const tilesToVisit: BaseTile[] = [];
        this.tilesSeen.push(tile.GetTileId());
        this.addTilesToVisitList(tile, tilesToVisit);
        for(const tileToVisit of tilesToVisit){
            this.visitNextTile(tileToVisit);
        }

        const currentRiverScore = this.getCurrentRiverScore();
        if(currentRiverScore > this.highestRiverScore){
            this.highestRiverScore = currentRiverScore;
        }
        
        this.tilesSeen.pop();
    }

    private getCurrentRiverScore(): number{
        let riverScore = this.tilesSeen.length;
        if(this.isRiverConnectedToWall(this.tilesSeen[0])
        && this.isRiverConnectedToWall(this.tilesSeen[this.tilesSeen.length - 1]))
        {
            riverScore += 3;
        }

        return riverScore;
    }

    private isRiverConnectedToWall(tileId: string): boolean{
        const tile = this.board.GetTileById(tileId);
        if(tile instanceof RiverExpansionTile){
            if(tile.GetTopEdge() === Edge.river){
                const aboveTile = this.board.GetTileAbove(tile);
                if(aboveTile instanceof WallEdgeTile){
                    return true;
                }
            }

            if(tile.GetRightEdge() === Edge.river){
                const rightTile = this.board.GetTileRight(tile);
                if(rightTile instanceof WallEdgeTile){
                    return true;
                }
            }

            if(tile.GetBottomEdge() === Edge.river){
                const belowTile = this.board.GetTileBelow(tile);
                if(belowTile instanceof WallEdgeTile){
                    return true;
                }
            }

            if(tile.GetLeftEdge() === Edge.river){
                const leftTile = this.board.GetTileLeft(tile);
                if(leftTile instanceof WallEdgeTile){
                    return true;
                }
            }
        }
        return false;
    }
}