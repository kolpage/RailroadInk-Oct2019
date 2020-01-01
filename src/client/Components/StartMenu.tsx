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
        <div>
            <div>Welcome to RailRoad Inc!</div>
            <button onClick={startGameClicked}>Start Game</button>
            <div>
                <span>Seed: </span>
                <input onChange={handleSeedChange}/>
            </div>
        </div>
    );
}