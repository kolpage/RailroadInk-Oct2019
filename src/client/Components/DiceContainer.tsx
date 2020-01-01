import * as React from 'react';
import Dice from './Dice';
import '../styles/inventory.scss';
import { GameDice } from '../Models/GameDice';

interface IInventoryProps {
    dice: GameDice[];
    onDiceSelected: (tile:GameDice) => void; 
}

export default function DiceContainer(props: IInventoryProps){
    function createRow(): React.ReactElement {
        let row = [];
        for (var i = 0; i < props.dice.length; i++) {
            const dice = props.dice[i];
            row.push(<Dice dice={dice} onDiceSelected={props.onDiceSelected} key={dice.Id}/>);
        }

        return (
            <div className='column'>
                {row}
            </div>
        );
    }
    
    return (
        <div className='inventory'>
             {createRow()} 
         </div>
         );
}