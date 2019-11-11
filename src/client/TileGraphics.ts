import { TileType, Orientation } from "../common/Enums";

export class TileGraphics {

    private tileContext: CanvasRenderingContext2D;
    private tileWidth: number;
    private tileHeight: number;
    private tileType: TileType;
    private tileOrientation: Orientation;

    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.tileContext = context;
        this.tileWidth = width;
        this.tileHeight = height;
        this.tileType = TileType.Empty;
        this.tileOrientation = Orientation.up;
    }

    public DrawTile(tile: TileType, orientation: Orientation) {
        this.tileType = tile;
        this.clearCanvas(); // Clear out the current drawing
        this.rotateTileToOrientation(orientation);

        switch (tile) {
            case TileType.RoadStraight:
                return this.drawRoadStraight();
            case TileType.RailStraight:
                return this.drawRailStraight();
            case TileType.RailTurn:
                return this.drawRailTurn();
            case TileType.Empty:
            default:
                return this.clearCanvas();    
            //return TileType[tile];
        }
    }

    public DrawTileWithOrientation(tile: TileType, orientation: Orientation) {

    }

    private rotateTileToOrientation(orientation: number) {
        const turns = orientation - this.tileOrientation;
        this.rotate(turns*90);
        this.tileOrientation = orientation;
    }
    
    // #region Piece drawing functions
    private drawRailTurn() {
        // TODO: Draw this (or rotate it by default) so that its 'up' position is the default way it gets drawn
        this.drawArch(this.tileWidth*(2/3));
        this.drawArch(this.tileWidth*(1/3));
    }

    private drawRailStraight() {
        this.drawLine(this.tileWidth/2, this.tileWidth/2, 0, this.tileHeight);
        this.drawTicks(this.tileWidth, this.tileHeight);
    }
    
    private drawRoadStraight() {
        this.drawLine(this.tileWidth/3, this.tileWidth/3, 0, this.tileHeight);
        this.drawDottedLine(10, this.tileWidth/2, this.tileWidth/2, 0, this.tileHeight);
        this.drawLine(this.tileWidth*(2/3), this.tileWidth*(2/3), 0, this.tileHeight);
    }
    // #endregion
    
    // #region Core drawing function
    drawTicks(width: number, height: number) {
        for(let i = 0; i<height; i+=10) {
            this.drawLine(width*0.40, width*0.60, i, i);
        }
    }

    drawDottedLine(segLength: number, xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.tileContext.setLineDash([10]);
        this.drawLine(xStart, xEnd, yStart, yEnd);
        this.tileContext.setLineDash([]);
    }

    drawLine(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.tileContext.beginPath();
        this.tileContext.moveTo(xStart,yStart);
        this.tileContext.lineTo(xEnd, yEnd);
        this.tileContext.stroke();
    }

    private drawArch(radius: number) {
        this.tileContext.beginPath();
        this.tileContext.arc(0, 0, radius, 0, 0.5*Math.PI);
        this.tileContext.stroke();
    }
    
    private clearCanvas() {
        this.tileContext.clearRect(0, 0, this.tileWidth, this.tileHeight);
    }

    private rotate(degrees: number) {
        // Move registration point to the center of the canvas
        this.tileContext.translate(this.tileWidth/2, this.tileWidth/2);
	
        this.tileContext.rotate(degrees*Math.PI / 180);
    
        // Move registration point back to the top left corner of canvas
        this.tileContext.translate(-this.tileWidth/2, -this.tileWidth/2);
    }

    writeWords(text: string, width: number, height: number) {
        this.tileContext.fillText(text, 0, 0, width);
    }
    // #endregion


    private getRadius(width: number , height: number) {
        return Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
    }
}