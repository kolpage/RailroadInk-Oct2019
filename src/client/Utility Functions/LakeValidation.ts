import { Orientation, TileType, Edge } from "../../common/Enums";
import { ITile, IGameTile } from "../Models/GameTile";
import { GetSideForTileAtOrientation } from "./TileDefinition";

/* IMPORTANT: Any code in this file must not change state!!! */

export function AreBothTypesLake(tileTypeA: TileType, tileTypeB: TileType) {
    return IsLakeTile(tileTypeA) && IsLakeTile(tileTypeB);
}

export function IsSideLake(side: Orientation, gameTile: ITile){
    return GetSideForTileAtOrientation(side, gameTile.Type, gameTile.TileOrientation) === Edge.lake;
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

export function AreSidesLakes(gameTileA: ITile, gameTileASide: Orientation, gameTileB: ITile, gameTileBSide: Orientation){
    const IsSideALake = GetSideForTileAtOrientation(gameTileASide, gameTileA.Type, gameTileA.TileOrientation);
    const IsSideBLake = GetSideForTileAtOrientation(gameTileBSide, gameTileB.Type, gameTileB.TileOrientation);

    return IsSideALake && IsSideBLake;
}

export function CanTileFlood(centerTile: ITile, topTile: ITile, rightTile: ITile, bottomTile: ITile, leftTile: ITile){
    if(centerTile.Type !== TileType.Empty && centerTile.Type !== TileType.LakeFull) { return false; }

    const TopTileIsLake = IsSideLake(Orientation.down, topTile);
    const RightTileIsLake = IsSideLake(Orientation.left, rightTile);
    const BottomTileIsLake = IsSideLake(Orientation.up, bottomTile);
    const LeftTileIsLake = IsSideLake(Orientation.right, leftTile);

    return [TopTileIsLake, RightTileIsLake, BottomTileIsLake, LeftTileIsLake].filter(Boolean).length >= 3;
}