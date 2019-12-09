import { EdgeMatchingStatus, Edge } from "./Enums"

/** 
 * Static collection of functions to be used for validating board position. 
 * Only uses global Enums so it can be used by front and back end. 
 */
export class PositionValidator{

    /** Returns the EdgeMatchingStatus of 2 edges. */
    public static ValidateEdges(edgeOne?: Edge, edgeTwo?: Edge): EdgeMatchingStatus{   
        
        //Case 1: Edges are the same - valid
        if(PositionValidator.CheckEdgesAreSame(edgeOne, edgeTwo)){
            return EdgeMatchingStatus.valid;
        }

        //Case 2: One of the passed in edges is a wall - valid
        if(edgeOne === Edge.any || edgeTwo === Edge.any){
            return EdgeMatchingStatus.valid;
        }

        //Case 3: One of the passed in edges is empty - depends on other tile
        let emptyEdge: Edge | undefined;
        let otherEdge: Edge | undefined;
        if(edgeOne === Edge.empty){
            emptyEdge = edgeOne;
            otherEdge = edgeTwo;
        }
        else if(edgeTwo === Edge.empty){
            emptyEdge = edgeTwo;
            otherEdge = edgeOne;
        }
        if(emptyEdge !== undefined){
            return PositionValidator.ValidateEmptyEdge(otherEdge);
        }

        //Case 4: One of the passed in edges is undefined - open
        if(edgeOne === undefined){
            return PositionValidator.ValidateUndefinedEdge(edgeTwo);
        }
        else if(edgeTwo === undefined){
            return PositionValidator.ValidateUndefinedEdge(edgeOne);
        }

        //Case 5: One of the edges is meteor - valid
        if(edgeOne === Edge.meteor || edgeTwo === Edge.meteor){
            return EdgeMatchingStatus.valid;
        }

        //Case 6: Don't match in a way that breaks the rules
        return EdgeMatchingStatus.invalid;
    }

    public static ValidateUndefinedEdge(otherEdge: Edge | undefined): EdgeMatchingStatus{
        switch(otherEdge){
            case undefined:
            case Edge.empty:
            case Edge.exitRail:
            case Edge.exitRoad:
            case Edge.lake:
            case Edge.meteor:
            case Edge.any:
                return EdgeMatchingStatus.valid;
            default:
                return EdgeMatchingStatus.open;
        }
    }

    /** 
     * Returns true if edges match. False otherwise.
     * Matches rail to railExit and road to roadExit.
     */
    public static CheckEdgesAreSame(edgeOne: Edge, edgeTwo: Edge): boolean{
        return ((edgeOne === edgeTwo)
            || (edgeOne === Edge.road && edgeTwo === Edge.exitRoad)
            || (edgeTwo === Edge.road && edgeOne === Edge.exitRoad)
            || (edgeOne === Edge.rail && edgeTwo === Edge.exitRail)
            || (edgeTwo === Edge.rail && edgeOne === Edge.exitRail)
        );
    }

    /** Returns the matching status for a given side vs. Empty */
    public static ValidateEmptyEdge(otherEdge: Edge | undefined): EdgeMatchingStatus{
         switch(otherEdge){
            case undefined:
            case Edge.exitRail:
            case Edge.exitRoad:
            case Edge.lake:
            case Edge.meteor:
            case Edge.empty:
            case Edge.any:
                return EdgeMatchingStatus.valid;
            default:
                return EdgeMatchingStatus.mismatch;
         }       
    }
}