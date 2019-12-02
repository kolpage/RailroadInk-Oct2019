import * as React from 'react';
import { GameBoard, GameTile, IGameTurn, Move } from '../GameModels';
import { Square } from './Square';
import { TileType, Orientation } from '../../common/Enums';
import { ExitTile, ExitTileSide } from './Tile';
import { Dice } from './Dice';


interface IGridProps {
    //gameTurn: IGameTurn;
    gameBoard: GameBoard;
    gameTurn: number; // TODO: Use GameTurn object

    // TODO: Don't just use pass through
    addMoveToBoard: (move: Move) => void;
    updateMoveOnBoard: (move: Move) => void;
    clearMoveOnBoard: (move: Move) => void;
}

// TODO: Find a better name. This component represents the play area where you draw roads and rails. 
export class Grid extends React.Component<IGridProps> {
    // #region: Child callback functions
    // TODO: I don't like this pattern of adding a callback/delegate for each action the square wants to do. Probably need state MGMT (or just find a better pattern)
    //       Maybe we can just have the square return the updated tile and all board needs to do is set the new tile on the board
    private playSelectedTile(squareColumn: number, squareRow: number) {
        // if (this.props.gameTurn.SelectedDice.IsEmpty()) {return;} // TODO: Gross procedural code
        
        // let tileToUpdate = this.props.gameBoard.getTile(squareColumn, squareRow);
        // tileToUpdate.Type = this.props.gameTurn.SelectedDice.GetTile();
        // tileToUpdate.TurnPlayed = this.props.gameTurn.TurnNumber;

        // //this.props.updateBoard()
        // let updatedBoard = this.props.gameBoard;
        // updatedBoard.setTile(tileToUpdate, squareColumn, squareRow);

        // let updatePlayedDice = this.state.playedDice;
        // updatePlayedDice.push(this.state.selectedDice);
        // this.state.selectedDice.Played = true;

        const tileToUpdate = this.props.gameBoard.getTile(squareColumn, squareRow);
        const move = new Move(tileToUpdate, squareColumn, squareRow);
        this.props.addMoveToBoard(move);      
    }

    private rotateSquareTile(squareColumn: number, squareRow: number) {
        let tileToRotate = this.props.gameBoard.getTile(squareColumn, squareRow);
        tileToRotate.RotateTile();
        const move = new Move(tileToRotate, squareColumn, squareRow);

        this.props.updateMoveOnBoard(move);
    }

    private clearSquareTile(squareColumn: number, squareRow: number) {
        let tileToClear = this.props.gameBoard.getTile(squareColumn, squareRow);
        const move = new Move(tileToClear, squareColumn, squareRow);

        this.props.clearMoveOnBoard(move);
    }

    private buildPlayAreaGrid() {
        let board = [];

        for (var currentRow = 0; currentRow < this.props.gameBoard.numberOrRows; currentRow++) {
            board.push(this.createRow(currentRow, this.props.gameBoard.numberOfColumns));
        }

        return board;
    }

    private createRow(rowPosition: number, numberOfCells: number): React.ReactElement {
        let row = [];
        for (var currentColumn = 0; currentColumn < numberOfCells; currentColumn++) {
            const tile = this.props.gameBoard.getTile(currentColumn, rowPosition);
            const cellKey = `${currentColumn}${rowPosition}`
            row.push(<Square gameTile={tile} updateSquare={this.playSelectedTile.bind(this)} rotateSquare={this.rotateSquareTile.bind(this)} clearSquare={this.clearSquareTile.bind(this)} currentGameTurn={this.props.gameTurn} sqaureColumn={currentColumn} squareRow={rowPosition} key={cellKey} />);
        }
        return (
            <div className='row' key={"gameBoardRow" + rowPosition}>
                {row}
            </div>
        );
    }

    render() {
        return (
            <div className='row'>
                <GridBoarder boarderOrientation={Orientation.left}/>
                <div>
                    <GridBoarder boarderOrientation={Orientation.up}/>
                    {this.buildPlayAreaGrid()}
                    <GridBoarder boarderOrientation={Orientation.down}/>
                </div>
                <GridBoarder boarderOrientation={Orientation.right}/>
            </div>
        );
    }

}

interface IGridBoarderProps {
    boarderOrientation: Orientation
}

export class GridBoarder extends React.Component<IGridBoarderProps> {
    // TODO: Move this to its own component
    private drawBoarder(): React.ReactElement {
        const roadTile = new GameTile(TileType.RoadStraight);
        const railTile = new GameTile(TileType.RailStraight);
        const emptyTile = new GameTile(TileType.Empty);
        return (
            <div className='row'>
                <ExitTile tile={emptyTile} />
                <ExitTile tile={roadTile} />
                <ExitTile tile={emptyTile} />
                <ExitTile tile={railTile} />
                <ExitTile tile={emptyTile} />
                <ExitTile tile={roadTile} />
            </div>
        );
    }

    private drawSideBoarder(): React.ReactElement {
        const roadTile = new GameTile(TileType.RoadStraight, Orientation.right);
        const railTile = new GameTile(TileType.RailStraight, Orientation.right);
        const emptyTile = new GameTile(TileType.Empty, Orientation.right);
        return (
            <div className='sideExitBoarder'>
                <ExitTileSide tile={emptyTile} />
                <ExitTileSide tile={railTile} />
                <ExitTileSide tile={emptyTile} />
                <ExitTileSide tile={roadTile} />
                <ExitTileSide tile={emptyTile} />
                <ExitTileSide tile={railTile} />
                <ExitTileSide tile={emptyTile} />
            </div>
        );
    }
    
    render() {
        if (this.props.boarderOrientation === Orientation.left || this.props.boarderOrientation === Orientation.right) {
            return this.drawSideBoarder();
        } else {
            return this.drawBoarder();
        }
    }
}