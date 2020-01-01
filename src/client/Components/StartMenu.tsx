import * as React from 'react';
import * as GameServices from '../GameServices'
import '../styles/startMenu.scss';

interface IStartMenuPros{
    startGame: () => void;
}

export default function StartMenu(props: IStartMenuPros){
    function startGameClicked(){
        props.startGame();
    }
    
    return(
        <div>
            <div>Welcome to RailRoad Inc!</div>
            <button onClick={startGameClicked}>Start Game</button>
        </div>
    );
}