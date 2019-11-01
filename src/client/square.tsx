import * as React from 'react';
import './styles/square.scss';

// TODO: Figure out how you are suppose to use React state
interface ISquareState {
    selected: boolean;
    color: string;
}

interface ISquareProps {
    selectionColor: string;
}

export class Square extends React.Component<ISquareProps, ISquareState> {
    constructor(props: ISquareProps) {
        super(props);
        this.state = {
            selected: false,
            color: 'white'
        }
    }
    
    changeSelected() {
        const isSelected = !this.state.selected;
        const newColor = isSelected ? this.props.selectionColor: 'white'; 
        this.setState({selected: isSelected, color: newColor})
    }

    render() {
        return (
            <div 
                className='square' 
                style={{background: this.state.color}}
                onClick={this.changeSelected.bind(this)}
            >
            </div>
        );
    }
}