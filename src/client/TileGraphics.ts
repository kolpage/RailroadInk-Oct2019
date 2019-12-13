import { TileType, Orientation } from "../common/Enums";
import { IGameTile } from "./Models/GameTile";

// TODO: Name these better
const RoadXStartPercent = 0.35;
const RoadXEndPercent = 0.65;

export class TileGraphics {
    private tileContext: CanvasRenderingContext2D;
    private tileLength: number;
    private tileOrientation: Orientation;

    constructor(context: CanvasRenderingContext2D, length: number) {
        this.tileContext = context;
        this.tileLength = length;
        this.tileOrientation = Orientation.up;
    }

    public DrawTile(tile: IGameTile) {
        this.clearCanvas(); // Clear out the current drawing
        this.rotateTileToOrientation(tile.TileOrientation);

        // TODO: There has got to be a better way to program than this than using a gaint switch statement
        switch (tile.Type) {
            case TileType.RoadStraight: return this.drawRoadStraight();
            case TileType.RailStraight: return this.drawRailStraight();
            case TileType.RailTurn: return this.drawRailTurn();
            case TileType.RoadTurn: return this.drawRoadTurn();
            case TileType.StationStraight: return this.drawStationStraight();
            case TileType.StationTurn: return this.drawStationTurn();
            case TileType.StationTurnMirror: return this.drawStationTurnMirror();
            case TileType.RoadThreeWay: return this.drawRoadThreeWay();
            case TileType.RailThreeWay: return this.drawRailThreeWay();
            case TileType.Overpass: return this.drawOverpass();
            case TileType.SpecialAllRail: return this.drawSpecialAllRail();
            case TileType.SpecialThreeRailOneRoad: return this.drawSpecialThreeRailOneRoad();
            case TileType.SpecialThreeRoadOneRail: return this.drawSpecialThreeRoadOneRail();
            case TileType.SpecialAllRoad: return this.drawSpecialAllRoad();
            case TileType.SpecialRoadRailAdjacent: return this.drawSpecialRoadRailAdjacent();
            case TileType.SpecialRoadRailAcross: return this.drawSpecialRoadRailAcross();
            case TileType.Empty:
            default: return this.clearCanvas();    
        }
    }

    // #region Piece drawing functions
    private drawStationStraight() {
        this.drawSingleStation(Orientation.down);
    }
    
    private drawStationTurn() {
        this.drawSingleStation(Orientation.left);
    }

    private drawStationTurnMirror() {
        this.drawSingleStation(Orientation.right);
    }

    private drawSingleStation(roadOrientation: Orientation) {
        this.drawRail(0, this.tileLength/2);
        this.rotateAndDraw(roadOrientation, this.drawRoad.bind(this, 0, this.tileLength/2));
        this.drawStation();
    }

    private drawRoadStraight() {
        this.drawRoad(0, this.tileLength)
    }

    private drawRoad(yStart: number, yEnd: number) {
        this.drawLine(this.tileLength*RoadXStartPercent, this.tileLength*RoadXStartPercent, yStart, yEnd);
        this.drawDottedLine(10, this.tileLength*(1/2), this.tileLength*(1/2), yStart, yEnd);
        this.drawLine(this.tileLength*RoadXEndPercent, this.tileLength*RoadXEndPercent, yStart, yEnd);
    }

    private drawRoadTurn() {
        this.drawArc(this.tileLength*RoadXStartPercent);
        this.drawDashedArc(this.tileLength*(1/2));
        this.drawArc(this.tileLength*RoadXEndPercent);
    }

    private drawRoadThreeWay() {
        // TODO: Next two lines are also used in straight road...maybe share logic
        this.drawLine(this.tileLength*RoadXStartPercent, this.tileLength*RoadXStartPercent, 0, this.tileLength);
        this.drawDottedLine(10, this.tileLength/2, this.tileLength/2, 0, this.tileLength);

        this.rotateAndDraw(Orientation.right, this.drawArc.bind(this, this.tileLength*RoadXStartPercent));
        this.rotateAndDraw(Orientation.down, this.drawArc.bind(this, this.tileLength*RoadXStartPercent));
        this.rotateAndDraw(Orientation.right, this.drawDottedLine.bind(this, 10, this.tileLength*(1/2), this.tileLength*(1/2), 0, this.tileLength/2));
    }  

    private drawOverpass() {
        this.drawRoadStraight();
        this.rotateTileToOrientation(this.tileOrientation+1);
        this.drawRail(0, RoadXStartPercent*this.tileLength);
        this.drawRail(RoadXEndPercent*this.tileLength, this.tileLength);
        this.rotateTileToOrientation(this.tileOrientation);
    }

    private drawSpecialAllRoad() {
        this.drawArc(this.tileLength*RoadXStartPercent);
        this.rotateAndDraw(Orientation.right, this.drawArc.bind(this, this.tileLength*RoadXStartPercent));
        this.rotateAndDraw(Orientation.down, this.drawArc.bind(this, this.tileLength*RoadXStartPercent));
        this.rotateAndDraw(Orientation.left, this.drawArc.bind(this, this.tileLength*RoadXStartPercent));

        this.drawDottedLine(10, this.tileLength*(1/2), this.tileLength*(1/2), 0, this.tileLength);
        this.rotateAndDraw(Orientation.right, this.drawDottedLine.bind(this, 10, this.tileLength*(1/2), this.tileLength*(1/2), 0, this.tileLength));
    }

