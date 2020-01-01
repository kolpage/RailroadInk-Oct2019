import * as React from 'react';
import '../styles/dice.scss';
import { Tile } from './Tile'
import { GameDice } from '../Models/GameDice';

interface IDiceProps {
    dice: GameDice;
    onDiceSelected: (dice:GameDice) => void;
}

export default function Dice(props: IDiceProps){
    function diceSelected() {
        if (!props.dice.Played) {
            props.onDiceSelected(props.dice);
        }
    }

    function getStatusClass() {
        if(props.dice.Played) {
            return 'disabled';
        }
        else {
            return 'active';
        }
    }

    function isDraggable() {
        return !props.dice.Played;
    }

    function handleDragStart(e) {
        diceSelected();
    }

    function handleDragEnd(e) {
        if (e.dataTransfer.dropEffect === 'none') {

        }
    }
    
    return (
        <div 
            className={'dice ' + getStatusClass()}
            onClick={diceSelected}
            draggable={isDraggable()}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <Tile tile={props.dice.Tile} />
        </div>
    );
}

