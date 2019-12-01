import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../styles/dice.scss';
import { Tile } from './tile'
import { GameDice } from '../GameModels';

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
    
    render() {
        return (
            <div 
                className={'dice ' + this.getStatusClass()}
                onClick={this.diceSelected.bind(this)}
            >
                <Tile tile={this.props.dice.Tile} />
            </div>
        );
    }
}

