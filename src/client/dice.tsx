import * as React from 'react';
import './styles/square.scss';

interface IDiceProps {
    color: string;
    onDiceSelected: (color: string)=>void;
}

// TODO: Maybe this should be a child of Square
export class Dice extends React.Component<IDiceProps> {
    diceSelected() {
        this.props.onDiceSelected(this.props.color);
    }
    
    render() {
        return (
            <div 
                className='dice' 
                style={{background: this.props.color}}
                onClick={this.diceSelected.bind(this)}
            >
            </div>
        );
    }
}