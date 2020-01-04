import * as React from 'react';
import { Square } from './Square';
import { TileType, Orientation } from '../../common/Enums';
import { ExitTile, ExitTileSide } from './Tile';
import { GameBoard } from '../Models/GameBoard';
import { Move, GameTurn } from '../Models/GameTurn';
import { GameTile } from '../Models/GameTile';


interface IGridProps {
    gameBoard: GameBoard;
    gameTurn: GameTurn;

    addMoveToBoard: (move: Move) => void;
    updateMoveOnBoard: (move: Move) => void;
    clearMoveOnBoard: (move: Move) => void;
    transferMove: (srcMove: Move, destMove: Move) => void;
}

export default function Grid(props:IGridProps){
    function playSelectedTile(move: Move) {
        props.addMoveToBoard(move); 
    }

    function rotateSquareTile(move: Move) {
        move.TilePlayed.RotateTile();
        props.updateMoveOnBoard(move);
    }

    function clearSquareTile(move: Move) {
        props.clearMoveOnBoard(move);
    }

    function mirrorSquareTile(move: Move) {
        move.TilePlayed.MirrorTile();
        props.updateMoveOnBoard(move);
    }

    function buildPlayAreaGrid() {
        let board = [];

        for (var currentRow = 0; currentRow < props.gameBoard.numberOrRows; currentRow++) {
            board.push(createRow(currentRow, props.gameBoard.numberOfColumns));
        }

        return board;
    }

    function getInnerSquareBoardStyles(row: number, column: number){
        let styles = [];
        let totalColumns = props.gameBoard.numberOfColumns;
        let totalRows = props.gameBoard.numberOrRows;

        if(row === 2 && column > 1 && column < totalColumns-2){
            styles.push("innerTop");
        }

        if(row === totalRows-3 && column > 1 && column < totalColumns-2){
            styles.push("innerBottom");
        }

        if(column === 2 && row > 1 && row < totalRows-2){
            styles.push("innerLeft");
        }

        if(column === totalColumns-3 && row > 1 && row < totalRows-2){
            styles.push("innerRight");
        }

        return styles.join(' ');
    } 

    function createRow(rowPosition: number, numberOfCells: number): React.ReactElement {
        let row = [];
        for (var currentColumn = 0; currentColumn < numberOfCells; currentColumn++) {
            let move = props.gameTurn.Moves.GetMoveAtPosition(currentColumn, rowPosition);
            if(move == undefined){
                move = props.gameBoard.GetMove(currentColumn, rowPosition);
            }
            const cellKey = `${currentColumn}${rowPosition}`
            // TODO: Reduce the amount of parameters Square takes
            row.push(<Square 
                        move={move} 
                        playSquare={playSelectedTile} 
                        rotateSquare={rotateSquareTile} 
                        clearSquare={clearSquareTile} 
                        mirrorSquare={mirrorSquareTile} 
                        transferMove={props.transferMove} 
                        currentTurnNumber={props.gameTurn.TurnNumber} 
                        addtionalStyles={getInnerSquareBoardStyles(rowPosition, currentColumn)}
                        key={cellKey} 
                    />);
        }
        return (
            <div className='row' key={"gameBoardRow" + rowPosition}>
                {row}
            </div>
        );
    }
    
    return (
        <div className='row'>
            <GridBoarder boarderOrientation={Orientation.left}/>
            <div>
                <GridBoarder boarderOrientation={Orientation.up}/>
                {buildPlayAreaGrid()}
                <GridBoarder boarderOrientation={Orientation.down}/>
            </div>
            <GridBoarder boarderOrientation={Orientation.right}/>
        </div>
    );
}

// TODO: This should probably be in its own file (though it doesn't seem to have much reuse outside of how Grid is using it)
interface IGridBoarderProps {
    boarderOrientation: Orientation
}

function GridBoarder(props: IGridBoarderProps){
    const roadTile = new GameTile(TileType.RoadStraight, props.boarderOrientation);
    const railTile = new GameTile(TileType.RailStraight, props.boarderOrientation);
    const emptyTile = new GameTile(TileType.Empty, props.boarderOrientation);

    function drawBoarder(){
        if (props.boarderOrientation === Orientation.left || props.boarderOrientation === Orientation.right) {
            return drawSideBoarder();
        } else {
            return drawTopBoarder();
        }
    }

    function drawTopBoarder(): React.ReactElement {
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

    function drawSideBoarder(){
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

    return(
        <div>{drawBoarder()}</div>
    )
}