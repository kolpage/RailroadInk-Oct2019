import { TileType, Edge, Orientation } from "../../common/Enums";
import { IGameTile } from "../Models/GameTile";
import { Tile } from "../Components/Tile-MinimalStyle";

/* IMPORTANT: Any code in this file must be functional (i.e. no state change)!!! */

export function GetSideForTile(side: Orientation, gameTile: IGameTile){
    const tileSides = GetSidesForTileType(gameTile.Type);
    return tileSides[side];
}

export function GetSidesForTileType(tileType: TileType){
    switch(tileType){
        case TileType.RailTurn: return [Edge.rail, Edge.empty, Edge.empty, Edge.rail];
        case TileType.RailThreeWay: return [Edge.rail, Edge.rail, Edge.empty, Edge.rail];
        case TileType.RailStraight: return [Edge.rail, Edge.empty, Edge.rail, Edge.empty];
        case TileType.RoadTurn: return [Edge.road, Edge.empty, Edge.empty, Edge.road];
        case TileType.RoadThreeWay: return [Edge.road, Edge.road, Edge.empty, Edge.road];
        case TileType.RoadStraight: return [Edge.road, Edge.empty, Edge.road, Edge.empty];
        case TileType.Overpass: return [Edge.road, Edge.rail, Edge.road, Edge.rail];
        case TileType.StationStraight: return [Edge.rail, Edge.empty, Edge.road, Edge.empty];
        case TileType.StationTurn: return [Edge.rail, Edge.empty, Edge.empty, Edge.road];
        case TileType.StationTurnMirror: return [Edge.rail, Edge.road, Edge.empty, Edge.empty];
        case TileType.SpecialThreeRoadOneRail: return [Edge.road, Edge.road, Edge.rail, Edge.road];
        case TileType.SpecialThreeRailOneRoad: return [Edge.road, Edge.rail, Edge.rail, Edge.rail];
        case TileType.SpecialAllRoad: return [Edge.road, Edge.road, Edge.road, Edge.road];
        case TileType.SpecialAllRail: return [Edge.rail, Edge.rail, Edge.rail, Edge.rail];
        case TileType.SpecialRoadRailAdjacent: return [Edge.road, Edge.rail, Edge.rail, Edge.road];
        case TileType.SpecialRoadRailAcross: return [Edge.road, Edge.rail, Edge.road, Edge.rail];
        case TileType.LakeOneSide: return [Edge.empty, Edge.empty, Edge.lake, Edge.empty];
        case TileType.LakeTwoSides: return [Edge.empty, Edge.lake, Edge.lake, Edge.empty];
        case TileType.LakeThreeSides: return [Edge.lake, Edge.lake, Edge.empty, Edge.lake];
        case TileType.LakeFull: return [Edge.lake, Edge.lake, Edge.lake, Edge.lake];
        case TileType.LakeRoad: return [Edge.road, Edge.empty, Edge.lake, Edge.empty];
        case TileType.LakeRail: return [Edge.rail, Edge.empty, Edge.lake, Edge.empty];
        case TileType.LakeRoadRail: return [Edge.rail, Edge.lake, Edge.lake, Edge.road]; 
        case TileType.LakeRoadRailMirror: return [Edge.road, Edge.lake, Edge.lake, Edge.rail]; 
        default: return [Edge.empty, Edge.empty, Edge.empty, Edge.empty];
    }
}

export function GetSideForTileAtOrientation(side: Orientation, type: TileType, orientation: Orientation){
    const tileSides = GetSidesForTileType(type);
    const offset = side - orientation;
    const sidePosition = (offset < 0) ? Orientation._length + offset : offset;
    return tileSides[sidePosition];
}
