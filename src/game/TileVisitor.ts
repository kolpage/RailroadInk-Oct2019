import { BaseTile, TileHelpers, EdgeBaseTile, WallEdgeTile } from "./tiles";
import { Edge } from "../common/Enums";
import { Board } from "./Board";

export interface IVisitInfo{
    tile: BaseTile,
    railVisited: boolean,
    roadVisited: boolean
}

export abstract class TileVisitor{
    private visitedTiles: { [tileId: string]: IVisitInfo };
    private currentTile: BaseTile | undefined;
    protected visitList: BaseTile[];
    protected board: Board;

    constructor(board: Board, startTile?: BaseTile){
        this.board = board;
        this.Reset(startTile);
    }

    public Reset(startTile?: BaseTile){
        this.visitedTiles = {};
        this.visitList = [];
        this.currentTile = startTile;
        this.addTilesToVisitList();
    }

    /** Visits the next tile. Logs visit info on arrival. Returns tile visited */
    public VisitNextTile(): BaseTile | undefined{
        if(this.visitList.length > 0){
            this.currentTile = this.visitList.shift();
            this.addTilesToVisitList();
            this.logVisitInfo();
            return this.currentTile;
        }
        return undefined;
    }

    /** Gets the tile the visitor is currently at. */
    public GetCurrentTile(): BaseTile{
        return this.currentTile;
    }

    /** Returns the visit info object for a given tile id. Returns undefined if no visit info for tile id. */
    public GetVisitInfoForTile(tileId: string): IVisitInfo | undefined{
        return this.visitedTiles[tileId];
    }

    /** Returns true if the tile has ever been visited by this tile visitor */
    public WasTileVisited(tileId: string): boolean{
        return !!this.visitedTiles[tileId];
    }

    /** Logs visit info for the current tile. Always call base function. */
    protected logVisitInfo(): void{
        const tileId = this.currentTile.GetTileId();
        if(this.visitedTiles[tileId] === undefined){
            this.visitedTiles[tileId] = {
                tile: this.currentTile,
                railVisited: false,
                roadVisited: false
            };
        }
    }

    /** Adds the possible tiles that can be visited from the current tile to the visit list */
    protected abstract addTilesToVisitList(): void;
}

export class TileContinuityValidator extends TileVisitor{
    constructor(board: Board){
        super(board, undefined);
    }

    /** Verifies that a tile is connected to existing tiles or an edge. */
    public Validate(tileToValidate: BaseTile): boolean{
        const tileTurn = tileToValidate.GetTurn();
        this.Reset(tileToValidate);
        while(this.visitList.length > 0){
            const currentTile = this.VisitNextTile();
            if(currentTile === undefined){
                return false; //Quit, we're done.
            }
            if(this.isValidContinuityConnection(currentTile, tileTurn)){
                return true;
            }
        }
        return false;
    }

    private isValidContinuityConnection(tile: BaseTile, currentTurnNumber: number){
        if(tile instanceof WallEdgeTile){
            return false;
        }
        return (tile !== undefined && tile.GetTurn() < currentTurnNumber);
    }

    /** Adds tiles to visit list that are connected on edges that count for continuity. */
    protected addTilesToVisitList(): void{
        const currentTile = this.GetCurrentTile();
        if(currentTile === undefined 
            || TileHelpers.IsEdgeTile(currentTile)
        ){
            return;
        }

        //Add top tile
        const topEdge = currentTile.GetTopEdge();
        const aboveTile = this.board.GetTileAbove(currentTile);
        this.addTileToVisitList(topEdge, aboveTile);

        //Add right tile
        const rightEdge = currentTile.GetRightEdge();
        const rightTile = this.board.GetTileRight(currentTile);
        this.addTileToVisitList(rightEdge, rightTile);

        //Add bottom tile
        const bottomEdge = currentTile.GetBottomEdge();
        const belowTile = this.board.GetTileBelow(currentTile);
        this.addTileToVisitList(bottomEdge, belowTile);

        //Add left tile
        const leftEdge = currentTile.GetLeftEdge();
        const leftTile = this.board.GetTileLeft(currentTile);
        this.addTileToVisitList(leftEdge, leftTile);
    }

    private addTileToVisitList(currentTileEdge: Edge, neighborTile?: BaseTile): void{
        if(this.doesTileEdgeCountForContinuity(currentTileEdge) 
        && neighborTile !== undefined
        && this.visitList.indexOf(neighborTile) === -1
        && this.GetVisitInfoForTile(neighborTile.GetTileId()) === undefined
        ){
            this.visitList.push(neighborTile);
        }
    }

    private doesTileEdgeCountForContinuity(edge: Edge): boolean{
        return (edge === Edge.road
        || edge === Edge.rail
        || edge === Edge.river
        || edge === Edge.lake
        || edge === Edge.lava
        );
    }
}