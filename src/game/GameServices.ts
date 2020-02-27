import { ipcMain } from "electron";
import { GetDiceRollEvent, AdvanceTurnEvent, StartGameEvent } from "../common/Constants";
import { BaseGame } from "./BaseGame";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";
import { StandardGame } from "./StandardGame";
import { GameType } from "../common/Enums";
import { RiverExpansionGame } from "./RiverExpansionGame";
import { LakeExpansionGame } from"./LakeExpansionGame";

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
        const seed: string = !!args[0].trim() ? args[0] : null;
        const gameType: GameType = args[1];

        this.activeGame = GameFactory(gameType, seed);
        this.initalizeGameEventHandlers();
        return new TurnResponseDTO(this.activeGame.GetNumberOfTurns(), this.activeGame.GetTurnNumber(), [], [], this.activeGame.GetDiceRoll());
    }

    private handleDiceRollEvent(event, args){
        return this.activeGame.GetDiceRoll();
    }

    private handleAdvanceTurnEvent(event, args){
        console.log(args);
        return this.activeGame.MakeMove(args);
    }
}

function GameFactory(gameType: GameType, seed?:string){
    switch (gameType) {
        case GameType.Base: return new StandardGame(seed);
        case GameType.River: return new RiverExpansionGame(seed);
        case GameType.Lake: return new LakeExpansionGame(seed);  
    } 
}