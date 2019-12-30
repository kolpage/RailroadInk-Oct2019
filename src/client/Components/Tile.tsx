import * as React from 'react';
import '../styles/tile.scss';
import { TileGraphics } from '../Graphics/TileGraphics';
import { IGameTile } from '../Models/GameTile';

interface ITileProps {
    tile: IGameTile,
    length: number,
}

export class Tile extends React.Component<ITileProps> {
    trainTrackCanvas: any;
    tileLength: number;
    graphicEngine: TileGraphics;
    height: number;
    width: number;
    styleClass: string;

    public static defaultProps = {
        length: 75
    };

    constructor(props: ITileProps) {
        super(props);
        this.trainTrackCanvas = React.createRef();
        this.height = this.props.length;
        this.width = this.props.length;
    }

    componentDidMount() {
        // TODO: Should this be depedency injected? We can't create it until the components mount...
        this.graphicEngine = new TileGraphics(this.getCanvasContext(), this.props.length);

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
            this.graphicEngine.DrawTile(this.props.tile);
        }
    }

    render() {
        this.redrawTile();
        return (
            <div className={this.styleClass} style={{width: this.width, height: this.height}}>
                <canvas ref={this.trainTrackCanvas} width={this.width} height={this.height}></canvas>
            </div>
        )
    }
}

export class ExitTile extends Tile{
    constructor(props: ITileProps) {
        super(props);
        this.width = this.props.length;
        this.height = this.props.length*(1/3);
        this.styleClass = 'exitCell'
    }
}

export class ExitTileSide extends Tile{
    constructor(props: ITileProps) {
        super(props);
        this.width = this.props.length*(1/3);
        this.height = this.props.length;
        this.styleClass = 'exitCellSide'
    }
}