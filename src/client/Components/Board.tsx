import update from 'immutability-helper';

import * as React from 'react';
import DiceContainer from './DiceContainer';
import '../styles/board.scss';
import { GetSpeicalDice, AdvanceTurn, StartGame } from '../GameServices';
import { GameDice } from '../Models/GameDice';
import Grid from './Grid';
import { GameBoard } from '../Models/GameBoard';
import { Move, GameTurn } from '../Models/GameTurn';
import { IGameTile } from '../Models/GameTile';
import ScoreCard from './ScoreCard';
import { GameType } from '../../common/Enums';

interface IBoardProps{
    gameBoard: GameBoard;
    seed: string;
    gameType: GameType
}

// TODO: Elevate this state (it should come from the server anyways)
interface IBoardState{
    selectedDice: GameDice;
    rolledDice: GameDice[];
    gameBoard: GameBoard;
    gameTurn: GameTurn;
}

export class Board extends React.Component<IBoardProps, IBoardState>{
    private specialDice = GetSpeicalDice();
    
    constructor(props: IBoardProps){
        super(props);
        this.state = {
            selectedDice: new GameDice(), 
            rolledDice: [],
            gameBoard: this.props.gameBoard,
            gameTurn: new GameTurn()
        }
        this.bindFunctions();

        StartGame(this.props.gameType, this.props.seed, this.initalizeBoard);
    }

    private bindFunctions(){
        // TODO: This is definietly a code smell...and would be gone with a function component 
        this.playSelectedDice = this.playSelectedDice.bind(this);
        this.updateMoveOnBoard = this.updateMoveOnBoard.bind(this);
        this.updateSelectedDice = this.updateSelectedDice.bind(this);
        this.removeMoveFromBoard = this.removeMoveFromBoard.bind(this);
        this.advanceTurn = this.advanceTurn.bind(this);
        this.updateRolledDice = this.updateRolledDice.bind(this);
        this.canAdvanceTurn = this.canAdvanceTurn.bind(this);
        this.initalizeBoard = this.initalizeBoard.bind(this);
        this.setupNextTurn = this.setupNextTurn.bind(this);
        this.showInvalidMoves = this.showInvalidMoves.bind(this);
    }

    initalizeBoard(startingTurn: GameTurn){
        this.setState({rolledDice: startingTurn.RolledDice, gameTurn: startingTurn});
    }
    
    private advanceTurn(){
        AdvanceTurn(this.state.gameTurn.Moves, this.setupNextTurn, this.showInvalidMoves);
    }

    setupNextTurn(nextTurn: GameTurn){
        this.setState({gameTurn: nextTurn});
        if(!nextTurn.IsGameOver){
            this.updateRolledDice(nextTurn.RolledDice);
        }
    }

    showInvalidMoves(moves: Move[]){
        // TODO: This logic shouldn't live here. It should probably be moved to a model or a servive. 
        const currentTurn = this.state.gameTurn;
        currentTurn.Moves.ClearInvalidMoves();
        moves.forEach(invalidMove => currentTurn.Moves.UpdateMove(invalidMove));
        this.setState({gameTurn: currentTurn});
    }

    private updateRolledDice(gameDice: GameDice[]){
        gameDice.forEach(dice => {
            dice.SetGameTurn(this.state.gameTurn.TurnNumber);
        });
        this.setState({rolledDice: gameDice});
    }

    private playSelectedDice(move: Move){
        if (!this.state.selectedDice.IsEmpty()){
            let currentTurn = this.state.gameTurn;
            let updatedBoard = this.state.gameBoard;

            if(!move.TilePlayed.IsTileEmpty()){
                // If there is already a move in the square, clear it out
                updatedBoard.RemoveMove(move);
                currentTurn.Moves.RemoveMove(move);
                this.resetDice(move);
            }

            move.PlayDice(this.state.selectedDice);
            updatedBoard.MakeMove(move);
            currentTurn.Moves.AddMove(move);
            this.state.selectedDice.MarkAsPlayed();

            // TODO: Handle tracking the turn special dice were played better
            if (this.isSpecialTile(move.TilePlayed)) {
                move.TilePlayed.TurnPlayed = this.state.gameTurn.TurnNumber;
                this.updateSpecialDiceForMove(move);
            }

            this.setState({gameBoard: updatedBoard, gameTurn: currentTurn, selectedDice: new GameDice()});   
        }  
    }

