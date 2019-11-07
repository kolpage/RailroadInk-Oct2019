import * as React from 'react';
import './styles/square.scss';
import { TileGraphics } from './TileGraphics';
import { TileType } from '../game/Enums';

// TODO: Maybe we should use a functional approach instead for drawing tiles?
const Canvas = () => {
    return <canvas height='75px' width='75px' />;
};

interface ITileProps {
    tile: TileType
}

export class Tile extends React.Component<ITileProps> {
    trainTrackCanvas: any;
    height: number;
    width: number;

    constructor(props: ITileProps) {
        super(props);
        this.trainTrackCanvas = React.createRef();

        // TODO: Dont't bastard inject dimensions
        this.height = 75;
        this.width = 75;
    }

    componentDidMount() {
        const context = this.getCanvasContext();

        if (context) {
           //this.props.draw(context, this.width, this.height);
           const draw = TileGraphics.TileFactory(this.props.tile);
           draw(context, this.width, this.height);
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
            TileGraphics.drawEmptyTile(context, this.width, this.height);
            //this.props.draw(context, this.width, this.height);
            const draw = TileGraphics.TileFactory(this.props.tile);
            draw(context, this.width, this.height);
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