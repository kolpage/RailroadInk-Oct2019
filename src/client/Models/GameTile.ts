import { TileType, Orientation } from "../../common/Enums";

export interface IGameTile {
    Type: TileType;
    TileOrientation: Orientation;
    TurnPlayed?: number; // TODO: Currently using null to indicate the tile hasn't been played...maybe not needed

    RotateTile: () => void;
    IsTileEmpty: () => boolean;
}

export class GameTile implements IGameTile {
    public Type: TileType;
    public TileOrientation: Orientation;
    public TurnPlayed?: number;

    constructor(type: TileType = TileType.Empty, orientation: Orientation = Orientation.up, turnPlayed: number = null) {
        this.Type = type;
        this.TileOrientation = orientation;
        this.TurnPlayed = turnPlayed;
    }

    public RotateTile() {
        let newOrientation = this.TileOrientation + 1;
        if(newOrientation >= Orientation._length) {
            newOrientation = 0;

            // TODO: Find a better way to handle mirror tiles
            if (this.Type == TileType.StationTurn) {
                this.Type = TileType.StationTurnMirror
            } else if (this.Type == TileType.StationTurnMirror) {
              this.Type = TileType.StationTurn  
            }
        }
        this.TileOrientation = newOrientation;
    }

    public IsTileEmpty() {
        return this.Type == TileType.Empty;
    }
}