    private transferMove(sourceMove: Move, destinationMove: Move){
        let updatedBoard = this.state.gameBoard;
        let currentTurn = this.state.gameTurn;

        updatedBoard.RemoveMove(sourceMove);
        currentTurn.Moves.RemoveMove(sourceMove);
        currentTurn.Moves.RemoveMove(destinationMove);
        this.resetDice(destinationMove);
        
        destinationMove.TilePlayed = sourceMove.TilePlayed;
        destinationMove.ClearMoveStatus();

        updatedBoard.MakeMove(destinationMove);
        currentTurn.Moves.UpdateMove(destinationMove);

        this.setState({gameBoard: updatedBoard, gameTurn: currentTurn});
    }

    private updateMoveOnBoard(move: Move){
        let updatedBoard = this.state.gameBoard;
        updatedBoard.MakeMove(move);

        let currentTurn = this.state.gameTurn;
        currentTurn.Moves.UpdateMove(move);

        this.setState({gameBoard: updatedBoard, gameTurn: currentTurn});
    }

    private removeMoveFromBoard(move: Move){
        let updatedBoard = this.state.gameBoard;
        updatedBoard.RemoveMove(move);

        let currentTurn = this.state.gameTurn;
        currentTurn.Moves.RemoveMove(move);

        this.setState({gameBoard: updatedBoard, gameTurn: currentTurn});

        this.resetDice(move);
    }

    private resetDice(move: Move){
        let found = false;

        this.state.rolledDice.every(dice =>{
            if (dice.Tile.AreTilesEquivalent(move.TilePlayed) && dice.Played){
                dice.Played = false;
                found = true;
                return false;
            }
            return true;
        });
        if (!found){
            this.specialDice.every(dice =>{
                if (dice.Tile.AreTilesEquivalent(move.TilePlayed) && dice.Played){
                    dice.Played = false;
                    found = true;
                    return false;
                }
                return true;
            });
        }

        // TODO: Resting the dice seems to work without this line but it shouldn't...
        //if(found) {this.setState({rolledDice: this.state.rolledDice});}
    }

    // TODO: Move these check somewhere else (models if possible)
    private updateSelectedDice(dice: GameDice){
        // TODO: Clean up this check
       if (!this.isSpecialDice(dice) || (this.isSpecialDice(dice) && this.canPlaySpecialDice())) {
            this.setState({selectedDice: dice});
        }
    }

    private canAdvanceTurn(){
        // TODO: Allow for debug mode to roll dice whenever
        // FUTURE: This check will need to be update when there are optional dice to play or a different number of moves 
        return this.state.rolledDice.every((dice) => dice.Played);
    }

    private isSpecialDice(dice: GameDice){
        return this.isSpecialTile(dice.Tile);
    }

    private isSpecialTile(tile: IGameTile){
        return this.specialDice.some((specialDice) => tile.AreTilesEquivalent(specialDice.Tile));
    }

    private canPlaySpecialDice(){
        return this.specialDice.every((specialDice) => (specialDice.Tile.TurnPlayed < this.state.gameTurn.TurnNumber) || !specialDice.Played);
    }

    private updateSpecialDiceForMove(move: Move){
        let specialDiceToUpdate = this.specialDice.find((dice) => dice.Tile.AreTilesEquivalent(move.TilePlayed));
        specialDiceToUpdate.SetGameTurn(this.state.gameTurn.TurnNumber); // TODO: Don't hide state change
    }

    // TODO: Sidebar should probably be its own component 
    private showSidebar(){
        if(this.state.gameTurn.IsGameOver){
            return <ScoreCard score={this.state.gameTurn.Score}/>
        }else{
            return(
                <React.Fragment>
                    <DiceContainer dice={this.specialDice} onDiceSelected={this.updateSelectedDice} />
                    <div className='column'>
                        <DiceContainer dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice}/>
                        <button onClick={this.advanceTurn} className='rollButton'>Roll Dice</button>
                    </div>
                </React.Fragment>
            )
        }
    }

    render(){
        return (
            <div className='boardContainer'>
                <div className='row'>
                    {this.showSidebar()}
                    <Grid 
                        gameBoard={this.state.gameBoard} 
                        gameTurn={this.state.gameTurn} 
                        addMoveToBoard={this.playSelectedDice} 
                        updateMoveOnBoard={this.updateMoveOnBoard} 
                        clearMoveOnBoard={this.removeMoveFromBoard} 
                        transferMove={this.transferMove.bind(this)}
                    />
                </div>
            </div>
        );
    }
}