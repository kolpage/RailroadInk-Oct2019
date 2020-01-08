import * as React from 'react';
import '../styles/startMenu.scss';

const TrainImg = require("../Assests/Train.png")
const CarImg = require("../Assests/Car.png")

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
            <div>
                <figure><img src={TrainImg} className='trainImg' /></figure>
                {/*<figure><img src={CarImg} className='carImg' /></figure>*/}
            </div>
            <button className="startButton" onClick={startGameClicked}>Start Game</button>
            <div className="seedOption">
                <span title="Leave empty to get a random seed">Seed: </span>
                <input title="Leave empty to get a random seed" onChange={handleSeedChange}/>
            </div>
        </div>
    );
}