import { Orientation, Edge, TileType } from "../common/Enums";
import { Guid } from 'guid-typescript';

/** The base class for every tile. */
export class BaseTile{
    
    private readonly tileId: string;
    /** Turn number the tile was placed. Tiles placed during game setup have turn number 0 (Edges, volcanos). */
    private turn: number;
    private topEdge: Edge;
    private rightEdge: Edge;
    private bottomEdge: Edge;
    private leftEdge: Edge;

    constructor(edges: Edge[], turn: number){
        this.tileId = Guid.raw();
        this.turn = turn;
        this.topEdge = edges[0];
        this.rightEdge = edges[1];
        this.bottomEdge = edges[2];
        this.leftEdge = edges[3];
    }

    /** Gets the unique tile identifier */
    public GetTileId(): string{
        return this.tileId;
    }

    /** Gets the turn this tile was played. */
    public GetTurn(): number{
        return this.turn;
    }

    /** Gets the top edge of the tile. */
    public GetTopEdge(): Edge{
        return this.topEdge;
    }

    /** Gets the right edge of the tile. */
    public GetRightEdge(): Edge{
        return this.rightEdge;
    }

    /** Gets the bottom edge of the tile. */
    public GetBottomEdge(): Edge{
        return this.bottomEdge;
    }

    /** Gets the left edge of the tile. */
    public GetLeftEdge(): Edge{
        return this.leftEdge;
    }

    /** FOR DEBUG - prints out string representation of tile. */
    public ToString(): string{
        let output: string = "";
        output += "Tile identifier: " + this.GetTileId() + '\n';
        output += "Turn: " + this.GetTurn() + '\n';
        output += "Top Edge: " + Edge[this.GetTopEdge()] + '\n';
        output += "Right Edge: " + Edge[this.GetRightEdge()] + '\n';
        output += "Bottom Edge: " + Edge[this.GetBottomEdge()] + '\n';
        output += "Left Edge: " + Edge[this.GetLeftEdge()] + '\n';
        return output;
    }

    public GetTileType(): TileType | undefined{
        return undefined;
    }

    public GetAbbrName(): string{
        return "    ";
    }
}

/** Base class for tiles that can be played to the board. */
export class PlayableBaseTile extends BaseTile{
    private orientation: Orientation;
    private isStation: boolean;

    constructor(edges: Edge[], orientation: Orientation, turn: number, hasStation: boolean){
        TileHelpers.RotateEdgeArray(edges, orientation);
        super(edges, turn)
        this.orientation = orientation;
        this.isStation = hasStation;
    }

    /** Gets the orientation of the tile */
    public GetOrientation(): Orientation{
        return this.orientation;
    }

    /** Returns true if this is a station tile. All edges should be considered connected to the same network if a tile has a station. */
    public IsStation(): boolean{
        return this.isStation;
    }

    public ToString(): string{
        let output: string = "";
        output += super.ToString();
        output += "Orientation: " + Orientation[this.GetOrientation()] + '\n';
        output += "Is Station?: " + this.IsStation() + '\n';
        return output;
    }
}

export class EdgeBaseTile extends BaseTile{
    private networkId: number;

    constructor(edges: Edge[]){
        super(edges, 0); //All edge tiles have turn number 0.
    }

    /**
     * Allows network id to be set once. Network id tells what network this tile belongs to.
     * @param networkId The network id.
     */
    public SetNetworkId(networkId: number): void{
        if(this.networkId === undefined){
            this.networkId = networkId
        }
    }

    public GetNetworkId(): number{
        return this.networkId;
    }
}

export class RiverExpansionTile extends PlayableBaseTile {};

export class LakeExpansionTile extends PlayableBaseTile{};

/** Tile representing the rail turn piece. */
export class RailTurnTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.empty, Edge.rail];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RailTurn;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RLTN";
    }
}

/** Tile representing the three way rail piece. */
export class RailThreeWayTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.rail, Edge.empty, Edge.rail];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RailThreeWay;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RL3W";
    }
}

/** Tile representing the straight rail piece. */
export class RailStraightTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.rail, Edge.empty];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RailStraight;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RLST";
    }
}

/** Tile representing the road turn piece. */
export class RoadTurnTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.empty, Edge.empty, Edge.road];
        super(initEdges, orientation, turn, false);
    }
    
    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RoadTurn;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RDTN";
    }
}

/** Tile representing the three way road piece. */
export class RoadThreeWayTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.road, Edge.empty, Edge.road];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RoadThreeWay;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RD3W";
    }
}

/** Tile representing the straight road piece. */
export class RoadStraightTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.empty, Edge.road, Edge.empty];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RoadStraight;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RDST";
    }
}

/** Tile representing the overpass piece. Rails and roads do not connect. */
export class OverpassTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.road, Edge.rail];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.Overpass;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "OVPS";
    }
}

/** Tile representing the straight station piece. */
export class StationStraightTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.road, Edge.empty];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.StationStraight;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "STST";
    }
}

/** Tile representing the turn station piece. */
export class StationTurnTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.empty, Edge.road];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.StationTurn;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "STTN";
    }
}

/** Tile representing the mirror turn station piece. */
export class StationTurnMirrorTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.road, Edge.empty, Edge.empty];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.StationTurnMirror;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "STTM";
    }
}

/** Tile representing the special 3 road 1 rail piece. */
export class SpecialThreeRoadOneRailTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.road, Edge.rail, Edge.road];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.SpecialThreeRoadOneRail;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "3D1L";
    }
}

