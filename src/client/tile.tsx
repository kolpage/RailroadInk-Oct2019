import * as React from 'react';
import './styles/square.scss';
import { TileGraphics } from './TileGraphics';
import { TileType, Orientation } from '../game/Enums';

// TODO: Maybe we should use a functional approach instead for drawing tiles?
const Canvas = () => {
    return <canvas height='75px' width='75px' />;
};

interface ITileProps {
    tile: TileType,
    tileOrientation: Orientation
}

export class Tile extends React.Component<ITileProps> {
    trainTrackCanvas: any;
    height: number;
    width: number;
    graphicEngine: TileGraphics;

    constructor(props: ITileProps) {
        super(props);
        this.trainTrackCanvas = React.createRef();

        // TODO: Dont't bastard inject dimensions
        this.height = 75;
        this.width = 75;
    }

    componentDidMount() {
        const context = this.getCanvasContext();

        // TODO: Should this be depedency injected? We can't create it until the components mount...
        this.graphicEngine = new TileGraphics(context, this.width, this.height);

        if (context) {
           const draw = this.graphicEngine.DrawTile(this.props.tile, this.props.tileOrientation);
        }
    }

    getCanvasContext() {
        if (!this.trainTrackCanvas.current) {
            return;
        }
        
        return this.trainTrackCanvas.current.getContext('2d');
    }

    redrawTile() {
        const context = this.getCanvasContext();
        if (context) {
            const draw = this.graphicEngine.DrawTile(this.props.tile, this.props.tileOrientation);
        }
    }

    render() {
        this.redrawTile();
        return (
            <div style={{width: this.width, height: this.height}}>
                <canvas ref={this.trainTrackCanvas}></canvas>
            </div>
        )
    }
}