import React from 'react'

export default function ScoreBoard(props:any) {
  return (
    <div className="flex w-full items-center justify-center space-x-[30px]">
        <span>you</span>
        <span>{props.scoreBoard.selfScore}</span>
        <span>-</span>
        <span>{props.scoreBoard.opponentScore}</span>
        <span>{props.opponentData.login}</span>
        <img className="w-[40px] h-[40px] rounded-[20px]" src={props.opponentData.img}></img>
    </div>
  )
}
