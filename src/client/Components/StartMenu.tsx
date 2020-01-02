import * as React from 'react';
import '../styles/startMenu.scss';

interface IStartMenuPros{
    startGame: (seed: string) => void;
}

export default function StartMenu(props: IStartMenuPros){
    const [seed, setSeed] = React.useState("");
    
    function startGameClicked(){
        props.startGame(seed);
    }

    function handleSeedChange(e){
        setSeed(e.target.value);
    }
    
    return(
        <div className="centerBox">
            <div className="welcomeMessage">Welcome to RailRoad Inc!</div>
            <button onClick={startGameClicked}>Start Game</button>
            <div className="startButton">
                <span>Seed: </span>
                <input onChange={handleSeedChange}/>
            </div>
        </div>
    );
}