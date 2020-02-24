import * as React from 'react';
import '../styles/tile.scss';
import { IGameTile } from '../Models/GameTile';
import { TileType } from '../../common/Enums';

const RoadStraightArt = require("../Assests/RoadStraight.png");
const RailStraightArt = require("../Assests/RailStraight.png");
const RailTurnArt = require("../Assests/RailTurn.png");
const RoadTurnArt = require("../Assests/RoadTurn.png");
const StationStraightArt = require("../Assests/StationStraight.png");
const StationTurnArt = require("../Assests/StationTurn.png");
const StationTurnMirrorArt = require("../Assests/StationTurnMirror.png");
const RoadThreeWayArt = require("../Assests/RoadThreeWay.png");
const RailThreeWayArt = require("../Assests/RailThreeWay.png");
const OverpassArt = require("../Assests/Overpass.png");
const SpecialAllRailArt = require("../Assests/SpecialAllRail.png");
const SpecialThreeRailOneRoadArt = require("../Assests/SpecialThreeRailOneRoad.png");
const SpecialThreeRoadOneRailArt = require("../Assests/SpecialThreeRoadOneRail.png");
const SpecialAllRoadArt = require("../Assests/SpecialAllRoad.png");
const SpecialRoadRailAdjacentArt = require("../Assests/SpecialRoadRailAdjacent.png");
const SpecialRoadRailAcrossArt = require("../Assests/SpecialRoadRailAcross.png");
const EmptyFieldArt = require("../Assests/EmptyField.png");


interface ITileProps {
    tile: IGameTile
}

export function Tile(props: ITileProps){
    function GetTileArt(){
        switch (props.tile.Type) {
            case TileType.RoadStraight: return RoadStraightArt;
            case TileType.RailStraight: return RailStraightArt;
            case TileType.RailTurn: return RailTurnArt;
            case TileType.RoadTurn: return RoadTurnArt;
            case TileType.StationStraight: return StationStraightArt;
            case TileType.StationTurn: return StationTurnArt;
            case TileType.StationTurnMirror: return StationTurnMirrorArt;
            case TileType.RoadThreeWay: return RoadThreeWayArt;
            case TileType.RailThreeWay: return RailThreeWayArt;
            case TileType.Overpass: return OverpassArt;
            case TileType.SpecialAllRail: return SpecialAllRailArt;
            case TileType.SpecialThreeRailOneRoad: return SpecialThreeRailOneRoadArt;
            case TileType.SpecialThreeRoadOneRail: return SpecialThreeRoadOneRailArt;
            case TileType.SpecialAllRoad: return SpecialAllRoadArt;
            case TileType.SpecialRoadRailAdjacent: return SpecialRoadRailAdjacentArt;
            case TileType.SpecialRoadRailAcross: return SpecialRoadRailAcrossArt;
            case TileType.Empty:
            default: return EmptyFieldArt;    
        }
    }

    const pixalStyle = {
        transform: 'rotate(' + 90*props.tile.TileOrientation +'deg)',
        width: 75, 
        height: 75
    }
    
    return (
        <div style={{width: 75, height: 75}}>
            <img src={GetTileArt()} style={pixalStyle} />
        </div>
    );
}

export function ExitTile(props: ITileProps){
    return (
        <div style={{width: 75, height: 75*(1/3), padding: '0px 2px', backgroundColor: '#6abe30', overflow: 'hidden'}}>
            <Tile tile={props.tile} />
        </div>
    )
}

export function ExitTileSide(props: ITileProps){
    return (
        <div style={{width: 75*(1/3), height: 75, padding: '2px 0px', backgroundColor: '#6abe30', overflow: 'hidden'}}>
            <Tile tile={props.tile} />
        </div>
    )
}

