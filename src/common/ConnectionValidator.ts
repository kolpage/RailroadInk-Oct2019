import { Edge } from "./Enums";

/** Static class used to determine if tiles are connected for network/longest path detecting */
export class ConnectionValidator{

    /** Returns true if the edges of tiles connect in a way they make a network/path */
    public static AreEdgesConnected(edgeOne: Edge, edgeTwo: Edge): boolean{
        if(edgeOne === Edge.empty
            || edgeOne === Edge.meteor
            || edgeOne === Edge.any){
            return false;
        }

        if(edgeOne === edgeTwo){
            return true;
        }

        if(edgeOne === Edge.exitRoad){
            return edgeTwo === Edge.road;
        }

        if(edgeOne === Edge.exitRail){
            return edgeTwo === Edge.rail;
        }

        return ConnectionValidator.AreEdgesConnected(edgeTwo, edgeOne);
    }
}