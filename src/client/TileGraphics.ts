import { TileType, Orientation } from "../common/Enums";

// TODO: Name these better
const RoadXStartPercent = 0.35;
const RoadXEndPercent = 0.65;

export class TileGraphics {
    private tileContext: CanvasRenderingContext2D;
    private tileWidth: number;
    private tileHeight: number;
    private tileOrientation: Orientation;

    constructor(context: CanvasRenderingContext2D, width: number, height: number) {
        this.tileContext = context;
        this.tileWidth = width;
        this.tileHeight = height;
        this.tileOrientation = Orientation.up;
    }

    public DrawTile(tile: TileType, orientation: Orientation) {
        this.clearCanvas(); // Clear out the current drawing
        this.rotateTileToOrientation(orientation);

        // TODO: There has got to be a better way to program than this than using a gaint switch statement
        switch (tile) {
            case TileType.RoadStraight:
                this.drawRoadStraight();
                break;
            case TileType.RailStraight:
                this.drawRailStraight();
                break;
            case TileType.RailTurn:
                this.drawRailTurn();
                break;
            case TileType.RoadTurn:
                this.drawRoadTurn();
                break;
            case TileType.StationStraight:
                this.drawStationStraight();
                break;
            case TileType.StationTurn:
                this.drawStationTurn();
                break;
            case TileType.RoadThreeWay:
                // TODO: Draw this correctly
                this.drawRoadThreeWay();
                break;
            case TileType.RailThreeWay:
                this.drawRailThreeWay();
                break;
            case TileType.Empty:
            default:
                return this.clearCanvas();    
        }
    }

    public DrawTileWithOrientation(tile: TileType, orientation: Orientation) {

    }  

    private drawStationStraight() {
        this.drawRail(0, this.tileHeight/2);
        this.drawRoad(this.tileHeight/2, this.tileHeight);
        this.drawStation();
    }
    
    private drawStationTurn() {
        this.drawRail(0, this.tileHeight/2);

        // TODO: Find a better way to draw the road in the right orientation
        let roadOrientation = this.tileOrientation + 3;
        if (roadOrientation >= Orientation._length) {roadOrientation -= Orientation._length}

        this.rotateTileToOrientation(roadOrientation);
        this.drawRoad(this.tileHeight/2, this.tileHeight);
        this.rotateTileToOrientation(this.tileOrientation);
        this.drawStation();
    }

    // #region Piece drawing functions
    private drawRoadStraight() {
        this.drawRoad(0, this.tileHeight)
    }

    private drawRoad(yStart: number, yEnd: number) {
        this.drawLine(this.tileWidth*RoadXStartPercent, this.tileWidth*RoadXStartPercent, yStart, yEnd);
        this.drawDottedLine(10, this.tileWidth*(1/2), this.tileWidth*(1/2), yStart, yEnd);
        this.drawLine(this.tileWidth*RoadXEndPercent, this.tileWidth*RoadXEndPercent, yStart, yEnd);
    }

    private drawRoadTurn() {
        this.drawArc(this.tileWidth*RoadXStartPercent);
        this.drawDashedArc(this.tileWidth*(1/2));
        this.drawArc(this.tileWidth*RoadXEndPercent);
    }

    private drawRoadThreeWay() {
        // TODO: Next two lines are also used in straight road...maybe share logic
        this.drawLine(this.tileWidth/3, this.tileWidth/3, 0, this.tileHeight);
        this.drawDottedLine(10, this.tileWidth/2, this.tileWidth/2, 0, this.tileHeight);

        this.drawArc(this.tileWidth*(2/3));

        this.drawStation();
    }  

    private drawRailStraight() {
        this.drawRail(0, this.tileHeight);
    }

    private drawRail(yStart: number, yEnd: number) {
        this.drawLine(this.tileWidth/2, this.tileWidth/2, yStart, yEnd);
        this.drawTicks(yStart, yEnd);
    }

    private drawRailTurn() {
        this.drawArc(this.tileWidth*(1/2));
    }

    private drawRailThreeWay() {
        // TODO: Clean up how the ticks are drawn
        this.drawRailStraight();

        // TODO: Find a better way to draw the road in the right orientation
        // TODO: This code is also used by drawStationTurn() -> REFACTOR!
        let railOrientation = this.tileOrientation + 3;
        if (railOrientation >= Orientation._length) {railOrientation -= Orientation._length}

        this.rotateTileToOrientation(railOrientation);
        this.drawRail(this.tileHeight/2, this.tileHeight);
        this.rotateTileToOrientation(this.tileOrientation);
    }
    // #endregion
    
    // #region Core drawing function
    private drawStation() {
        this.tileContext.beginPath();
        this.tileContext.fillRect(this.tileWidth*(1/3), this.tileHeight*(1/3), this.tileWidth*(1/3), this.tileHeight*(1/3));
        this.tileContext.stroke();
    }

    private drawTicks(yStart: number, yEnd: number) {
        for(let i = yStart; i<yEnd; i+=10) {
            this.drawLine(this.tileWidth*0.40, this.tileWidth*0.60, i, i);
        }
    }

    private drawDottedLine(segLength: number, xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.tileContext.setLineDash([10]);
        this.drawLine(xStart, xEnd, yStart, yEnd);
        this.tileContext.setLineDash([]);
    }

    private drawLine(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.tileContext.beginPath();
        this.tileContext.moveTo(xStart,yStart);
        this.tileContext.lineTo(xEnd, yEnd);
        this.tileContext.stroke();
    }

    private drawDashedArc(radius: number) {
        this.tileContext.setLineDash([10]);
        this.drawArc(radius);
        this.tileContext.setLineDash([]);
    }

    private drawArc(radius: number) {
        this.tileContext.beginPath();
        this.tileContext.arc(0, 0, radius, 0, 0.5*Math.PI);
        this.tileContext.stroke();
    }
    
    private clearCanvas() {
        this.tileContext.clearRect(0, 0, this.tileWidth, this.tileHeight);
    }

    private rotateTileToOrientation(orientation: number) {
        const turns = orientation - this.tileOrientation;
        this.rotate(turns*90);
        this.tileOrientation = orientation;
    }

    private rotate(degrees: number) {
        // Move registration point to the center of the canvas
        this.tileContext.translate(this.tileWidth/2, this.tileWidth/2);
	
        this.tileContext.rotate(degrees*Math.PI / 180);
    
        // Move registration point back to the top left corner of canvas
        this.tileContext.translate(-this.tileWidth/2, -this.tileWidth/2);
    }

    private writeWords(text: string, width: number, height: number) {
        this.tileContext.fillText(text, 0, 0, width);
    }
    // #endregion


    private getRadius(width: number , height: number) {
        return Math.sqrt(Math.pow(width,2) + Math.pow(height,2));
    }
}