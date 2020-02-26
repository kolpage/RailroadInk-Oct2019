import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Board } from './Components/Board';
import StartMenu from './Components/StartMenu';
import { GetBoard } from './GameServices';
import { GameType } from '../common/Enums';

function PlayArea(){
    const [gameStarted, setGameStarted] = React.useState(false);
    const [gameSeed, setGameSeed] = React.useState(null);
    const [gameType, setGameType] = React.useState(GameType.Base);

    function startGame(gameType: GameType, seed:string){
        setGameSeed(seed);
        setGameStarted(true);
        setGameType(gameType);
    }

    function showScreen(){
        if(gameStarted){
            return <Board key="board" gameBoard={GetBoard()} gameType={gameType} seed={gameSeed} />;
        }else{
            return <StartMenu startGame={startGame}/>
        }
    }

    return <div>{showScreen()}</div>;
}

ReactDOM.render(<PlayArea />, document.getElementById('app'));