import { TileType } from "./Enums";

/**
 * Tracks what and how many special tiles have already been played. 
 */
export class SpecialTileTracker{
    private specialTilesRemaining: TileType[] = [
        TileType.SpecialThreeRoadOneRail, 
        TileType.SpecialThreeRailOneRoad,
        TileType.SpecialAllRoad,
        TileType.SpecialAllRail,
        TileType.SpecialRoadRailAdjacent,
        TileType.SpecialRoadRailAcross
    ];
    private specialTilesPlayed: TileType[] = [];

    /**
     * Returns true if the specified tile is available for play 
     * and 3 special tiles haven't already been played. False otherwise.
     * @param tile Tile to check if it can be played.
     */
    public CanPlayTile(tile: TileType): boolean{
        return (this.specialTilesPlayed.length < 3)
            && (this.specialTilesRemaining.find(t => t === tile) !== undefined);
    }

    /**
     * Marks the specified tile as played if possible. True if it was successful.
     * @param tile Tile to play.
     */
    public PlayTile(tile: TileType): boolean{
        if(this.CanPlayTile(tile)){
            this.specialTilesRemaining = this.specialTilesRemaining.filter(t => t !== tile);
            this.specialTilesPlayed.push(tile);
            return true;
        }
        return false;
    }

    public GetRemainingSpecialTiles(): TileType[]{
        return [...this.specialTilesRemaining];
    }

    public GetPlayedSpecialTiles(): TileType[]{
        return [...this.specialTilesPlayed];
    }
}