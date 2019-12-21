import { ipcMain } from "electron";
import { GetDiceRollEvent, AdvanceTurnEvent, StartGameEvent } from "../common/Constants";
import { BaseGame } from "./BaseGame";
import { StandardDicePool } from "./DicePool";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";

export class GameManager{
    private activeGame: BaseGame;
    
    constructor(){
        //this.activeGame = new BaseGame(7, new StandardDicePool(""));
        this.initalizeStartupEventHandlers();
    }

    private initalizeStartupEventHandlers(){
        ipcMain.handle(StartGameEvent, this.handleStartGameEvent.bind(this));
    }

    private initalizeGameEventHandlers(){
        ipcMain.handle(GetDiceRollEvent, this.handleDiceRollEvent.bind(this));
        ipcMain.handle(AdvanceTurnEvent, this.handleAdvanceTurnEvent.bind(this));
    }

    private handleStartGameEvent(event, args){
        this.activeGame = new BaseGame(7, new StandardDicePool(""));
        this.initalizeGameEventHandlers();
        return new TurnResponseDTO(this.activeGame.GetTurnNumber(), [], [], this.activeGame.GetDiceRoll());
    }

    private handleDiceRollEvent(event, args){
        return this.activeGame.GetDiceRoll();
    }

    private handleAdvanceTurnEvent(event, args){
        console.log("sent moves:");
        console.log(args);
        return this.activeGame.MakeMove(args);
    }
}