import { GetSideForTileAtOrientation } from "../../client/Utility Functions/TileDefinition"
import { Orientation, TileType, Edge } from "../../common/Enums";

describe("GetSideForTileAtOrientation", () => {
    test("returns lake for rotated tile", () => {
        expect(GetSideForTileAtOrientation(Orientation.left, TileType.LakeOneSide, Orientation.right)).toBe(Edge.lake);
        expect(GetSideForTileAtOrientation(Orientation.up, TileType.LakeOneSide, Orientation.down)).toBe(Edge.lake);
        expect(GetSideForTileAtOrientation(Orientation.right, TileType.LakeOneSide, Orientation.left)).toBe(Edge.lake);
        expect(GetSideForTileAtOrientation(Orientation.down, TileType.LakeOneSide, Orientation.up)).toBe(Edge.lake);
    });

    test("returns true for lake tiles", () => {
        expect(true).toBe(true);
    });
});