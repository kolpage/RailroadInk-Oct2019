import * as Tiles from "./tiles";
import { TileType, Orientation } from "../common/Enums";

export class TileFactory{
    constructor(){ }

    public CreateTile(tileType: TileType, turn: number, orientation: Orientation): Tiles.PlayableBaseTile{
        switch(tileType){
            case TileType.RailTurn: return new Tiles.RailTurnTile(orientation, turn);
            case TileType.RailThreeWay: return new Tiles.RailThreeWayTile(orientation, turn);
            case TileType.RailStraight: return new Tiles.RailStraightTile(orientation, turn);
            case TileType.RoadTurn: return new Tiles.RoadTurnTile(orientation, turn);
            case TileType.RoadThreeWay: return new Tiles.RoadThreeWayTile(orientation, turn);
            case TileType.RoadStraight: return new Tiles.RoadStraightTile(orientation, turn);
            case TileType.Overpass: return new Tiles.OverpassTile(orientation, turn);
            case TileType.StationStraight: return new Tiles.StationStraightTile(orientation, turn);
            case TileType.StationTurn: return new Tiles.StationTurnTile(orientation, turn);
            case TileType.StationTurnMirror: return new Tiles.StationTurnMirrorTile(orientation, turn);
            case TileType.SpecialThreeRoadOneRail: return new Tiles.SpecialThreeRoadOneRailTile(orientation, turn);
            case TileType.SpecialThreeRailOneRoad: return new Tiles.SpecialThreeRailOneRoadTile(orientation, turn);
            case TileType.SpecialAllRoad: return new Tiles.SpecialAllRoadTile(orientation, turn);
            case TileType.SpecialAllRail: return new Tiles.SpecialAllRailTile(orientation, turn);
            case TileType.SpecialRoadRailAdjacent: return new Tiles.SpecialRoadRailAdjacentTile(orientation, turn);
            case TileType.SpecialRoadRailAcross: return new Tiles.SpecialRoadRailAcrossTile(orientation, turn);
            case TileType.RiverStraight: return new Tiles.RiverStraightTile(orientation, turn);
            case TileType.RiverTurn: return new Tiles.RiverTurnTile(orientation, turn);
            case TileType.RiverRoadBridge: return new Tiles.RiverRoadBridgeTile(orientation, turn);
            case TileType.RiverRailBridge: return new Tiles.RiverRailBridgeTile(orientation, turn);
            case TileType.LakeThreeSides: return new Tiles.LakeThreeSidesTile(orientation, turn);
            case TileType.LakeTwoSides: return new Tiles.LakeTwoSidesTile(orientation, turn);
            case TileType.LakeOneSide: return new Tiles.LakeOneSideTile(orientation, turn);
            case TileType.LakeRoad: return new Tiles.LakeRoadTile(orientation, turn);
            case TileType.LakeRail: return new Tiles.LakeRailTile(orientation, turn);
            case TileType.LakeRoadRail: return new Tiles.LakeRoadRailTile(orientation, turn);
            case TileType.LakeFull: return new Tiles.LakeFull(orientation, turn);
            default: throw new Error(`Tile type ${TileType[tileType]} not implemented`)
        }
    }

    public CreateEdgeTile(tileType: TileType): Tiles.EdgeBaseTile{
        switch(tileType){
            case TileType.RailEdge: return new Tiles.RailEdgeTile();
            case TileType.RoadEdge: return new Tiles.RoadEdgeTile();
            case TileType.WallEdge: return new Tiles.WallEdgeTile();
        }
    }
}