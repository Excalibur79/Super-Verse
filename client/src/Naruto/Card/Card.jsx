import React,{useState,useEffect} from "react";
import "./Card.scss";
import transformationarray from "../transformations";
import {clone} from 'ramda';

const Card=({name,health,attack,defence,baseprice,url,theme,transformable,next_character,type,stamina,stamina_threshold})=>
{
    const [nextform,setnextform]=useState(null);
    useEffect(()=>
    {
       // console.log(name +`${transformable?"transformable":"nope"}`);
        if(transformable)
        {
            var obj = transformationarray.find((x)=>next_character===x.name);
            if(obj)
            {
                var clonedobj=clone(obj);
                if(health+25>=clonedobj.total_health)
                    clonedobj.health=clonedobj.total_health;
                else 
                    clonedobj.health=health+25;
                
                setnextform(clonedobj);
            }
        }
        else 
            setnextform(null);
    },[name,health])

    useEffect(()=>
    {
        var threshold_limit=document.getElementById('stamina_threshold');
       // console.log(threshold_limit);
        if(threshold_limit)
        {
            threshold_limit.style.top=`${ (10-stamina_threshold)*10  }%`
        }

        var stamina_progress=document.getElementById('stamina_progress');
        if(stamina_progress)
        {
            stamina_progress.style.height=`${stamina *10}%`;
            stamina_progress.style.top=`${(10-stamina) *10}%`;
        }
    },[name,stamina,stamina_threshold])

    

    return(
        <div className="Character">
            <div className="Top-Section" style={{"backgroundColor":`${theme}`}}>
                <div className="Stamina">
                    <div className="Stamina_bar">
                        <div className="Threshold" id="stamina_threshold"></div>
                        <div className="Stamina_progress" id="stamina_progress"></div>
                    </div>
                </div>
                <div className="stamina_hover_result">{stamina}</div>

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
                     <div className="My_Circle card_health">
                         <div>{health}</div>
                        <svg>
                            <circle class="bg" cx="40" cy="40" r="35" />
                            <circle class="meter-1" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - (health/100))}`}/>
                        </svg>
                     </div>

                    {nextform && <div  className="next_form_health">
                        <div className="My_Circle">
                            <div style={{color:"gold"}}>{nextform.health}</div>
                            <svg>
                                <circle class="bg" cx="40" cy="40" r="35" />
                                <circle class="meter-1" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - (nextform.health/100))}`}/>
                            </svg>
                        </div>
                    </div>}
                    

                   <div className="My_Circle card_attack">
                        <div>{attack}</div>
                        <svg>
                            <circle class="bg" cx="40" cy="40" r="35" />
                            <circle class="meter-2" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - attack/100)}`} />
                        </svg>
                   </div>


                   {nextform && <div  className="next_form_attack">
                        <div className="My_Circle">
                            <div style={{color:"gold"}}>{nextform.attack}</div>
                            <svg>
                                <circle class="bg" cx="40" cy="40" r="35" />
                                <circle class="meter-2" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - (nextform.attack/100))}`}/>
                            </svg>
                        </div>
                    </div>}

                   <div className="My_Circle card_defence">
                     <div>{defence}</div>
                        <svg>
                            <circle class="bg" cx="40" cy="40" r="35" />
                            <circle class="meter-3" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - (defence/100))}`}/>
                        </svg>
                   </div>
                   
                   {nextform && <div  className="next_form_defence">
                        <div className="My_Circle">
                            <div style={{color:"gold"}}>{nextform.defence}</div>
                            <svg>
                                <circle class="bg" cx="40" cy="40" r="35" />
                                <circle class="meter-3" cx="40" cy="40" r="35" strokeDasharray="219.9" strokeDashoffset={`${219.9 * (1 - (nextform.defence/100))}`}/>
                            </svg>
                        </div>
                    </div>}
                    
                 </div>
                
                <div className="Base_Price">Base Price : $ {baseprice}</div>
            </div>
        </div>
    )
}
export default Card;