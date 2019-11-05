import * as React from 'react';
import './styles/square.scss';

// TODO: Maybe we should use a functional approach instead for drawing tiles?
const Canvas = () => {
    return <canvas height='75px' width='75px' />;
};

interface IDiceProps {}

export class Tile extends React.Component {
    trainTrackCanvas: any;

    constructor(props: IDiceProps) {
        super(props);
        this.trainTrackCanvas = React.createRef();
    }

    componentDidMount() {
        if (!this.trainTrackCanvas.current) {
            return;
        }
        const canvas: HTMLCanvasElement = this.trainTrackCanvas.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.fillStyle = 'rgb(200,0,0)';
            context.fillRect(10, 10, 55, 50);
        }
    }

    render() {
        return (
            <div className='dice'>
                <canvas ref={this.trainTrackCanvas}></canvas>
            </div>
        )
    }
}