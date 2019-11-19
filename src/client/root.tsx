import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Board} from './board';
import { GameTile, GameBoard } from './GameModels';
import { TileType, Orientation } from '../common/Enums';

const Index = () => {
    // TODO: Get the real state from the server
    const fakeState = { 
        numBoardColumns: 7,
        numBoardRows: 7,
        gameTurn: 2,
    }
    let board = new GameBoard(fakeState.numBoardColumns, fakeState.numBoardRows);
    board.fillBoardWithTestData(); // TODO: Remove this line when not testing

    return <Board key="board" columns={fakeState.numBoardColumns} rows={fakeState.numBoardRows} gameBoard={board} gameTurn={fakeState.gameTurn}/>;
};

ReactDOM.render(<Index />, document.getElementById('app'));