import * as React from 'react';
import './styles/square.scss';
import { TileGraphics } from './TileGraphics';
import { IGameTile } from './GameModels';

interface ITileProps {
    tile: IGameTile,
}

export class Tile extends React.Component<ITileProps> {
    trainTrackCanvas: any;
    tileLength: number;
    graphicEngine: TileGraphics;

    constructor(props: ITileProps) {
        super(props);
        this.trainTrackCanvas = React.createRef();

        // TODO: Dont't bastard inject dimensions
        this.tileLength = 75;
    }

    componentDidMount() {
        // TODO: Should this be depedency injected? We can't create it until the components mount...
        this.graphicEngine = new TileGraphics(this.getCanvasContext(), this.tileLength);

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
            this.graphicEngine.DrawTile(this.props.tile.Type, this.props.tile.TileOrientation);
        }
    }

    render() {
        this.redrawTile();
        return (
            <div style={{width: this.tileLength, height: this.tileLength}}>
                <canvas ref={this.trainTrackCanvas} width={this.tileLength} height={this.tileLength}></canvas>
            </div>
        )
    }
}