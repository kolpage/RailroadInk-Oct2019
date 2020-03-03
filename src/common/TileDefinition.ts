import { TileType, Edge, Orientation } from "./Enums";

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

export function IsLakeTile(tileType: TileType){
    return tileType === TileType.LakeOneSide
        || tileType === TileType.LakeTwoSides
        || tileType === TileType.LakeThreeSides
        || tileType === TileType.LakeFull
        || tileType === TileType.LakeRoad
        || tileType === TileType.LakeRail
        || tileType === TileType.LakeRoadRail;
}

export function GetSideForTileAtOrientation(side: Orientation, type: TileType, orientation: Orientation){
    const tileSides = GetSidesForTileType(type);
    const offset = side - orientation;
    const sidePosition = (offset < 0) ? Orientation._length - offset : offset;
    return tileSides[sidePosition];
}