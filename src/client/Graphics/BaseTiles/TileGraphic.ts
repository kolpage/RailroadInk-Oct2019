import { Orientation } from "../../../common/Enums";

export abstract class TileGraphic {
    public abstract Draw(): void;

    private tileContext: CanvasRenderingContext2D;
    private tileLength: number;
    private tileOrientation: Orientation;

    constructor(context: CanvasRenderingContext2D, length: number) {
        this.tileContext = context;
        this.tileLength = length;
        this.tileOrientation = Orientation.up;
    }

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
        const tickSpacing = this.tileLength/7;
        const edgePadding = tickSpacing/2;
        for(let i = yStart+edgePadding; i<yEnd; i+=tickSpacing) {
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
        const segmentSpacing = this.tileLength/8;
        const edgePadding = segmentSpacing/2;
        this.tileContext.setLineDash([segmentSpacing]);
        this.drawLine(xStart, xEnd, yStart+edgePadding, yEnd);
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
}