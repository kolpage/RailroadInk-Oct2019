import * as React from 'react';
import '../styles/square.scss';
import { Tile } from './Tile';
import { GameTurn, Move } from '../Models/GameTurn';
import { TilePlacementResult } from '../../common/Enums';

const RefreshArrowIcon = require("../Assests/RefreshArrow.png")
const RemoveIcon = require("../Assests/RemoveCrop.png")

interface ISquareProps {
    
    //gameTile: IGameTile;
    move: Move;
    currentGameTurn: GameTurn;
    playSquare: (squareColumn: number, squareRow: number) => void;
    rotateSquare: (squareColumn: number, squareRow: number) => void;
    clearSquare: (squareColumn: number, squareRow: number) => void;
    mirrorSquare: (squareColumn: number, squareRow: number) => void;

    // TODO: Use Move instead 
    sqaureColumn: number;
    squareRow: number;
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
        if(this.isSquarePlayable()) {
            this.props.playSquare(this.props.sqaureColumn, this.props.squareRow);
            return true;
        }
        return false;
    }

    removeTile() {
        this.props.clearSquare(this.props.sqaureColumn, this.props.squareRow);
    }

    rotateSquare() {
        if (this.isSquareActive()) { 
            this.props.rotateSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    mirrorSquare() {
        if (this.isSquareActive() && this.props.move.TilePlayed.CanTileBeMirror()) {
            this.props.mirrorSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    isSquareInvalid(){
        //return this.props.currentGameTurn.InvalidMoves.ContainsMoveAtPosition(this.props.sqaureColumn, this.props.squareRow);
        return !this.props.move.IsValid();
    }

    private canSqaureBeUpdted() {
        return (this.props.move.TilePlayed.TurnPlayed == null || this.props.move.TilePlayed.TurnPlayed == this.props.currentGameTurn.TurnNumber);
    }

    private isSquarePlayable() {
        return this.props.move.TilePlayed.IsTileEmpty() && this.canSqaureBeUpdted();
    }

    private isSquareActive() {
        return this.canSqaureBeUpdted() && !this.isSquareEmpty();
    }

    private isSquareEmpty() {
        return this.props.move.TilePlayed.IsTileEmpty();
    }

    private handleDragOver(e) {
        e.preventDefault();
    }

    private handleDragDrop(e) {
        e.preventDefault();
        return this.playSelectedTile();
    }

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
        // if(this.props.currentGameTurn.InvalidMoves.ContainsMoveAtPosition(this.props.sqaureColumn, this.props.squareRow)){
        //     const invalidMove = this.props.currentGameTurn.InvalidMoves.GetMoveAtPosition(this.props.sqaureColumn, this.props.squareRow);
        //     return TilePlacementResult[invalidMove.Status];
        // }
        if(!this.props.move.IsValid()){
            return TilePlacementResult[this.props.move.Status];
        }

        return "";
    }

    render(){
        return(
            <div className={'square ' + this.addValidationCssClass()} title={this.addErrorTooltip()}>
                {this.drawMirrorButton()}
                {this.drawRemoveButton()}
                <div className='turnNumber'>{this.props.move.TilePlayed.TurnPlayed}</div>
                <div onClick={this.playSelectedTile} 
                     onContextMenu={this.rotateSquare}
                     onDragOver={this.handleDragOver.bind(this)}
                     onDrop={this.handleDragDrop.bind(this)}>
                    <Tile tile={this.props.move.TilePlayed} />
                </div>
            </div>
        );
    }
}