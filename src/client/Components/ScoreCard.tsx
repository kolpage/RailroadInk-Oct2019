import * as React from 'react';

interface IScoreCardProps{
    score: number;
}

export default function ScoreCard(props: IScoreCardProps){
    return(
        <div>{props.score}</div>
    );
}