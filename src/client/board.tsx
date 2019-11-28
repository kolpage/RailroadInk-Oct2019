import * as React from 'react';
import { Square } from './square';
import { Inventory } from './inventory';
import './styles/board.scss';
import './styles/inventory.scss';
import { RollDice, GetSpeicalDice } from './GameServices';
import { GameBoard, GameDice } from './GameModels';
import { TileType } from '../common/Enums';

interface IBoardProps {
    gameBoard: GameBoard;
}

interface IBoardState {
    selectedDice: GameDice;
    rolledDice: GameDice[]; // TODO: This should just be gotten from the server
    playedDice: GameDice[];
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
            rolledDice: RollDice(),
            playedDice: [],
            gameBoard: this.props.gameBoard,
            gameTurn: 1
        }
    }
    
    private rollDice() {
        this.setState({rolledDice: RollDice(), gameTurn: this.state.gameTurn+1});
    }

    private createRow(rowPosition: number, numberOfCells: number): React.ReactElement {
        let row = [];
        for (var currentColumn = 0; currentColumn < numberOfCells; currentColumn++) {
            const tile = this.props.gameBoard.getTile(currentColumn, rowPosition);
            const cellKey = `${currentColumn}${rowPosition}`
            row.push(<Square gameTile={tile} updateSquare={this.playSelectedTile.bind(this)} rotateSquare={this.rotateSquareTile.bind(this)} clearSquare={this.clearSquareTile.bind(this)} currentGameTurn={this.state.gameTurn} sqaureColumn={currentColumn} squareRow={rowPosition} key={cellKey} />);
        }
        return (
            <div className='row' key={"gameBoardRow" + rowPosition}>
                {row}
            </div>
        );
    }

    // #region: Child callback functions
    // TODO: I don't like this pattern of adding a callback/delegate for each action the square wants to do. Probably need state MGMT (or just find a better pattern)
    //       Maybe we can just have the square return the updated tile and all board needs to do is set the new tile on the board
    private playSelectedTile(squareColumn: number, squareRow: number) {
        if (this.state.selectedDice.Tile.IsTileEmpty()) {return;} // TODO: Gross procedural code
        
        let updatedTile = this.state.gameBoard.getTile(squareColumn, squareRow);
        updatedTile.Type = this.state.selectedDice.Tile.Type;
        updatedTile.TurnPlayed = this.state.gameTurn;
        let updatedBoard = this.state.gameBoard;
        updatedBoard.setTile(updatedTile, squareColumn, squareRow);

        let updatePlayedDice = this.state.playedDice;
        updatePlayedDice.push(this.state.selectedDice);
        this.state.selectedDice.Played = true;

        this.setState({gameBoard: updatedBoard, playedDice: updatePlayedDice, selectedDice: new GameDice()});      
    }

    private rotateSquareTile(squareColumn: number, squareRow: number) {
        let updatedTile = this.state.gameBoard.getTile(squareColumn, squareRow);
        updatedTile.RotateTile();
        let updatedBoard = this.state.gameBoard;
        updatedBoard.setTile(updatedTile, squareColumn, squareRow);
        this.setState({gameBoard: updatedBoard});
    }

    private clearSquareTile(squareColumn: number, squareRow: number) {
        let updatedBoard = this.state.gameBoard;
        const tileType = updatedBoard.getTile(squareColumn, squareRow).Type // TODO: Get rid of reference to type enum
        updatedBoard.clearTile(squareColumn, squareRow);
        this.setState({gameBoard: updatedBoard});

        this.resetDice(tileType);
    }

    // TODO: Don't depend on the TileType enum (probably should just better track what dice are played)
    private resetDice(tileType: TileType) {
        let found = false;
        this.state.rolledDice.every(dice => {
            if (dice.Tile.Type == tileType && dice.Played) {
                dice.Played = false;
                found = true;
                return false;
            }
            return true;
        });
        if (!found) {
            this.specialDice.every(dice => {
                if (dice.Tile.Type == tileType && dice.Played) {
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
    // #endregion

    render() {
        let board = [];

        for (var currentRow = 0; currentRow < this.props.gameBoard.numberOrRows; currentRow++) {
            board.push(this.createRow(currentRow, this.props.gameBoard.numberOfColumns));
        }

        return (
            <div className='boardContainer'>
                <Inventory dice={this.specialDice} onDiceSelected={this.updateSelectedDice.bind(this)} />
                <button onClick={this.rollDice.bind(this)} className='rollButton'>Roll Dice</button>
                <Inventory dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice.bind(this)}/>
                {board}
            </div>
        );
    }
}