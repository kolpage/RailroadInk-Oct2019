import * as React from 'react';
import '../styles/dice.scss';
import { Tile } from './Tile'
import { GameDice } from '../Models/GameDice';

interface IDiceProps {
    dice: GameDice;
    onDiceSelected: (dice:GameDice) => void;
}

export class Dice extends React.Component<IDiceProps> {
    diceSelected() {
        if (!this.props.dice.Played) {
            this.props.onDiceSelected(this.props.dice);
        }
    }

    getStatusClass() {
        if(this.props.dice.Played) {
            return 'disabled';
        }
        else {
            return 'active';
        }
    }

    private isDraggable() {
        return !this.props.dice.Played;
    }

    private handleDragStart(e) {
        this.diceSelected();
    }

    private handleDragEnd(e) {
        if (e.dataTransfer.dropEffect === 'none') {

        }
    }
    
    render() {
        return (
            <div 
                className={'dice ' + this.getStatusClass()}
                onClick={this.diceSelected.bind(this)}
                draggable={this.isDraggable()}
                onDragStart={this.handleDragStart.bind(this)}
                onDragEnd={this.handleDragEnd.bind(this)}
            >
                <Tile tile={this.props.dice.Tile} />
            </div>
        );
    }
}

