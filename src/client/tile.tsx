import * as React from 'react';
import './styles/square.scss';
import { TileGraphics } from './TileGraphics';
import { TileType, Orientation } from '../common/Enums';

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
        // TODO: Should this be depedency injected? We can't create it until the components mount...
        this.graphicEngine = new TileGraphics(this.getCanvasContext(), this.width, this.height);

        this.redrawTile();
    }

    getCanvasContext() {
        if (!this.trainTrackCanvas.current) { return; }
        return this.trainTrackCanvas.current.getContext('2d');
    }

    redrawTile() {
        // TODO: It would be nice to not check for context but the render function might cause errors 
        //       since canvas doesn't get a context until it's first drawn
        if (this.getCanvasContext()) {
            this.graphicEngine.DrawTile(this.props.tile, this.props.tileOrientation);
        }
    }

    render() {
        this.redrawTile();
        return (
            <div style={{width: this.width, height: this.height}}>
                <canvas ref={this.trainTrackCanvas} width={this.width} height={this.height}></canvas>
            </div>
        )
    }
}