/** Tile representing the special 3 rail 1 road piece. */
export class SpecialThreeRailOneRoadTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.rail, Edge.rail];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.SpecialThreeRailOneRoad;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "3L1D";
    }
}

/** Tile representing the special all road piece. */
export class SpecialAllRoadTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.road, Edge.road, Edge.road];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.SpecialAllRoad;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "4RDS";
    }
}

/** Tile representing the special all rail piece. */
export class SpecialAllRailTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.rail, Edge.rail, Edge.rail];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.SpecialAllRail;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "4RLS";
    }
}

/** Tile representing the piece with 2 roads and 2 rails next to each other. */
export class SpecialRoadRailAdjacentTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.rail, Edge.road];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.SpecialRoadRailAdjacent;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "DDLL";
    }
}

/** Tile representing the piece with 2 roads and 2 rails across from each other. */
export class SpecialRoadRailAcrossTile extends PlayableBaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.road, Edge.rail];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.SpecialRoadRailAcross;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "DLDL";
    }
}

/** Tile representing the piece with a straight river. */
export class RiverStraightTile extends RiverExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.river, Edge.empty, Edge.river, Edge.empty];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RiverStraight;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RVST";
    }
}

/** Tile representing the piece with a turn river. */
export class RiverTurnTile extends RiverExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.river, Edge.river, Edge.empty, Edge.empty];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RiverTurn;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RVTN";
    }
}

/** Tile representing the piece with a river and a road. */
export class RiverRoadBridgeTile extends RiverExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.river, Edge.road, Edge.river, Edge.road];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RiverRoadBridge;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RVRD";
    }
}

/** Tile representing the piece with a river and a rail. */
export class RiverRailBridgeTile extends RiverExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.river, Edge.rail, Edge.river, Edge.rail];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RiverRailBridge;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RVRL";
    }
}

/** Tile representing the piece with a lake on three sides. */
export class LakeThreeSidesTile extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.lake, Edge.lake, Edge.empty, Edge.lake];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeThreeSides;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LAK3";
    }
}

/** Tile representing the piece with a lake on two sides. */
export class LakeTwoSidesTile extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.empty, Edge.lake, Edge.lake, Edge.empty];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeTwoSides;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LAK2";
    }
}

/** Tile representing the piece with a lake on one side. */
export class LakeOneSideTile extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.empty, Edge.empty, Edge.lake, Edge.empty];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeOneSide;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LAK1";
    }
}

/** Tile representing the piece with a lake and a road. */
export class LakeRoadTile extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.empty, Edge.lake, Edge.empty];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeRoad;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LKRD";
    }
}

/** Tile representing the piece with a lake and a rail. */
export class LakeRailTile extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.lake, Edge.empty];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeRail;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LKRL";
    }
}

export class LakeFull extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.lake, Edge.lake, Edge.lake, Edge.lake];
        super(initEdges, orientation, turn, false);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeFull;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LKFL";
    }
}

/** Tile representing the piece with a lake, a road, a rail, and a station. */
export class LakeRoadRailTile extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.lake, Edge.lake, Edge.road];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeRoadRail;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LKDL";
    }
}

export class LakeRoadRailMirrorTile extends LakeExpansionTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.lake, Edge.lake, Edge.rail];
        super(initEdges, orientation, turn, true);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.LakeRoadRailMirror;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "LKMR";
    }
}

/** Represents a rail exit tile that can be connected to */
export class RailEdgeTile extends EdgeBaseTile{
    constructor(){
        const initEdges: Edge[] = [Edge.exitRail, Edge.exitRail, Edge.exitRail, Edge.exitRail];
        super(initEdges);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RailEdge;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RLEG";
    }
}

/** Represents a road exit tile that can be connected to */
export class RoadEdgeTile extends EdgeBaseTile{
    constructor(){
        const initEdges: Edge[] = [Edge.exitRoad, Edge.exitRoad, Edge.exitRoad, Edge.exitRoad];
        super(initEdges);
    }
    
    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.RoadEdge;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "RDEG";
    }
}

/** Represents a wall on the board that anything can be connected to. */
export class WallEdgeTile extends EdgeBaseTile{
    constructor(){
        const initEdges: Edge[] = [Edge.any, Edge.any, Edge.any, Edge.any];
        super(initEdges);
    }

    /** Gets the enum associated with this tile. */
    public GetTileType(): TileType | undefined{
        return TileType.WallEdge;
    }

    /** For debug only */
    public GetAbbrName(): string{
        return "WALL";
    }
}

export class TileHelpers{
    /** Rotates the edge array to match the orientation specified. 
     * @param edges The array of edges to rotate. The format of the array is expected to be [<Up Edge>, <Right Edge>, <Bottom Edge>, <Left Edge>].
     *              Method assumes edges is given in the "up" orientation.
     * @param orientation The orientation enum of the tile. Used to 'rotate' the edges array to the correct position.
    */
    public static RotateEdgeArray(edges: Edge[], orientation: Orientation): void{   
        if(orientation === Orientation.up){
            return;
        }

        const numberOfTimesToRotate: number = orientation;
        for(let i = 0; i < numberOfTimesToRotate; i++){
            edges.unshift(edges.pop());
        }
    }

    /**
     * Returns true if the tile is an edge tile.
     * @param tile The tile to check.
     */
    public static IsEdgeTile(tile: BaseTile): boolean{
        return tile instanceof EdgeBaseTile;
    }
}