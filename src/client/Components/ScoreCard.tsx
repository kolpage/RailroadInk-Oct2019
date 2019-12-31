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
            <tbody>
            <tr>
                <td className="scoreName">{"Exit"}</td>
                <td className="scoreValue">{props.score.ExitScore}</td>
            </tr>
            <tr>
                <td className="scoreName">{"Longest Road"}</td>
                <td className="scoreValue">{props.score.LongestRoadScore}</td>
            </tr>
            <tr>
                <td className="scoreName">{"Longest Rail"}</td>
                <td className="scoreValue">{props.score.LongestRailScore}</td>
            </tr>
            <tr>
                <td className="scoreName">{"Center Squares"}</td>
                <td className="scoreValue">{props.score.CenterSquareScore}</td>
            </tr>
            <tr>
                <td className="scoreName">{"Errors"}</td>
                <td className="scoreValue">{props.score.ErrorScore}</td>
            </tr>
            <tr>
                <td className="scoreName">{"Expansion"}</td>
                <td className="scoreValue">{props.score.ExpansionScore}</td>
            </tr>
            <tr>
                <td className="scoreName">{"Total"}</td>
                <td className="scoreValue">{props.score.TotalScore}</td>
            </tr>
            </tbody>
        </table>
    );
}