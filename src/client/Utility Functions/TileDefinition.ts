import { TileType, Edge, Orientation } from "../../common/Enums";
import { IGameTile } from "../Models/GameTile";

/* IMPORTANT: Any code in this file must be functional (i.e. no state change)!!! */

export function GetSideForTile(side: Orientation, gameTile: IGameTile){
    const tileSides = GetSidesForTileType(gameTile.Type);
    return tileSides[side];
}

export function GetSidesForTileType(tileType: TileType){
    switch(tileType){
        case TileType.LakeOneSide: return [Edge.empty, Edge.empty, Edge.lake, Edge.empty];
        case TileType.LakeTwoSides: return [Edge.empty, Edge.lake, Edge.lake, Edge.empty];
        case TileType.LakeThreeSides: return [Edge.lake, Edge.lake, Edge.empty, Edge.lake];
        case TileType.LakeFull: return [Edge.lake, Edge.lake, Edge.lake, Edge.lake];
        case TileType.LakeRoad: return [Edge.road, Edge.empty, Edge.lake, Edge.empty];
        case TileType.LakeRail: return [Edge.rail, Edge.empty, Edge.lake, Edge.empty];
        case TileType.LakeRoadRail: return [Edge.rail, Edge.lake, Edge.lake, Edge.road]; 
        default: return [Edge.empty, Edge.empty, Edge.empty, Edge.empty];
    }
}

export function GetSideForTileAtOrientation(side: Orientation, type: TileType, orientation: Orientation){
    const tileSides = GetSidesForTileType(type);
    const offset = side - orientation;
    const sidePosition = (offset < 0) ? Orientation._length + offset : offset;
    return tileSides[sidePosition];
}