    private drawRailStraight() {
        this.drawRail(0, this.tileLength);
    }

    private drawRail(yStart: number, yEnd: number) {
        this.drawLine(this.tileLength/2, this.tileLength/2, yStart, yEnd);
        this.drawTicks(yStart, yEnd);
    }

    private drawRailTurn() {
        this.drawArc(this.tileLength*(1/2));
    }

    private drawRailThreeWay() {
        // TODO: Clean up how the ticks are drawn
        this.drawRailStraight();
        this.rotateAndDraw(Orientation.right, this.drawRail.bind(this,0,this.tileLength/2));
    }

    private drawSpecialAllRail() {
        this.drawRailStraight();
        this.rotateAndDraw(Orientation.right, this.drawRailStraight.bind(this));
    }

    private drawSpecialThreeRailOneRoad() {
        this.rotateAndDraw(Orientation.down, this.drawStationStraight.bind(this));
        this.rotateAndDraw(Orientation.right, this.drawRailStraight.bind(this));
    }

    private drawSpecialThreeRoadOneRail() {
        this.rotateAndDraw(Orientation.down, this.drawStationStraight.bind(this));
        this.rotateAndDraw(Orientation.right, this.drawRoadStraight.bind(this));
    }

    private drawSpecialRoadRailAcross() {
        this.drawRoadStraight();
        this.rotateAndDraw(Orientation.right, this.drawRailStraight.bind(this));
        this.drawStation();
    }

    private drawSpecialRoadRailAdjacent() {
        this.rotateAndDraw(Orientation.right, this.drawRail.bind(this, 0, this.tileLength/2));
        this.rotateAndDraw(Orientation.down, this.drawRail.bind(this, 0, this.tileLength/2));
        this.rotateAndDraw(Orientation.left, this.drawRoad.bind(this, 0, this.tileLength/2));
        this.rotateAndDraw(Orientation.up, this.drawRoad.bind(this, 0, this.tileLength/2));
        this.drawStation();
    }

    private drawHalfLake() {
        this.tileContext.fillStyle = 'blue';
        this.tileContext.fillRect(0, 0, this.tileLength, this.tileLength);
        //this.drawLine(0, this.tileLength, 0, this.tileLength);
        this.drawWavyLine(0, this.tileLength, 0, this.tileLength);
    }
    // #endregion
    
    // #region Core drawing function

    /**
     * Rotates a drawing canvas to the given orientation and calls the draw function.
     * Rotates the canvas back to what it was before this function call. 
     * @param orientation  The orientation to rotate to the top position 
    */
    private rotateAndDraw(orientation: Orientation, drawFunction: () => void) {
        
        // TODO: This is probably a bad sign that state is getting saved and restored
        const originalOrientation = this.tileOrientation;
        const newOrientation = this.getDrawingOrientation(orientation);
        this.rotateTileToOrientation(newOrientation);
        drawFunction();
        this.rotateTileToOrientation(originalOrientation);
    }

    private drawStation() {
        this.tileContext.beginPath();
        this.tileContext.fillRect(this.tileLength*(1/3), this.tileLength*(1/3), this.tileLength*(1/3), this.tileLength*(1/3));
        this.tileContext.stroke();
    }

    private drawTicks(yStart: number, yEnd: number) {
        for(let i = yStart; i<yEnd; i+=10) {
            this.drawLine(this.tileLength*0.40, this.tileLength*0.60, i, i);
        }
    }

    private drawWavyLine(xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.tileContext.beginPath();
        this.tileContext.moveTo(xStart, yStart);
        this.tileContext.bezierCurveTo(20, 50, 50,20,xEnd, yEnd);
        this.tileContext.stroke();
    }

    private drawDottedLine(segLength: number, xStart: number, xEnd: number, yStart: number, yEnd: number) {
        this.tileContext.setLineDash([segLength]);
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
        this.tileContext.clearRect(0, 0, this.tileLength, this.tileLength);
    }

    private rotateTileToOrientation(orientation: number) {
        const turns = orientation - this.tileOrientation;
        this.rotate(turns*90);
        this.tileOrientation = orientation;
    }

    private rotate(degrees: number) {
        // Move registration point to the center of the canvas
        this.tileContext.translate(this.tileLength/2, this.tileLength/2);
	
        this.tileContext.rotate(degrees*Math.PI / 180);
    
        // Move registration point back to the top left corner of canvas
        this.tileContext.translate(-this.tileLength/2, -this.tileLength/2);
    }

    private getDrawingOrientation(defaultOrientation: Orientation) {
        // TODO: Find a better way to draw the rail/road in the correct orientation
        let drawOrientation = this.tileOrientation + defaultOrientation;
        if (drawOrientation >= Orientation._length) {drawOrientation -= Orientation._length}
        return drawOrientation;
    }
    // #endregion
}

class Stroke {
    segLength: number;
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
}