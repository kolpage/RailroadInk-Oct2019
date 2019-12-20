import { ipcMain } from "electron";
import { GetDiceRollEvent, AdvanceTurnEvent } from "../common/Constants";
import { BaseGame } from "./BaseGame";
import { StandardDicePool } from "./DicePool";

export class GameManager{
    private activeGame: BaseGame;
    
    constructor(){
        this.activeGame = new BaseGame(7, new StandardDicePool(""));
        this.initalizeStartupEventHandlers();
    }

    private initalizeStartupEventHandlers(){
        ipcMain.handle(GetDiceRollEvent, this.handleDiceRollEvent.bind(this));
        ipcMain.handle(AdvanceTurnEvent, this.handleAdvanceTurnEvent.bind(this));
    }

    private handleDiceRollEvent(event, args) {
        return this.activeGame.GetDiceRoll();
    }

    private handleAdvanceTurnEvent(event, args) {
        return this.activeGame.MakeMove(args);
    }
}