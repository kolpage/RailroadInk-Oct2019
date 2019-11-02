import * as Tiles from "./tiles";
import { TileType, Orientation } from "./enums";

export class TileFactory{
    constructor(){ }

    public CreateTile(tileType: TileType, turn: number, orientation: Orientation): Tiles.BaseTile{
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
        }
    }
}