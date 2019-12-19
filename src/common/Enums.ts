/** The orientation of tiles.
 *  The numeric value of the enum represents the number of
 *  clockwise turns needed to produce the position from the
 *  tile's starting 'up' position. 'up' position defined as 
 *  the position the tile appears on the playing board.
 */
export enum Orientation{
    up,
    right,
    down,
    left,
    _length // TODO: This is hacky...probably create s function on the enum object instead
}

/** The types of edges tiles can have. */
export enum Edge{
    empty, // blank edge of tile
    road,
    exitRoad, // road on the edge of board
    rail,
    exitRail, // rail on the edge of board
    river,
    lake,
    meteor,
    lava,
    any // Wall that is ok touching anything
}

/** The types of tiles that can be played */
export enum TileType{
    Empty = -1,
    RailEdge,
    RoadEdge,
    WallEdge,
    RailTurn,
    RailThreeWay,
    RailStraight,
    RoadTurn,
    RoadThreeWay,
    RoadStraight,
    Overpass,
    StationStraight,
    StationTurn,
    StationTurnMirror,
    SpecialThreeRoadOneRail,
    SpecialThreeRailOneRoad,
    SpecialAllRoad,
    SpecialAllRail,
    SpecialRoadRailAdjacent,
    SpecialRoadRailAcross
}

/** Matching statuses of edge checks */
export enum EdgeMatchingStatus{
    valid, //Tile edges follow all rules and don't incur point penalties
    mismatch, //Tile edges follow all rules but will incur error points.
    open, //Tile edges follow all rules but incur error points if this way at end of game.
    invalid, //Tile edges don't follow all rules and are not allowed to be played. 
}

/** Reason a move is invalid */
export enum TilePlacementResult{
    valid,
    violatesGameRules,
    invalidCoordinates,
    alreadyTileAtLocation,
    tileNotAvailable
}

/** Reason a turn is invalid */
export enum TurnInvalidReason{
    requiredDiceNotPlayed,
    noActiveTurns,
    tilesMustBeConnectedToExistingTiles
}