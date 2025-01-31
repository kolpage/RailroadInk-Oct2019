import * as React from 'react';
import '../styles/square.scss';
import { Tile } from './Tile';
import { Move, CreateMoveFromJSON } from '../Models/GameTurn';
import { TilePlacementResult, Orientation, TileType } from '../../common/Enums';
import { ITile, GameTile } from '../Models/GameTile';
import { CanTileFlood } from '../Utility Functions/LakeValidation';

const RefreshArrowIcon = require("../Assests/RefreshArrow.png")
const RemoveIcon = require("../Assests/RemoveCrop.png")

interface ISquareProps {
    move: Move;
    currentTurnNumber: number;
    addtionalStyles: string;
    isGameOver: boolean;

    playSquare: (move: Move) => void;
    rotateSquare: (move: Move) => void;
    clearSquare: (move: Move) => void;
    mirrorSquare: (move: Move) => void;
    transferMove: (srcMove: Move, destMove: Move) => void;
    getSurroundingSquares: (row: number, column: number) => ITile[];
    makeSquareFlood: (monve: Move) => void;
}

//static contextType = ThemeContext;

export function Square(props: ISquareProps) {
    React.useEffect(() => {
        //isSquareFlooded();
    });
    
    function playSelectedTile() {
        if(canSqaureBeUpdted()) {
            props.playSquare(props.move);
            return true;
        }
        return false;
    }

    function removeTile() {
        props.clearSquare(props.move);
    }

    function rotateSquare() {
        if (isSquareActive()) { 
            props.rotateSquare(props.move);
        }
    }

    function mirrorSquare() {
        if (isSquareActive() && props.move.TilePlayed.CanTileBeMirror()) {
            props.mirrorSquare(props.move);
        }
    }

    function isSquareInvalid(){
        return !props.move.IsValid();
    }

    function canSqaureBeUpdted() {
        return ((props.move.TilePlayed.TurnPlayed == null) || (props.move.TilePlayed.TurnPlayed == props.currentTurnNumber)) && !props.isGameOver;
    }

    function isSquareActive() {
        return canSqaureBeUpdted() && !isSquareEmpty() && isSquareInteractive();
    }

    function isSquareEmpty() {
        return props.move.TilePlayed.IsTileEmpty();
    }

    function isSquareInteractive(){
        //TODO: This logic should live here
        return props.move.TilePlayed.Type != TileType.LakeFull;
    }

    function isSquareFlooded() {
        let surroundingSquares = props.getSurroundingSquares(props.move.RowPosition, props.move.ColumnPosition);
        surroundingSquares = surroundingSquares.map(square => square || new GameTile())

        const shouldTileFlood = CanTileFlood(props.move.TilePlayed, surroundingSquares[Orientation.up], surroundingSquares[Orientation.right], surroundingSquares[Orientation.down], surroundingSquares[Orientation.left]);

        if(shouldTileFlood){
            props.makeSquareFlood(props.move);
        }
    }

    //#region Drag & drop handlers
    function handleDragOver(e) {
        if(canSqaureBeUpdted()){
            e.preventDefault(); // Preventing default event in dragOver event signifies that the element will accept drop events
        }
    }

    function handleDragDrop(e) {
        e.preventDefault();
        var data = e.dataTransfer.getData("text/move");
        if(data){
            const sourceMove = CreateMoveFromJSON(JSON.parse(data));
            if(!sourceMove.IsMoveAtSamePosition(props.move) && sourceMove.TilePlayed.TurnPlayed === props.currentTurnNumber){
                props.transferMove(sourceMove, props.move);
            }
            
        }
        else{
            return playSelectedTile();
        } 
    }

    function handleDragStart(e) {
        const move = JSON.stringify(props.move);
        e.target.className = '';
        e.dataTransfer.setData("text/move", move);
    }

    function handleDragEnd(e) {
        if (e.dataTransfer.dropEffect !== 'none') {
            //this.removeTile();
        }
    }
    //#endregion

    function addValidationCssClass() {
        if (isSquareInvalid()) {
            return 'invalidBoarder'
        }

        return '';
    }

    function drawMirrorButton() {
        if(isSquareActive() && props.move.TilePlayed.CanTileBeMirror()){
             return(
                 <div 
                     onClick={mirrorSquare} 
                     className='upperLeftButton'
                 >
                     <figure>
                         <img src={RefreshArrowIcon} className='rotateButton' alt="rotate" />
                     </figure>
                 </div>
             );
        }
 
        return <div></div>;
     }

     function drawRemoveButton(){
        if(isSquareActive()){
            return (
                <div
                    onClick={removeTile} 
                    className='lowerRightButton'
                >
                    <figure>
                        <img src={RemoveIcon} className='removeButton' alt="remove" />
                    </figure>
                </div>
            );
        }
        return <div></div>;
    }

    function addErrorTooltip(){
        if(!props.move.IsValid()){
            return TilePlacementResult[props.move.Status];
        }

        return "";
    }
    

    return(
        <div className={'square ' + props.addtionalStyles + ' ' + addValidationCssClass()} title={addErrorTooltip()}>
            {drawMirrorButton()}
            {drawRemoveButton()}
            <div className='turnNumber'>{props.move.TilePlayed.TurnPlayed}</div>
            <div onClick={playSelectedTile} 
                    onContextMenu={rotateSquare}
                    draggable={isSquareActive()}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDragDrop}
                    onDragEnd={handleDragEnd}>
                <Tile tile={props.move.TilePlayed} />
            </div>
        </div>
    );
}