import { BaseTile, PlayableBaseTile } from "../game/tiles";
import { TileType, Orientation } from "../common/Enums";
import { TileFactory } from "../game/TileFactory";
import { StandardDicePool } from "../game/DicePool";
import { Board } from "../game/Board";
import { BaseTurn } from "../game/Turn";

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
        const tileFactory = new TileFactory();
        const board = new Board(7,7,tileFactory);
        console.log(board.ToString());
    }

    public static BoardTest_13x13_PrintBoard(): void{
        console.log(" ");
        const tileFactory = new TileFactory();
        const board = new Board(13,13,tileFactory);
        console.log(board.ToString());
    }

    public static BoardTest_7x7_AddTilesToBoard():void{
        console.log(" ");
        const tileFactory = new TileFactory();
        const board = new Board(7,7,tileFactory);
        board.SetTile(tileFactory.CreateTile(TileType.RoadStraight, 1, Orientation.up), 0, 1, false);
        board.SetTile(tileFactory.CreateTile(TileType.RoadStraight, 1, Orientation.up), 1, 1, false);
        board.SetTile(tileFactory.CreateTile(TileType.RoadTurn, 1, Orientation.right), 2, 1, false);
        console.log(board.ToString());
    }

    public static BoardTest_7x7_AddThenRemoveTilesFromBoard(): void{
        console.log(" ");
        const tileFactory = new TileFactory();
        const board = new Board(7,7,tileFactory);
        board.SetTile(tileFactory.CreateTile(TileType.RoadStraight, 1, Orientation.up), 0, 1, false);
        board.SetTile(tileFactory.CreateTile(TileType.RoadStraight, 1, Orientation.up), 1, 1, false);
        board.SetTile(tileFactory.CreateTile(TileType.RoadTurn, 1, Orientation.right), 2, 1, false);
        const tile = board.RemoveTile(1,1);
        console.log(board.ToString());
        console.log(tile.ToString());
    }

    public static TurnTest_ValidTilePlacement(){
        const tileFactory = new TileFactory();
        const board = new Board(7,7,tileFactory);
        const turnNumber = 1;
        const turn = new BaseTurn(turnNumber, [TileType.RoadStraight, TileType.RoadTurn, TileType.RailStraight, TileType.StationStraight], board);
        let isMoveAllowed: boolean;
        let wasMoveSuccessful: boolean;

        //Place straight road against top right exit
        const straightRoadTile = tileFactory.CreateTile(TileType.RoadStraight, turnNumber, Orientation.up);
        if(!board.IsTilePositionValid(straightRoadTile, 0, 5)){
            console.log("ERROR: Could not place straight road tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RoadStraight, straightRoadTile, 0, 5);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight road tile because tile was already in place.");
            return;
        }

        //Place road turn against newly played straight road
        const turnRoadTile = tileFactory.CreateTile(TileType.RoadTurn, turnNumber, Orientation.up);
        if(!board.IsTilePositionValid(turnRoadTile, 1, 5)){
            console.log("ERROR: Could not place turn road tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RoadTurn, turnRoadTile, 1, 5);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place turn road tile because tile was already in place.");
            return;
        }
        //Place straight station against road turn
        const stationTile = tileFactory.CreateTile(TileType.StationStraight, turnNumber, Orientation.left);
        if(!board.IsTilePositionValid(stationTile, 1, 4)){
            console.log("ERROR: Could not place straight station tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.StationStraight, stationTile, 1, 4);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight station tile because tile was already in place.");
            return;
        }

        //Place straight rail against road turn
        const straightRailTile = tileFactory.CreateTile(TileType.RailStraight, turnNumber, Orientation.right);
        if(!board.IsTilePositionValid(straightRailTile, 1, 3)){
            console.log("ERROR: Could not place straight rail tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RailStraight, straightRailTile, 1, 3);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight rail tile because tile was already in place.");
            return;
        }

        console.log(board.ToString());
    }

    public static TurnTest_InvalidTilePlacement_PuttingStationInBackwards(){
        const tileFactory = new TileFactory();
        const board = new Board(7,7,tileFactory);
        const turnNumber = 1;
        const turn = new BaseTurn(turnNumber, [TileType.RoadStraight, TileType.RoadTurn, TileType.RailStraight, TileType.StationStraight], board);
        let isMoveAllowed: boolean;
        let wasMoveSuccessful: boolean;

        //Place straight road against top right exit
        const straightRoadTile = tileFactory.CreateTile(TileType.RoadStraight, turnNumber, Orientation.up);
        if(!board.IsTilePositionValid(straightRoadTile, 0, 5)){
            console.log("ERROR: Could not place straight road tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RoadStraight, straightRoadTile, 0, 5);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight road tile because tile was already in place.");
            return;
        }

        //Place road turn against newly played straight road
        const turnRoadTile = tileFactory.CreateTile(TileType.RoadTurn, turnNumber, Orientation.up);
        if(!board.IsTilePositionValid(turnRoadTile, 1, 5)){
            console.log("ERROR: Could not place turn road tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RoadTurn, turnRoadTile, 1, 5);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place turn road tile because tile was already in place.");
            return;
        }
        //Place straight station against road turn
        const stationTile = tileFactory.CreateTile(TileType.StationStraight, turnNumber, Orientation.right);
        if(!board.IsTilePositionValid(stationTile, 1, 4)){
            console.log("ERROR: Could not place straight station tile because of neighboring tiles.");
            console.log("Test passed.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.StationStraight, stationTile, 1, 4);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight station tile because tile was already in place.");
            return;
        }

        //Place straight rail against road turn
        const straightRailTile = tileFactory.CreateTile(TileType.RailStraight, turnNumber, Orientation.right);
        if(!board.IsTilePositionValid(straightRailTile, 1, 3)){
            console.log("ERROR: Could not place straight rail tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RailStraight, straightRailTile, 1, 3);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight rail tile because tile was already in place.");
            return;
        }

        console.log(board.ToString());
    }

    public static TurnTest_ValidButStupidPlacement_PuttingStationInWithEmptySidesTouching(){
        const tileFactory = new TileFactory();
        const board = new Board(7,7,tileFactory);
        const turnNumber = 1;
        const turn = new BaseTurn(turnNumber, [TileType.RoadStraight, TileType.RoadTurn, TileType.RailStraight, TileType.StationStraight], board);
        let isMoveAllowed: boolean;
        let wasMoveSuccessful: boolean;

        //Place straight road against top right exit
        const straightRoadTile = tileFactory.CreateTile(TileType.RoadStraight, turnNumber, Orientation.up);
        if(!board.IsTilePositionValid(straightRoadTile, 0, 5)){
            console.log("ERROR: Could not place straight road tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RoadStraight, straightRoadTile, 0, 5);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight road tile because tile was already in place.");
            return;
        }

        //Place road turn against newly played straight road
        const turnRoadTile = tileFactory.CreateTile(TileType.RoadTurn, turnNumber, Orientation.up);
        if(!board.IsTilePositionValid(turnRoadTile, 1, 5)){
            console.log("ERROR: Could not place turn road tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RoadTurn, turnRoadTile, 1, 5);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place turn road tile because tile was already in place.");
            return;
        }
        //Place straight station against road turn
        const stationTile = tileFactory.CreateTile(TileType.StationStraight, turnNumber, Orientation.up);
        if(!board.IsTilePositionValid(stationTile, 1, 4)){
            console.log("ERROR: Could not place straight station tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.StationStraight, stationTile, 1, 4);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight station tile because tile was already in place.");
            return;
        }

        //Place straight rail against road turn
        const straightRailTile = tileFactory.CreateTile(TileType.RailStraight, turnNumber, Orientation.right);
        if(!board.IsTilePositionValid(straightRailTile, 1, 3)){
            console.log("ERROR: Could not place straight rail tile because of neighboring tiles.");
            return;
        }
        wasMoveSuccessful = turn.Move(TileType.RailStraight, straightRailTile, 1, 3);
        if(!wasMoveSuccessful){
            console.log("ERROR: Could not place straight rail tile because tile was already in place.");
            return;
        }

        console.log(board.ToString());
    }
}