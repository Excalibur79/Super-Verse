import { match } from "ramda";
import React from "react";
import "./FourTournament.scss";

import question from "../../../assets/icons/question.png";
import trophy from "../../../assets/icons/trophy.png"

const FourTournament=({match1,match2,match3})=>
{

    return(
        <div className="FourTournament">
            <div className="Level_7">
               {match3.winner.avatar!==""?<img src={match3.winner.avatar}/>:<img src={trophy}/>}
            </div>
            <div className="Level_6">
                <div></div>
            </div>
            <div className="Level_5">
                <div></div>
            </div>
            <div className="Level_4">
                {match3.player1.avatar!==""?<img src={match3.player1.avatar}/>:<img src={question}/>}
                {match3.player2.avatar!==""?<img src={match3.player2.avatar}/>:<img src={question}/>}
            </div>
            <div className="Level_3">
                <div></div>
            </div>
            <div className="Level_2">
                <div></div>
                <div></div>
            </div>
            <div className="Level_1">
                <img src={match1.player1.avatar}/>
                <img src={match1.player2.avatar}/>
                <img src={match2.player1.avatar}/>
                <img src={match2.player2.avatar}/>
            </div>
        </div>
    )
}
export default FourTournament;