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
            <div className="welcomeMessage">Welcome to RailRoad Ink!</div>
            <button className="startButton" onClick={startGameClicked}>Start Game</button>
            <div className="seedOption">
                <span title="Leave empty to get a random seed">Seed: </span>
                <input title="Leave empty to get a random seed" onChange={handleSeedChange}/>
            </div>
        </div>
    );
}