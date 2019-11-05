import * as React from 'react';
import './styles/square.scss';

// TODO: Maybe we should use a functional approach instead for drawing tiles?
const Canvas = () => {
    return <canvas height='75px' width='75px' />;
};

interface IDiceProps {}

export class Tile extends React.Component {
    trainTrackCanvas: any;
    height: number;
    width: number;

    constructor(props: IDiceProps) {
        super(props);
        this.trainTrackCanvas = React.createRef();

        // TODO: Dont't bastard inject dimensions
        this.height = 75;
        this.width = 75;
    }

    componentDidMount() {
        if (!this.trainTrackCanvas.current) {
            return;
        }
        const canvas: HTMLCanvasElement = this.trainTrackCanvas.current;
        const context = canvas.getContext('2d');
        if (context) {
           this.drawRoad(context);
        }
    }

    drawRoad(context: CanvasRenderingContext2D) {
        this.drawLine(this.width/3, this.width/3, 0, this.height, context);
        this.drawDottedLine(10, this.width/2, this.width/2, 0, this.height, context);
        this.drawLine(this.width*(2/3), this.width*(2/3), 0, this.height, context);
    }

    drawDottedLine(segLength: number, xStart: number, xEnd: number, yStart: number, yEnd: number, context: CanvasRenderingContext2D) {
        context.setLineDash([10]);
        this.drawLine(xStart, xEnd, yStart, yEnd, context);
        context.setLineDash([]);
    }

    drawLine(xStart: number, xEnd: number, yStart: number, yEnd: number, context: CanvasRenderingContext2D) {
        context.beginPath();
        context.moveTo(xStart,yStart);
        context.lineTo(xEnd, yEnd);
        context.stroke();
    }

    render() {
        return (
            <div className='dice'>
                <canvas ref={this.trainTrackCanvas}></canvas>
            </div>
        )
    }
}