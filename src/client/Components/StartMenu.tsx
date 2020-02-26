import * as React from 'react';
import '../styles/startMenu.scss';
import { GameType } from '../../common/Enums';

const TrainImg = require("../Assests/Train.png")
const CarImg = require("../Assests/Car.png")

interface IStartMenuPros{
    startGame: (gameType: GameType, seed: string) => void;
}

export default function StartMenu(props: IStartMenuPros){
    const [seed, setSeed] = React.useState("");
    const [gameType, setGameType] = React.useState(GameType.Base);
    
    function startGameClicked(){
        props.startGame(gameType, seed);
    }

    function handleSeedChange(e){
        setSeed(e.target.value);
    }

    function handleGameTypeChange(e){
        setGameType(e.target.value);
    }
    
    return(
        <div className="centerBox">
            <div className="welcomeMessage">Welcome to RailRoad Ink!</div>
            <div>
                <figure><img src={TrainImg} className='trainImg' /></figure>
                {/*<figure><img src={CarImg} className='carImg' /></figure>*/}
            </div>
            <button className="startButton" onClick={startGameClicked}>Start Game</button>
            
            <p>Select a game type:</p>
            <div>
                <input type="radio" name="base" value={GameType.Base} onChange={handleGameTypeChange} checked/>
                <label>Base</label>
            </div>
            <div>
                <input type="radio" name="river" value={GameType.River} onChange={handleGameTypeChange}/>
                <label>River</label>
            </div>
            <div>
                <input type="radio" name="lake" value={GameType.Lake} onChange={handleGameTypeChange}/>
                <label>Lake</label>
            </div>

            <div className="seedOption">
                <span title="Leave empty to get a random seed">Seed: </span>
                <input title="Leave empty to get a random seed" onChange={handleSeedChange}/>
            </div>
        </div>
    );
}