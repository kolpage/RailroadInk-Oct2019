import { BaseTile, EdgeBaseTile } from "./tiles";
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
        this.findLongestPath();
    }

    /** Gets the length of the longest path */
    public GetLongestPath(): number{
        return this.currentLongestPath;
    }

    private findLongestPath(): void{
        for(const tileToCheck of this.tilesToCheck){
            //Reset DFS tracking
            this.tilesSeen = [];

            this.visitNextTile(tileToCheck);
        }
    }

    private visitNextTile(tile: BaseTile): void{
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

    private addTilesToVisitList(tile: BaseTile, tilesToVisit: BaseTile[]): void{
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

export class LongestRiverDetector extends LongestPathDetector{
    constructor(board: Board){
        super(Edge.river, board);
    }
}