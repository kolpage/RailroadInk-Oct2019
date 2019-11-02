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

/** The types of tiles that can be played.
 *  String values of enum used for testbench and debug saving.
 */
export enum TileType{
    RailTurn = "0",
    RailThreeWay = "1",
    RailStraight = "2",
    RoadTurn = "3",
    RoadThreeWay = "4",
    RoadStraight = "5",
    Overpass = "6",
    StationStraight = "7",
    StationTurn = "8",
    StationTurnMirror = "9",
    SpecialThreeRoadOneRail = "A",
    SpecialThreeRailOneRoad = "B",
    SpecialAllRoad = "C",
    SpecialAllRail = "D",
    SpecialRoadRailAdjacent = "E",
    SpecialRoadRailAcross = "F"
}