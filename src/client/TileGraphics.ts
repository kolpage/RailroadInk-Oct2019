import { TileType } from "../game/Enums";

// TODO: Feels like context, width, and hight should all be in one object
export interface ICanvasContext {

}

// TODO: Don't have this be static. Maybe should be an object on tile
export class TileGraphics {

    static TileFactory(tile: TileType) {
        switch (tile) {
            case TileType.RoadStraight:
                return TileGraphics.drawRoad;
            case TileType.RailStraight:
                return TileGraphics.drawRail;
            default:
                return TileGraphics.drawEmptyTile;    
            //return TileType[tile];
        }
    }

    
    static drawEmptyTile(context: CanvasRenderingContext2D, width: number, height: number) {
        context.clearRect(0, 0, width, height);
    }

    static drawRail(context: CanvasRenderingContext2D, width: number, height: number) {
        TileGraphics.drawLine(width/2, width/2, 0, height, context);
        TileGraphics.drawTicks(context, width, height);
    }
    
    static drawRoad(context: CanvasRenderingContext2D, width: number, height: number) {
        TileGraphics.drawLine(width/3, width/3, 0, height, context);
        TileGraphics.drawDottedLine(10, width/2, width/2, 0, height, context);
        TileGraphics.drawLine(width*(2/3), width*(2/3), 0, height, context);
    }

    static drawTicks(context: CanvasRenderingContext2D, width: number, height: number) {
        for(let i = 0; i<height; i+=10) {
            TileGraphics.drawLine(width*0.40, width*0.60, i, i, context);
        }
    }

    static drawDottedLine(segLength: number, xStart: number, xEnd: number, yStart: number, yEnd: number, context: CanvasRenderingContext2D) {
        context.setLineDash([10]);
        TileGraphics.drawLine(xStart, xEnd, yStart, yEnd, context);
        context.setLineDash([]);
    }

    static drawLine(xStart: number, xEnd: number, yStart: number, yEnd: number, context: CanvasRenderingContext2D) {
        context.beginPath();
        context.moveTo(xStart,yStart);
        context.lineTo(xEnd, yEnd);
        context.stroke();
    }

    static writeWords(text: string, context: CanvasRenderingContext2D, width: number, height: number) {
        context.fillText(text, 0, 0, width);
    }
}