import { BaseTile } from "../game/tiles";
import { TileType, Orientation } from "../game/enums";
import { TileFactory } from "../game/TileFactory";
import { StandardDicePool } from "../game/DicePool";

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

    public static StandardDicePoolTest_NoSeed(): void{
        const dicePool = new StandardDicePool();
        let result = dicePool.Roll();
        Test.printDiceRoll(1, result);
        result = dicePool.Roll();
        Test.printDiceRoll(2, result);
        result = dicePool.Roll();
        Test.printDiceRoll(3, result);
    }

    public static StandardDicePoolTest_WithSeed(seed: string): void{
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
        console.log("Roll " + rollNumber + '\n');
        for(const result of dicePoolResult){
            console.log(TileType[result]+ '\n');
        }
    }


}