import React from "react";
import "./Card.scss";

const Card=({name,health,attack,defence,baseprice,url,theme,transformable})=>
{
    return(
        <div className="Character">
            <div className="Top-Section" style={{"backgroundColor":`${theme}`}}>
                <img src={url}/>
                {transformable && <div className="gold_circle"></div>}
            </div>
             <div className="Lower-Section">
                 <div className="name"> {name}</div>
                 <div className="Flex">
                    <div className="About" style={{color:`${theme}`}}>Health</div>
                    <div className="About" style={{color:`${theme}`}}>Attack</div>
                    <div className="About" style={{color:`${theme}`}}>Defence</div>
                 </div>
                 <div className="Flex">
                     <div className="My_Circle">
                         <div>{health}</div>
                        <svg>
                            <circle class="bg" cx="40" cy="40" r="35" />
                            <circle class="meter-1" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - (health/100))}`}/>
                        </svg>
                     </div>

                   <div className="My_Circle">
                        <div>{attack}</div>
                        <svg>
                            <circle class="bg" cx="40" cy="40" r="35" />
                            <circle class="meter-2" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - attack/100)}`} />
                        </svg>
                   </div>

                   <div className="My_Circle">
                     <div>{defence}</div>
                        <svg>
                            <circle class="bg" cx="40" cy="40" r="35" />
                            <circle class="meter-3" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - (defence/100))}`}/>
                        </svg>
                   </div>
                   
                    
                 </div>
                
                <div className="Base_Price">Base Price : $ {baseprice}</div>
            </div>
        </div>
    )
}
export default Card;