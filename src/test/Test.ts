import { BaseTile, PlayableBaseTile } from "../game/tiles";
import { TileType, Orientation } from "../common/Enums";
import { TileFactory } from "../game/TileFactory";
import { StandardDicePool } from "../game/DicePool";
import { Board } from "../game/Board";

export class Test{
    public static TileTest(){
        console.log(" ");
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

    public static StandardDicePoolTest_NoSeed(): void{
        console.log(" ");
        const dicePool = new StandardDicePool();
        let result = dicePool.Roll();
        Test.printDiceRoll(1, result);
        result = dicePool.Roll();
        Test.printDiceRoll(2, result);
        result = dicePool.Roll();
        Test.printDiceRoll(3, result);
    }

    public static StandardDicePoolTest_WithSeed(seed: string): void{
        console.log(" ");
        let dicePool = new StandardDicePool(seed);
        console.log("Created dice pool with seed " + seed + '\n');
        let result = dicePool.Roll();
        Test.printDiceRoll(1, result);
        result = dicePool.Roll();
        Test.printDiceRoll(2, result);
        result = dicePool.Roll();
        Test.printDiceRoll(3, result);

        dicePool = new StandardDicePool(seed);
        console.log("Re-created dice pool with seed " + seed + '\n');
        result = dicePool.Roll();
        Test.printDiceRoll(1, result);
        result = dicePool.Roll();
        Test.printDiceRoll(2, result);
        result = dicePool.Roll();
        Test.printDiceRoll(3, result);
    }

    private static printDiceRoll(rollNumber: number, dicePoolResult: TileType[]): void{
        console.log(" ");
        console.log("Roll " + rollNumber + '\n');
        for(const result of dicePoolResult){
            console.log(TileType[result]+ '\n');
        }
    }

    public static BoardTest_7x7_PrintBoard(): void{
        console.log(" ");
        const board = new Board(7,7);
        console.log(board.ToString());
    }

    public static BoardTest_13x13_PrintBoard(): void{
        console.log(" ");
        const board = new Board(13,13);
        console.log(board.ToString());
    }

    public static BoardTest_7x7_AddTilesToBoard():void{
        console.log(" ");
        const board = new Board(7,7);
        board.SetTile(TileType.RoadStraight, 1, Orientation.up, 0, 1, false);
        board.SetTile(TileType.RoadStraight, 1, Orientation.up, 1, 1, false);
        board.SetTile(TileType.RoadTurn, 1, Orientation.right, 2, 1, false);
        console.log(board.ToString());
    }

    public static BoardTest_7x7_AddThenRemoveTilesFromBoard(): void{
        console.log(" ");
        const board = new Board(7,7);
        board.SetTile(TileType.RoadStraight, 1, Orientation.up, 0, 1, false);
        board.SetTile(TileType.RoadStraight, 1, Orientation.up, 1, 1, false);
        board.SetTile(TileType.RoadTurn, 1, Orientation.right, 2, 1, false);
        const tile = board.RemoveTile(1,1);
        console.log(board.ToString());
        console.log(tile.ToString());
    }


}