import * as React from 'react';
import { ScoreDTO } from '../../common/DTO/ScoreDTO';
import '../styles/scoreCard.scss';

// Future: Create a sepereate model from ScoreDTO 
export default function ScoreCard(props: ScoreDTO){
    return(
        <table>
            <tr>
                <td>{"Exit"}</td>
                <td>{props.ExitScore}</td>
            </tr>
            <tr>
                <td>{"Longest Road"}</td>
                <td>{props.LongestRoadScore}</td>
            </tr>
            <tr>
                <td>{"Longest Rail"}</td>
                <td>{props.LongestRailScore}</td>
            </tr>
            <tr>
                <td>{"Center Squares"}</td>
                <td>{props.CenterSquareScore}</td>
            </tr>
            <tr>
                <td>{"Errors"}</td>
                <td>{props.ErrorScore}</td>
            </tr>
            <tr>
                <td>{"Expansion"}</td>
                <td>{props.ExpansionScore}</td>
            </tr>
            <tr>
                <td>{"Total"}</td>
                <td>{props.TotalScore}</td>
            </tr>
        </table>
    );
}