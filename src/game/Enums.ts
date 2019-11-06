/** The orientation of tiles.
 *  The numeric value of the enum represents the number of
 *  clockwise turns needed to produce the position from the
 *  tile's starting 'up' position. 'up' position defined as 
 *  the position the tile appears on the playing board.
 */
export enum Orientation{
    up = 0,
    right = 1,
    down = 2,
    left = 3
}

/** The types of edges tiles can have. */
export enum Edge{
    empty,
    road,
    rail,
    river,
    lake,
    meteor,
    lava
}

/** The types of tiles that can be played */
export enum TileType{
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