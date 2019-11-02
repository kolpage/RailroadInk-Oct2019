import { BaseTile } from "../game/tiles";
import { TileType, Orientation } from "../game/enums";
import { TileFactory } from "../game/TileFactory";

export class Test{
    public static TileTest(){
        const tilesToCreate: TileType[] = [TileType.RoadTurn, TileType.SpecialRoadRailAcross, TileType.StationTurnMirror]
        const createdTiles: BaseTile[] = [];
        const orientation = Orientation.down;
        let turnNumber = 1;
        const tileFactory = new TileFactory();
        for(const tile of tilesToCreate){
            createdTiles.push(tileFactory.CreateTile(tile, turnNumber, orientation));
            turnNumber++;
        }
        for(const tile of createdTiles){
            console.log(tile.ToString());
        }
    }
}