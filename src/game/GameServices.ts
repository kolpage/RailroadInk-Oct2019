import { ipcMain } from "electron";
import { GetDiceRollEvent, AdvanceTurnEvent, StartGameEvent } from "../common/Constants";
import { BaseGame } from "./BaseGame";
import { StandardDicePool } from "./DicePool";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";
import { StandardGame } from "./StandardGame";

export class GameServices{
    private activeGame: BaseGame;
    
    constructor(){
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
        const seed = !!args.trim() ? args : null;
        this.activeGame = new StandardGame();
        this.initalizeGameEventHandlers();
        return new TurnResponseDTO(this.activeGame.GetNumberOfTurns(), this.activeGame.GetTurnNumber(), [], [], this.activeGame.GetDiceRoll());
    }

    private handleDiceRollEvent(event, args){
        return this.activeGame.GetDiceRoll();
    }

    private handleAdvanceTurnEvent(event, args){
        return this.activeGame.MakeMove(args);
    }
}