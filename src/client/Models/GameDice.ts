import { TileType } from '../../common/Enums';
import { IGameTile, GameTile } from './GameTile';


export class GameDice {
    static idCounter: number = 0; //TODO: Gross static code...

    public Played: boolean;
    public Tile: IGameTile;
    public Id: number; //TODO: This probably shouldn't be a public member

    constructor(tile: IGameTile = new GameTile(TileType.Empty)) {
        this.Tile = tile;
        this.Played = false;
        this.Id = GameDice.idCounter++;
    }

    public GetTileType() {
        return this.Tile.Type;
    }

    public IsEmpty() {
        return this.Tile.IsTileEmpty();
    }

    public SetGameTurn(gameTurn: number) {
        this.Tile.TurnPlayed = gameTurn;
    }

    public MarkAsPlayed() {
        this.Played = true;
    }
}



