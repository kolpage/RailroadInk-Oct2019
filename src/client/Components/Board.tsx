// import update from 'react-addons-update';
import update from 'immutability-helper';

import * as React from 'react';
import { Inventory } from './Inventory';
import '../styles/board.scss';
import '../styles/inventory.scss';
import '../styles/tile.scss';
import { RollDice, GetSpeicalDice, AdvanceTurn } from '../GameServices';
import { GameDice } from '../Models/GameDice';
import { Grid } from './Grid';
import { GameBoard } from '../Models/GameBoard';
import { TurnMoves, Move } from '../Models/GameTurn';
import { IGameTile } from '../Models/GameTile';


interface IBoardProps {
    gameBoard: GameBoard;
}

// TODO: Elevate this state (it should come from the server anyways)
interface IBoardState {
    selectedDice: GameDice;
    rolledDice: GameDice[];
    playedTiles: TurnMoves;
    gameBoard: GameBoard;
    gameTurn: number;
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    private specialDice = GetSpeicalDice();
    
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            selectedDice: new GameDice(), 
            rolledDice: [],
            playedTiles: new TurnMoves(),
            gameBoard: this.props.gameBoard,
            gameTurn: 0
        }
        this.bindFunction();

        this.rollDice();
    }

    private bindFunction() {
        this.playSelectedDice = this.playSelectedDice.bind(this);
        this.updateMoveOnBoard = this.updateMoveOnBoard.bind(this);
        this.updateSelectedDice = this.updateSelectedDice.bind(this);
        this.removeMoveFromBoard = this.removeMoveFromBoard.bind(this);
        this.rollDice = this.rollDice.bind(this);
        this.updateRolledDice = this.updateRolledDice.bind(this);
        this.canAdvanceTurn = this.canAdvanceTurn.bind(this);
    }
    
    private rollDice() {
        AdvanceTurn(this.state.playedTiles);
        // TODO: Dice for next turn should just be returned from the main process
        RollDice(this.updateRolledDice);
    }

    private updateRolledDice(gameDice: GameDice[]) {
        // TODO: Get game turn from server and not manually set it here
        const nextGameTurn = this.state.gameTurn+1;
        
        gameDice.forEach(dice => {
            dice.SetGameTurn(nextGameTurn);
        });
        this.setState({rolledDice: gameDice, gameTurn: nextGameTurn});
    }

    private playSelectedDice(move: Move) {
        if (!this.state.selectedDice.IsEmpty()) {
            // TODO: Don't have board update the move. Not sure how to handle this since I don't want to pass the currently selected 
            //       dice to the grid since it doesn't really need to know that. 
            move.PlayDice(this.state.selectedDice);
            let updatedBoard = this.state.gameBoard;
            updatedBoard.MakeMove(move);

            let updatedPlayedTiles = this.state.playedTiles
            updatedPlayedTiles.AddMove(move);
            this.state.selectedDice.MarkAsPlayed();

            // TODO: Handle tracking the turn special dice were played better
            if (this.isSpecialTile(move.TilePlayed)) {
                move.TilePlayed.TurnPlayed = this.state.gameTurn;
                this.updateSpecialDiceForMove(move);
            }

            this.setState({gameBoard: updatedBoard, playedTiles: updatedPlayedTiles, selectedDice: new GameDice()});   
        }  
    }

    private updateMoveOnBoard(move: Move) {
        let updatedBoard = this.state.gameBoard;
        updatedBoard.MakeMove(move);

        let updatedPlayedTiles = this.state.playedTiles;
        updatedPlayedTiles.UpdateMove(move);

        this.setState({gameBoard: updatedBoard, playedTiles: updatedPlayedTiles});
    }

    private removeMoveFromBoard(move: Move) {
        let updatedBoard = this.state.gameBoard;
        updatedBoard.RemoveMove(move);

        let updatedPlayedTiles = this.state.playedTiles;
        updatedPlayedTiles.RemoveMove(move);

        this.setState({gameBoard: updatedBoard, playedTiles: updatedPlayedTiles});

        this.resetDice(move);
    }

    private resetDice(move: Move) {
        let found = false;

        this.state.rolledDice.every(dice => {
            if (dice.Tile.AreTilesEquivalent(move.TilePlayed) && dice.Played) {
                dice.Played = false;
                found = true;
                return false;
            }
            return true;
        });
        if (!found) {
            this.specialDice.every(dice => {
                if (dice.Tile.AreTilesEquivalent(move.TilePlayed) && dice.Played) {
                    dice.Played = false;
                    found = true;
                    return false;
                }
                return true;
            });
        }
    }

    // TODO: Moves these check somewhere else (models if possible)
    private updateSelectedDice(dice: GameDice) {
        // TODO: Clean up this check
       if (!this.isSpecialDice(dice) || (this.isSpecialDice(dice) && this.canPlaySpecialDice())) {
            this.setState({selectedDice: dice});
        }
    }

    private canAdvanceTurn() {
        // TODO: Allow for debug mode to roll dice whenever
        // FUTURE: This check will likely need to be update when there are optional dice to play
        //return this.state.rolledDice.every((dice) => dice.Played);
        return true;
    }

    private isSpecialDice(dice: GameDice) {
        return this.isSpecialTile(dice.Tile);
    }

    private isSpecialTile(tile: IGameTile) {
        return this.specialDice.some((specialDice) => tile.AreTilesEquivalent(specialDice.Tile));
    }

    private canPlaySpecialDice() {
        return this.specialDice.every((specialDice) => (specialDice.Tile.TurnPlayed < this.state.gameTurn) || !specialDice.Played);
    }

    private updateSpecialDiceForMove(move: Move) {
        let specialDiceToUpdate = this.specialDice.find((dice) => dice.Tile.AreTilesEquivalent(move.TilePlayed));
        specialDiceToUpdate.SetGameTurn(this.state.gameTurn); // TODO: Don't hide state change
    }

    render() {
        // TODO: Refactor out to more components
        return (
            <div className='boardContainer'>
                <div className='row'>
                <Inventory dice={this.specialDice} onDiceSelected={this.updateSelectedDice} />
                <div className='column'>
                    <Inventory dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice}/>
                    <button onClick={this.rollDice} disabled={!this.canAdvanceTurn()} className='rollButton'>Roll Dice</button>
                </div>
                <Grid gameBoard={this.state.gameBoard} gameTurn={this.state.gameTurn} addMoveToBoard={this.playSelectedDice} updateMoveOnBoard={this.updateMoveOnBoard} clearMoveOnBoard={this.removeMoveFromBoard}/>
                </div>
            </div>
        );
    }
}