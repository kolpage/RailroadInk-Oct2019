import { Edge } from "./Enums";

/* Defines all support tiles via their edges. Uses an array to hold each edge. 
 * The order of the edges follow this pattern: Up, Right, Bottom, Left */

export const RailTurnTile = [Edge.rail, Edge.empty, Edge.empty, Edge.rail];
export const RailThreeWayTile = [Edge.rail, Edge.rail, Edge.empty, Edge.rail];
export const RailStraightTile = [Edge.rail, Edge.empty, Edge.rail, Edge.empty];

export const RoadTurnTile = [Edge.road, Edge.empty, Edge.empty, Edge.road];
export const RoadThreeWayTile = [Edge.road, Edge.road, Edge.empty, Edge.road];
export const RoadStraightTile = [Edge.road, Edge.empty, Edge.road, Edge.empty];

export const OverpassTile = [Edge.road, Edge.rail, Edge.road, Edge.rail];
export const StationStraightTile = [Edge.rail, Edge.empty, Edge.road, Edge.empty];
export const StationTurnTile = [Edge.rail, Edge.empty, Edge.empty, Edge.road];
export const StationTurnMirrorTile = [Edge.rail, Edge.road, Edge.empty, Edge.empty];

export const SpecialThreeRoadOneRailTile = [Edge.road, Edge.road, Edge.rail, Edge.road];
export const SpecialThreeRailOneRoadTile = [Edge.road, Edge.rail, Edge.rail, Edge.rail];
export const SpecialAllRoadTile = [Edge.road, Edge.road, Edge.road, Edge.road];
export const SpecialAllRailTile = [Edge.rail, Edge.rail, Edge.rail, Edge.rail];
export const SpecialRoadRailAdjacentTile = [Edge.road, Edge.rail, Edge.rail, Edge.road];
export const SpecialRoadRailAcrossTile = [Edge.road, Edge.rail, Edge.road, Edge.rail];

export const RailEdgeTile = [Edge.exitRail, Edge.exitRail, Edge.exitRail, Edge.exitRail];
export const RoadEdgeTile = [Edge.exitRoad, Edge.exitRoad, Edge.exitRoad, Edge.exitRoad];
export const WallEdgeTile = [Edge.any, Edge.any, Edge.any, Edge.any];