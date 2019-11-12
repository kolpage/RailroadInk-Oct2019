import { TileType, Orientation } from "../common/Enums";

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
            case TileType.StationTurnMirror:
                this.drawStationTurnMirror();
                break;
            case TileType.RoadThreeWay:
                this.drawRoadThreeWay();
                break;
            case TileType.RailThreeWay:
                this.drawRailThreeWay();
                break;
            case TileType.Overpass:
                this.drawOverpass();
                break;
            case TileType.SpecialAllRail:
                this.drawSpecialAllRail();
                break;
            case TileType.SpecialThreeRailOneRoad:
                this.drawSpecialThreeRailOneRoad();
                break;
            case TileType.SpecialRoadRailAcross:
                this.drawSpecialRoadRailAcross();
                break;
            case TileType.SpecialThreeRoadOneRail:
                this.drawSpecialThreeRoadOneRail();
                break;
            case TileType.SpecialAllRoad:
                this.drawSpecialAllRoad();
                break;
            case TileType.SpecialRoadRailAdjacent:
                this.drawSpecialRoadRailAdjacent();
                break;
            case TileType.Empty:
            default:
                return this.clearCanvas();    
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
        this.drawLine(this.tileLength/3, this.tileLength/3, 0, this.tileLength);
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
        //this.rotateAndDraw(Orientation.up, this.drawArc.bind(this, this.tileLength*RoadXStartPercent));

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
    // #endregion
    
    // #region Core drawing function
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

    private writeWords(text: string, width: number, height: number) {
        this.tileContext.fillText(text, 0, 0, width);
    }

    private getDrawingOrientation(defaultOrientation: Orientation) {
        // TODO: Find a better way to draw the rail/road in the right orientation
        let drawOrientation = this.tileOrientation + defaultOrientation;
        if (drawOrientation >= Orientation._length) {drawOrientation -= Orientation._length}
        return drawOrientation;
    }
    // #endregion
}