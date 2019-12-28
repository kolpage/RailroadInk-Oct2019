import { TileType, Orientation } from "../../common/Enums";

export interface IGameTile {
    Type: TileType;
    TileOrientation: Orientation;
    TurnPlayed?: number; // TODO: Currently using null to indicate the tile hasn't been played...maybe not needed

    // TODO: Something not right about this interface - it has too many function defined on it. Either need to break
    //       this apart into multiple interface or use compotions (maybe?)
    TransferTile: (updatedTile: IGameTile) => void;
    RotateTile: () => void;
    MirrorTile:() => void;
    IsTileEmpty: () => boolean;
    CanTileBeMirror: () => boolean;
    AreTilesEquivalent: (otherTile: IGameTile) => boolean;
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

    public TransferTile(updatedTile) {
        this.Type = updatedTile.Type;
        this.TileOrientation = updatedTile.TileOrientation;
        this.TurnPlayed = updatedTile.TurnPlayed;
    }

    public RotateTile() {
        let newOrientation = this.TileOrientation + 1;
        if(newOrientation >= Orientation._length) {
            newOrientation = 0;
        }
        this.TileOrientation = newOrientation;
    }

    public MirrorTile() {
        this.Type = this.getMirroredType();
    }

    public IsTileEmpty() {
        return this.Type == TileType.Empty;
    }

    public CanTileBeMirror() {
        // TODO: Make this poloymorphic behavior 
        return (this.Type == TileType.StationTurn || this.Type == TileType.StationTurnMirror);
    }

    public AreTilesEquivalent(otherTile: IGameTile) {
        return this.areTilesSameType(otherTile) || (this.getMirroredType() === otherTile.Type);
    }

    private areTilesSameType(otherTile: IGameTile) {
        return this.Type === otherTile.Type;
    }

    private getMirroredType() {
        // TODO: Gross. Switchstatment means this should be poloymorphic
        switch (this.Type) {
            case TileType.StationTurn:
                return TileType.StationTurnMirror;
            case TileType.StationTurnMirror:
                return TileType.StationTurn;
            default: 
                return this.Type;
        }
    }
}