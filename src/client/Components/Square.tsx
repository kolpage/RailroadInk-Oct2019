import * as React from 'react';
import '../styles/square.scss';
import { Tile } from './Tile';
import { Move, CreateMoveFromJSON } from '../Models/GameTurn';
import { TilePlacementResult } from '../../common/Enums';

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
}

export class Square extends React.Component<ISquareProps> {
    constructor(props: ISquareProps) {
        super(props);
        this.bindFunction();
    }

    private bindFunction() {
        this.playSelectedTile = this.playSelectedTile.bind(this);
        this.rotateSquare = this.rotateSquare.bind(this);
    }

    playSelectedTile() {
        if(this.canSqaureBeUpdted()) {
            if(!this.isSquareEmpty){
                this.removeTile();
            }
            this.props.playSquare(this.props.move);

            return true;
        }
        return false;
    }

    removeTile() {
        this.props.clearSquare(this.props.move);
    }

    rotateSquare() {
        if (this.isSquareActive()) { 
            this.props.rotateSquare(this.props.move);
        }
    }

    mirrorSquare() {
        if (this.isSquareActive() && this.props.move.TilePlayed.CanTileBeMirror()) {
            this.props.mirrorSquare(this.props.move);
        }
    }

    isSquareInvalid(){
        return !this.props.move.IsValid();
    }

    private canSqaureBeUpdted() {
        return ((this.props.move.TilePlayed.TurnPlayed == null) || (this.props.move.TilePlayed.TurnPlayed == this.props.currentTurnNumber)) && !this.props.isGameOver;
    }

    private isSquareActive() {
        return this.canSqaureBeUpdted() && !this.isSquareEmpty();
    }

    private isSquareEmpty() {
        return this.props.move.TilePlayed.IsTileEmpty();
    }

    //#region Drag & drop handlers
    private handleDragOver(e) {
        if(this.canSqaureBeUpdted()){
            e.preventDefault(); // Preventing default event in dragOver event signifies that the element will accept drop events
        }
    }

    private handleDragDrop(e) {
        e.preventDefault();
        var data = e.dataTransfer.getData("text/move");
        if(data){
            const sourceMove = CreateMoveFromJSON(JSON.parse(data));
            if(!sourceMove.IsMoveAtSamePosition(this.props.move)){
                this.props.transferMove(sourceMove, this.props.move);
            }
            
        }
        else{
            return this.playSelectedTile();
        } 
    }

    private handleDragStart(e) {
        const move = JSON.stringify(this.props.move);
        e.dataTransfer.setData("text/move", move);
    }

    private handleDragEnd(e) {
        if (e.dataTransfer.dropEffect !== 'none') {
            //this.removeTile();
        }
    }
    //#endregion

    private addValidationCssClass() {
        if (this.isSquareInvalid()) {
            return 'invalidBoarder'
        }

        return '';
    }

    drawMirrorButton() {
        if(this.isSquareActive() && this.props.move.TilePlayed.CanTileBeMirror()){
             return(
                 <div 
                     onClick={this.mirrorSquare.bind(this)} 
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

    drawRemoveButton(){
        if(this.isSquareActive()){
            return (
                <div
                    onClick={this.removeTile.bind(this)} 
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

    addErrorTooltip(){
        if(!this.props.move.IsValid()){
            return TilePlacementResult[this.props.move.Status];
        }

        return "";
    }

    render(){
        return(
            <div className={'square ' + this.props.addtionalStyles + ' ' + this.addValidationCssClass()} title={this.addErrorTooltip()}>
                {this.drawMirrorButton()}
                {this.drawRemoveButton()}
                <div className='turnNumber'>{this.props.move.TilePlayed.TurnPlayed}</div>
                <div onClick={this.playSelectedTile} 
                     onContextMenu={this.rotateSquare}
                     draggable={this.isSquareActive()}
                     onDragStart={this.handleDragStart.bind(this)}
                     onDragOver={this.handleDragOver.bind(this)}
                     onDrop={this.handleDragDrop.bind(this)}
                     onDragEnd={this.handleDragEnd.bind(this)}>
                    <Tile tile={this.props.move.TilePlayed} />
                </div>
            </div>
        );
    }
}