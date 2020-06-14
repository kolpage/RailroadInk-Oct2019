import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Board } from './Components/Board';
import StartMenu from './Components/StartMenu';
import { GetBoard } from './GameServices';
import { GameType } from '../common/Enums';
import { GameBoard } from './Models/GameBoard';

const ThemeContext = React.createContext(false);

function PlayArea(){
    const [gameStarted, setGameStarted] = React.useState(false);
    const [gameSeed, setGameSeed] = React.useState(null);
    const [gameType, setGameType] = React.useState(GameType.Base);
    const [gameBoard, setGameBoard] = React.useState(new GameBoard(7,7));
    const [useClassicArt, setUseClassicArt] = React.useState(false);

    function startGame(gameType: GameType, seed:string, useClassicArt: boolean){
        setGameSeed(seed);
        setGameStarted(true);
        setGameType(gameType);
        setUseClassicArt(useClassicArt);
        
    }

    function showScreen(){
        if(gameStarted){
            return(
            <ThemeContext.Provider value={useClassicArt}>
             <Board key="board" gameBoard={gameBoard} gameType={gameType} seed={gameSeed} />
            </ThemeContext.Provider>
            );
        }else{
            return <StartMenu startGame={startGame}/>
        }
    }

    return <div>{showScreen()}</div>;
}

ReactDOM.render(<PlayArea />, document.getElementById('app'));