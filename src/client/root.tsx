import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Board } from './Components/Board';
import StartMenu from './Components/StartMenu';
import { GetBoard } from './GameServices';

function Index(){
    const [gameStarted, setGameStarted] = React.useState(false);
    const [gameSeed, setGameSeed] = React.useState(null);

    function startGame(seed:string){
        setGameSeed(seed);
        setGameStarted(true);
    }

    function showScreen(){
        if(gameStarted){
            return <Board key="board" gameBoard={GetBoard()} seed={gameSeed} />;
        }else{
            return <StartMenu startGame={startGame}/>
        }
    }

    return <div>{showScreen()}</div>;
}

ReactDOM.render(<Index />, document.getElementById('app'));