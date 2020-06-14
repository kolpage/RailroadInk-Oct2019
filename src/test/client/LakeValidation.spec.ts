import { IsLakeTile, CanTileFlood } from "../../client/Utility Functions/LakeValidation";
import { TileType, Orientation } from "../../common/Enums";
import { ITile } from "../../client/Models/GameTile";

describe("IsLakeTile", () => {
    test("returns false for non lake tiles", () => {
        expect(IsLakeTile(TileType.Overpass)).toBe(false);
    });

    test("returns true for lake tiles", () => {
        expect(IsLakeTile(TileType.LakeFull)).toBe(true);
    });
});

describe("CanTileFlood", () => {
    test("floods tile when lakes are on three sides and one side is empty", () => {
        const topTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.up}
        const rightTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.right}
        const bottomTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.down}
        const leftTile: ITile = {Type: TileType.Empty, TileOrientation: Orientation.left}
        const centerTile: ITile = {Type: TileType.Empty, TileOrientation: Orientation.up}
        expect(CanTileFlood(centerTile, topTile, rightTile, bottomTile, leftTile)).toBe(true);
    });

    test("floods tile when lakes are on all sides", () => {
        const topTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.up}
        const rightTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.right}
        const bottomTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.down}
        const leftTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.left}
        const centerTile: ITile = {Type: TileType.Empty, TileOrientation: Orientation.up}
        expect(CanTileFlood(centerTile, topTile, rightTile, bottomTile, leftTile)).toBe(true);
    });

    test("doesn't flood tile when one side is not empty or lake", () => {
        const topTile: ITile = {Type: TileType.SpecialAllRoad, TileOrientation: Orientation.up}
        const rightTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.right}
        const bottomTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.down}
        const leftTile: ITile = {Type: TileType.LakeOneSide, TileOrientation: Orientation.left}
        const centerTile: ITile = {Type: TileType.Empty, TileOrientation: Orientation.up}
        expect(CanTileFlood(centerTile, topTile, rightTile, bottomTile, leftTile)).toBe(false);
    });

    test("returns false for non empty center tile", () => {
        const topTile: ITile = {Type: TileType.LakeFull, TileOrientation: Orientation.up}
        const centerTile: ITile ={Type: TileType.RailEdge, TileOrientation: Orientation.up}
        expect(CanTileFlood(centerTile, topTile, topTile, topTile, topTile)).toBe(false);
    });
});