import * as React from 'react';
import { ScoreDTO } from '../../common/DTO/ScoreDTO';
import '../styles/scoreCard.scss';

interface IScoreCardProps{
    score: ScoreDTO;
}

// Future: Create a sepereate model from ScoreDTO 
export default function ScoreCard(props: IScoreCardProps){
    return(
        <table>
            <tr>
                <td>{"Exit"}</td>
                <td>{props.score.ExitScore}</td>
            </tr>
            <tr>
                <td>{"Longest Road"}</td>
                <td>{props.score.LongestRoadScore}</td>
            </tr>
            <tr>
                <td>{"Longest Rail"}</td>
                <td>{props.score.LongestRailScore}</td>
            </tr>
            <tr>
                <td>{"Center Squares"}</td>
                <td>{props.score.CenterSquareScore}</td>
            </tr>
            <tr>
                <td>{"Errors"}</td>
                <td>{props.score.ErrorScore}</td>
            </tr>
            <tr>
                <td>{"Expansion"}</td>
                <td>{props.score.ExpansionScore}</td>
            </tr>
            <tr>
                <td>{"Total"}</td>
                <td>{props.score.TotalScore}</td>
            </tr>
        </table>
    );
}