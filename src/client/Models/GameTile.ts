import { TileType, Orientation } from "../../common/Enums";
import { Tile } from "../Components/Tile";

export interface IGameTile {
    Type: TileType;
    TileOrientation: Orientation;
    TurnPlayed?: number; // TODO: Currently using null to indicate the tile hasn't been played...maybe not needed

    RotateTile: () => void;
    MirrorTile:() => void;
    IsTileEmpty: () => boolean;
    CanTileBeMirror: () => boolean;
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
        }
        this.TileOrientation = newOrientation;
    }

    public MirrorTile() {
        // TODO: Gross. Switchstatment means this should be poloymorphic
        switch (this.Type) {
            case TileType.StationTurn:
                this.Type = TileType.StationTurnMirror;
                break;
            case TileType.StationTurnMirror:
                this.Type = TileType.StationTurn;
                break;
        }
    }

    public IsTileEmpty() {
        return this.Type == TileType.Empty;
    }

    public CanTileBeMirror() {
        // TODO: Make this poloymorphic behavior 
        return (this.Type == TileType.StationTurn || this.Type == TileType.StationTurnMirror);
    }
}