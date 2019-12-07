// import update from 'react-addons-update';
import update from 'immutability-helper';

import * as React from 'react';
import { Inventory } from './Inventory';
import '../styles/board.scss';
import '../styles/inventory.scss';
import '../styles/tile.scss';
import { RollDice, GetSpeicalDice } from '../GameServices';
import { GameDice } from '../Models/GameDice';
import { Grid } from './Grid';
import { GameBoard } from '../Models/GameBoard';
import { TurnMoves, Move } from '../Models/GameTurn';


interface IBoardProps {
    gameBoard: GameBoard;
}

interface IBoardState {
    selectedDice: GameDice;
    rolledDice: GameDice[]; // TODO: This should just be gotten from the server
    playedTiles: TurnMoves;
    gameBoard: GameBoard;
    gameTurn: number;
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    // TODO: Elevate this state (it should come from the server anyways)
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
    }
    
    private rollDice() {
        RollDice(this.updateRolledDice);
    }

    private updateRolledDice(gameDice: GameDice[]) {
        this.setState({rolledDice: gameDice, gameTurn: this.state.gameTurn+1});
    }

    private playSelectedDice(move: Move) {
        if (!this.state.selectedDice.IsEmpty()) {
            // TODO: Don't have board update the move. Not sure how to handle this since I don't want to pass the currently selected 
            //       dice to the grid since it doesn't really need to know that. 
            move.TilePlayed.Type = this.state.selectedDice.GetTileType();
            move.TilePlayed.TurnPlayed = this.state.gameTurn;
            let updatedBoard = this.state.gameBoard;
            updatedBoard.MakeMove(move);

            let updatedPlayedTiles = this.state.playedTiles
            updatedPlayedTiles.AddMove(move);
            this.state.selectedDice.Played = true;

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

    private updateSelectedDice(dice: GameDice) {
        this.setState({selectedDice: dice});
    }

    render() {
        return (
            <div className='boardContainer'>
                <Inventory dice={this.specialDice} onDiceSelected={this.updateSelectedDice} />
                <Inventory dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice}/>
                <button onClick={this.rollDice} className='rollButton'>Roll Dice</button>
                <Grid gameBoard={this.state.gameBoard} gameTurn={this.state.gameTurn} addMoveToBoard={this.playSelectedDice} updateMoveOnBoard={this.updateMoveOnBoard} clearMoveOnBoard={this.removeMoveFromBoard}/>
            </div>
        );
    }
}