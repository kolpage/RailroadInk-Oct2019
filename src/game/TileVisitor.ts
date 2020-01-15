import { BaseTile, TileHelpers, EdgeBaseTile, WallEdgeTile, RoadEdgeTile, RailEdgeTile, PlayableBaseTile, OverpassTile } from "./tiles";
import { Edge, EdgeMatchingStatus } from "../common/Enums";
import { Board } from "./Board";
import { PositionValidator } from "../common/PositionValidator";

export interface IVisitInfo{
    tile: BaseTile,
    railVisited: boolean,
    roadVisited: boolean
}

export interface ITileToVisit{
    tile: BaseTile,
    hailingEdge: Edge
}

export abstract class TileVisitor{
    private visitedTiles: { [tileId: string]: IVisitInfo };
    private currentTile: BaseTile | undefined;
    private hailingEdge: Edge | undefined;
    protected visitList: ITileToVisit[];
    protected board: Board;

    constructor(board: Board, startTile?: BaseTile){
        this.board = board;
        this.Reset(startTile);
    }

    public Reset(startTile?: BaseTile){
        this.visitedTiles = {};
        this.visitList = [];
        this.currentTile = startTile;
        this.hailingEdge = undefined;
        this.addTilesToVisitList();
    }

    /** Visits the next tile. Logs visit info on arrival. Returns tile visited */
    public VisitNextTile(): BaseTile | undefined{
        if(this.visitList.length > 0){
            const tileToVisit = this.visitList.shift();
            this.currentTile = tileToVisit.tile;
            this.hailingEdge = tileToVisit.hailingEdge;
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

    public GetHailingEdge(): Edge{
        return this.hailingEdge;
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

export class ExitNetworkLabeler extends TileVisitor{
    private currentNetworkId = 0;
    constructor(board: Board){
        super(board, undefined);
        this.labelExitsWithNetwork()
    }

    private labelExitsWithNetwork():void{
        const exitTiles = this.board.GetExits();
        for(const exitTile of exitTiles){
            if(exitTile.GetNetworkId() === undefined){
                this.traverseNetwork(exitTile);
                this.currentNetworkId++;
            }
        }
    }

    protected logVisitInfo(): void{
        super.logVisitInfo();
        const currentTile = this.GetCurrentTile();
        if(currentTile instanceof RoadEdgeTile
            || currentTile instanceof RailEdgeTile){
            currentTile.SetNetworkId(this.currentNetworkId);
        }
        else if(currentTile instanceof OverpassTile){
            const visitInfo = this.GetVisitInfoForTile(currentTile.GetTileId());
            const hailingEdge = this.GetHailingEdge();
            if(hailingEdge === Edge.road){
                visitInfo.roadVisited = true;
            }
            else if(hailingEdge === Edge.rail){
                visitInfo.railVisited = true;
            }
        }
    }

    protected addTilesToVisitList(): void{
        const currentTile = this.GetCurrentTile();
        const hailingEdge = this.GetHailingEdge();
        if(currentTile === undefined){
            return;
        }
        const isStation = (currentTile instanceof PlayableBaseTile && currentTile.IsStation());

        //Add top tile
        const topEdge = currentTile.GetTopEdge();
        if(this.isTraversibleEdgeType(topEdge)){
            if(isStation || this.isSameEdgeType(topEdge, hailingEdge)){
                const aboveTile = this.board.GetTileAbove(currentTile);
                if(aboveTile !== undefined 
                    && PositionValidator.ValidateEdges(topEdge, aboveTile.GetBottomEdge()) === EdgeMatchingStatus.valid
                ){
                    this.addTileToVisitList(aboveTile, topEdge, aboveTile.GetBottomEdge());
                }
            }
        }

        //Add right tile
        const rightEdge = currentTile.GetRightEdge();
        if(this.isTraversibleEdgeType(rightEdge)){
            if(isStation || this.isSameEdgeType(rightEdge, hailingEdge)){
                const rightTile = this.board.GetTileRight(currentTile);
                if(rightTile !== undefined
                    && PositionValidator.ValidateEdges(rightEdge, rightTile.GetLeftEdge()) === EdgeMatchingStatus.valid
                ){
                    this.addTileToVisitList(rightTile, rightEdge, rightTile.GetLeftEdge());
                }
            }
        }

        //Add bottom tile
        const bottomEdge = currentTile.GetBottomEdge();
        if(this.isTraversibleEdgeType(bottomEdge)){
            if(isStation || this.isSameEdgeType(bottomEdge, hailingEdge)){
                const belowTile = this.board.GetTileBelow(currentTile);
                if(belowTile !== undefined
                    && PositionValidator.ValidateEdges(bottomEdge, belowTile.GetTopEdge()) === EdgeMatchingStatus.valid
                ){
                    this.addTileToVisitList(belowTile, bottomEdge, belowTile.GetTopEdge());
                }
            }
        }

        //Add left tile
        const leftEdge = currentTile.GetLeftEdge();
        if(this.isTraversibleEdgeType(leftEdge)){
            if(isStation || this.isSameEdgeType(leftEdge, hailingEdge)){
                const leftTile = this.board.GetTileLeft(currentTile);
                if(leftTile !== undefined
                    && PositionValidator.ValidateEdges(leftEdge, leftTile.GetRightEdge()) === EdgeMatchingStatus.valid
                ){
                    this.addTileToVisitList(leftTile, leftEdge, leftTile.GetRightEdge());
                }
            }
        }
    }

    private addTileToVisitList(tileToAdd: BaseTile, hailingEdge: Edge, receivingEdge: Edge): void{
        //Is there a tile there?
        if(tileToAdd === undefined){
            return;
        }

        //Is the tile connected in a valid way?
        if(PositionValidator.ValidateEdges(hailingEdge, receivingEdge) !== EdgeMatchingStatus.valid){
            return;
        }

        //Is the tile already going to be traversed from this type of hailing edge?
        const tileInVisitList = this.visitList.find(tileToVisit => tileToVisit.tile === tileToAdd);
        if(tileInVisitList !== undefined){
            if(tileToAdd instanceof OverpassTile){
                if(hailingEdge === tileInVisitList.hailingEdge){
                    return;
                }
            }
            else{
                return;
            }
        }

        //Has the tile already been visited from this type of hailing edge?
        const visitInfo = this.GetVisitInfoForTile(tileToAdd.GetTileId());
        if(visitInfo !== undefined){
            if(tileToAdd instanceof OverpassTile){
                if(hailingEdge === Edge.road){
                    if(visitInfo.roadVisited){
                        //Overpass tile already visited from road 
                        return;
                    }
                }
                else if(hailingEdge === Edge.rail){
                    if(visitInfo.railVisited){
                        //Overpass tile already visited from rail
                        return;
                    }
                }
                else{
                    //I don't know how you got here, but we shouldn't add the tile.
                    return;
                }
            }
            else{
                //Tile already visited.
                return;
            }
        }

        //Tile should be added to visit list
        this.visitList.push({tile: tileToAdd, hailingEdge: hailingEdge});
    }

    private traverseNetwork(startTile: BaseTile): void{
        const startingEdgeType = this.getStartingEdge(startTile);
        this.visitList.push({tile: startTile, hailingEdge: startingEdgeType});
        while(this.visitList.length > 0){
            this.VisitNextTile();
        }
    }

    private getStartingEdge(tile: BaseTile): Edge | undefined{
        if(tile instanceof RoadEdgeTile){
            return Edge.road;
        }
        if(tile instanceof RailEdgeTile){
            return Edge.rail;
        }
    }

    private isSameEdgeType(edgeOne: Edge, edgeTwo: Edge): boolean{
        if(edgeOne === edgeTwo){
            return true;
        }
        if(edgeOne === Edge.exitRoad){
            return edgeTwo === Edge.road;
        }
        if(edgeTwo === Edge.exitRoad){
            return edgeOne === Edge.road;
        }
        if(edgeOne === Edge.exitRail){
            return edgeTwo === Edge.rail;
        }
        if(edgeTwo === Edge.exitRail){
            return edgeOne === Edge.rail;
        }
        return false;
    }

    private isTraversibleEdgeType(edge: Edge): boolean{
        switch(edge){
            case Edge.road:
            case Edge.exitRoad:
            case Edge.rail:
            case Edge.exitRail:
                return true;
            default:
                return false;
        }
    }
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
        return (tile !== undefined
             && tile.GetTurn() < currentTurnNumber
        );
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
        if(aboveTile !== undefined){
            this.addTileToVisitList(topEdge, aboveTile.GetBottomEdge(), aboveTile);
        }

        //Add right tile
        const rightEdge = currentTile.GetRightEdge();
        const rightTile = this.board.GetTileRight(currentTile);
        if(rightTile !== undefined){
            this.addTileToVisitList(rightEdge, rightTile.GetLeftEdge(), rightTile);
        }

        //Add bottom tile
        const bottomEdge = currentTile.GetBottomEdge();
        const belowTile = this.board.GetTileBelow(currentTile);
        if(belowTile !== undefined){
            this.addTileToVisitList(bottomEdge, belowTile.GetTopEdge(), belowTile);
        }

        //Add left tile
        const leftEdge = currentTile.GetLeftEdge();
        const leftTile = this.board.GetTileLeft(currentTile);
        if(leftTile !== undefined){
            this.addTileToVisitList(leftEdge, leftTile.GetRightEdge(), leftTile);
        }
    }

    private addTileToVisitList(currentTileEdge: Edge, neighborEdge: Edge, neighborTile?: BaseTile): void{
        if(this.doesTileEdgeCountForContinuity(currentTileEdge) 
        && neighborTile !== undefined
        && PositionValidator.ValidateEdges(currentTileEdge, neighborEdge) === EdgeMatchingStatus.valid
        && this.visitList.find(tileToVisit => tileToVisit.tile === neighborTile) === undefined
        && this.GetVisitInfoForTile(neighborTile.GetTileId()) === undefined
        ){
            this.visitList.push({tile: neighborTile, hailingEdge: Edge.any});
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