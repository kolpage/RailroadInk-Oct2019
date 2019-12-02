import * as React from 'react';
import { GameBoard, GameTile, GameTurn } from '../GameModels';
import { Square } from './Square';
import { TileType, Orientation } from '../../common/Enums';
import { ExitTile, ExitTileSide } from './Tile';


interface IGridProps {
    gameBoard: GameBoard;
    gameTurn: number; // TODO: Use GameTurn object
    updateBoard(updatedBoardState: GameBoard);

    // TODO: Don't just use pass through
    updateSquare: (squareColumn: number, squareRow: number) => void;
    rotateSquare: (squareColumn: number, squareRow: number) => void;
    clearSquare: (squareColumn: number, squareRow: number) => void;
}

// TODO: Find a better name. This component represents the play area where you draw roads and rails. 
export class Grid extends React.Component<IGridProps> {

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




    // #region: Child callback functions
    // TODO: I don't like this pattern of adding a callback/delegate for each action the square wants to do. Probably need state MGMT (or just find a better pattern)
    //       Maybe we can just have the square return the updated tile and all board needs to do is set the new tile on the board
    // private playSelectedTile(squareColumn: number, squareRow: number) {
    //     if (this.props.gameTurn.SelectedDice.IsEmpty()) {return;} // TODO: Gross procedural code
        
    //     let tileToUpdate = this.props.gameBoard.getTile(squareColumn, squareRow);
    //     tileToUpdate.Type = this.props.gameTurn.SelectedDice.GetTile();
    //     tileToUpdate.TurnPlayed = this.props.gameTurn.TurnNumber;

    //     //this.props.updateBoard()
    //     let updatedBoard = this.props.gameBoard;
    //     updatedBoard.setTile(tileToUpdate, squareColumn, squareRow);

    //     let updatePlayedDice = this.state.playedDice;
    //     updatePlayedDice.push(this.state.selectedDice);
    //     this.state.selectedDice.Played = true;

    //     this.setState({gameBoard: updatedBoard, playedDice: updatePlayedDice, selectedDice: new GameDice()});      
    // }

    // private rotateSquareTile(squareColumn: number, squareRow: number) {
    //     let updatedTile = this.state.gameBoard.getTile(squareColumn, squareRow);
    //     updatedTile.RotateTile();
    //     let updatedBoard = this.state.gameBoard;
    //     updatedBoard.setTile(updatedTile, squareColumn, squareRow);
    //     this.setState({gameBoard: updatedBoard});
    // }

    // private clearSquareTile(squareColumn: number, squareRow: number) {
    //     let updatedBoard = this.state.gameBoard;
    //     const tileType = updatedBoard.getTile(squareColumn, squareRow).Type // TODO: Get rid of reference to type enum
    //     updatedBoard.clearTile(squareColumn, squareRow);
    //     this.setState({gameBoard: updatedBoard});

    //     this.resetDice(tileType);
    // }

    //updateSquareOnGrid(updateSquare: Square, )


    private buildPlayArea() {
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
            row.push(<Square gameTile={tile} updateSquare={this.props.updateSquare} rotateSquare={this.props.rotateSquare} clearSquare={this.props.clearSquare} currentGameTurn={this.props.gameTurn} sqaureColumn={currentColumn} squareRow={rowPosition} key={cellKey} />);
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
                {this.drawSideBoarder()}
                <div>
                    {this.drawBoarder()}
                    {this.buildPlayArea()}
                    {this.drawBoarder()}
                </div>
                {this.drawSideBoarder()}
            </div>
        );
    }

}