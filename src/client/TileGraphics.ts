import { TileType } from "../game/Enums";

// TODO: Feels like context, width, and hight should all be in one object
export interface ICanvasContext {

}

// TODO: Don't have this be static. Maybe should be an object on tile
export class TileGraphics {

    tileContext: CanvasRenderingContext2D;
    tileWidth: number;
    tileHeight: number;

    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.tileContext = context;
        this.tileWidth = width;
        this.tileHeight = height;
    }

    public drawTile(tile: TileType) {
        switch (tile) {
            case TileType.RoadStraight:
                return this.drawRoadStraight();
            case TileType.RailStraight:
                return this.drawRailStraight();
            case TileType.RailTurn:
                return this.drawRailTurn();
            default:
                return this.drawEmptyTile();    
            //return TileType[tile];
        }
    }

    rotateTile() {
        // Move registration point to the center of the canvas
        this.tileContext.translate(this.tileWidth/2, this.tileWidth/2);
	
        this.tileContext.rotate(96*Math.PI / 180);
    
        // Move registration point back to the top left corner of canvas
        this.tileContext.translate(-this.tileWidth/2, -this.tileWidth/2);
    }

    drawRailTurn() {
        //this.rotateTile();
        this.drawArch(this.tileWidth*(2/3));
        this.drawArch(this.tileWidth*(1/3));
    }

    drawArch(radius: number) {
        this.tileContext.beginPath();
        this.tileContext.arc(0, 0, radius, 0, 0.5*Math.PI);
        this.tileContext.stroke();
    }
    
    drawEmptyTile() {
        this.tileContext.clearRect(0, 0, this.tileWidth, this.tileHeight);
    }

    drawRailStraight() {
        this.drawLine(this.tileWidth/2, this.tileWidth/2, 0, this.tileHeight);
        this.drawTicks(this.tileWidth, this.tileHeight);
    }
    
    drawRoadStraight() {
        this.drawLine(this.tileWidth/3, this.tileWidth/3, 0, this.tileHeight);
        this.drawDottedLine(10, this.tileWidth/2, this.tileWidth/2, 0, this.tileHeight);
        this.drawLine(this.tileWidth*(2/3), this.tileWidth*(2/3), 0, this.tileHeight);
    }

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

    writeWords(text: string, width: number, height: number) {
        this.tileContext.fillText(text, 0, 0, width);
    }

    private getRadius(width: number , height: number) {
        return Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
    }
}