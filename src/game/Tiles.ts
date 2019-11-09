import { Orientation, Edge } from "../common/Enums";

/** The base class for every tile. */
export class BaseTile{
    private orientation: Orientation;
    private turn: number;
    private topEdge: Edge;
    private rightEdge: Edge;
    private bottomEdge: Edge;
    private leftEdge: Edge;
    private isStation: boolean

    constructor(edges: Edge[], orientation: Orientation, turn: number, hasStation: boolean){
        TileHelpers.RotateEdgeArray(edges, orientation);
        this.topEdge = edges[0];
        this.rightEdge = edges[1];
        this.bottomEdge = edges[2];
        this.leftEdge = edges[3]
        this.orientation = orientation;
        this.turn = turn;
        this.isStation = hasStation;
    }

    /** Gets the orientation of the tile */
    public GetOrientation(): Orientation{
        return this.orientation;
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

    /** Returns true if this is a station tile. All edges should be considered connected to the same network if a tile has a station. */
    public IsStation(): boolean{
        return this.isStation;
    }

    public ToString(): string{
        let output: string;
        output += "Orientation: " + Orientation[this.GetOrientation()] + '\n';
        output += "Turn: " + this.GetTurn() + '\n';
        output += "Top Edge: " + Edge[this.GetTopEdge()] + '\n';
        output += "Right Edge: " + Edge[this.GetRightEdge()] + '\n';
        output += "Bottom Edge: " + Edge[this.GetBottomEdge()] + '\n';
        output += "Left Edge: " + Edge[this.GetLeftEdge()] + '\n';
        output += "Is Station?: " + this.IsStation() + '\n';
        return output;
    }
}

/** Tile representing the rail turn piece. */
export class RailTurnTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.empty, Edge.rail];
        super(initEdges, orientation, turn, false);
    }
}

/** Tile representing the three way rail piece. */
export class RailThreeWayTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.rail, Edge.empty, Edge.rail];
        super(initEdges, orientation, turn, false);
    }
}

/** Tile representing the straight rail piece. */
export class RailStraightTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.rail, Edge.empty];
        super(initEdges, orientation, turn, false);
    }
}

/** Tile representing the road turn piece. */
export class RoadTurnTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.empty, Edge.empty, Edge.road];
        super(initEdges, orientation, turn, false);
    }
}

/** Tile representing the three way road piece. */
export class RoadThreeWayTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.rail, Edge.empty, Edge.rail];
        super(initEdges, orientation, turn, false);
    }
}

/** Tile representing the straight road piece. */
export class RoadStraightTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.road, Edge.empty, Edge.road];
        super(initEdges, orientation, turn, false);
    }
}

/** Tile representing the overpass piece. Rails and roads do not connect. */
export class OverpassTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.road, Edge.rail];
        super(initEdges, orientation, turn, false);
    }
}

/** Tile representing the straight station piece. */
export class StationStraightTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.road, Edge.empty];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the turn station piece. */
export class StationTurnTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.empty, Edge.empty, Edge.road];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the mirror turn station piece. */
export class StationTurnMirrorTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.road, Edge.empty, Edge.empty];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the special 3 road 1 rail piece. */
export class SpecialThreeRoadOneRailTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.road, Edge.rail, Edge.road];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the special 3 rail 1 road piece. */
export class SpecialThreeRailOneRoadTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.rail, Edge.rail];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the special all road piece. */
export class SpecialAllRoadTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.road, Edge.road, Edge.road];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the special all rail piece. */
export class SpecialAllRailTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.rail, Edge.rail, Edge.rail, Edge.rail];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the piece with 2 roads and 2 rails next to each other. */
export class SpecialRoadRailAdjacentTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.rail, Edge.road];
        super(initEdges, orientation, turn, true);
    }
}

/** Tile representing the piece with 2 roads and 2 rails across from each other. */
export class SpecialRoadRailAcrossTile extends BaseTile{
    constructor(orientation: Orientation, turn: number){
        const initEdges: Edge[] = [Edge.road, Edge.rail, Edge.road, Edge.rail];
        super(initEdges, orientation, turn, true);
    }
}

class TileHelpers{
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
}