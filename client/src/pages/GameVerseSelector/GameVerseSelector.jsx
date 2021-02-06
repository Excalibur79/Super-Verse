import React,{useState,useEffect,useContext} from "react";
import {clone} from "ramda";
import axios from "axios";
import backendurl from "../../backend_url";

import {GlobalContext} from "../../Contexts/GlobalContext/GlobalContext";
import Sidebar from "../../Components/SideBar/Sidebar";
import "./GameVerseSelector.scss";
import Dbs from "../../assets/icons/goku_vegeta.png";
import naru from "../../assets/icons/naruto_sasuke.png";
import arrow from "../../assets/icons/left-arrow.png";
import Loader from "../../Components/Loader/Loader";
import Alert from "../../Components/Alert/Alert";
import InstructionModal from "../../Components/InstructionModal/InstructionModal";

const GameVerseSelector = (props)=>
{
    const {User,Auth,ChangeAuth,ChangeToken,ChangeUser,Tournament,ChangeTournament}=useContext(GlobalContext);

    //States==========
    const [gameverse,setgameverse]=useState(null);
    const [numberofplayers,setnumberofplayers]=useState(2);
    const [joiningid,setjoiningid]=useState("");
    const [isLoading,setisLoading]=useState(false);
    const [invalidwidth,setinvalidwidth]=useState(false);
    const [width,setwidth]=useState(window.innerWidth);

    const [showinstructionmodal,setshowinstructionmodal]=useState(false);

    const [alertdata,setalertdata]=useState({
        message:"",
        shown:false,
        type:''
    })

    const [narutoplaylist,setnarutoplaylist]=useState({
        array:['Silhouette','closer','naruto_op_7','shalala','hero','strong_and_strike','bluebird',],
        playingnow:-1
    })

    const [dragonballplaylist,setdragonplaylist]=useState({
        array:['dbs_op_1','dbs_op_2','kachidaze'],
        playingnow:-1
    });

    var clonednarutoplaylist;
    var cloneddragonballplaylist;
    //================

    useEffect(()=>
    {
      if(width<900)
      {
          setinvalidwidth(true);
      }
      else
      {
        setinvalidwidth(false);
      }
    },[width])
    window.addEventListener('resize',()=>
    {
      setwidth(window.innerWidth);
    })



    const handlecreategame=()=>
    {
        if(gameverse)
        {
            const newtournamentobj={
                creator_mongoid:User._id,
                creator_uid:User.uid,
                creator_name:User.Name,
                creator_avatar:User.avatar,
                gameverse:gameverse,
                numberofplayers:numberofplayers
            }
            console.log(newtournamentobj);
            setisLoading(true);
            axios(
                {
                    method:"POST",
                    data:newtournamentobj,
                    url:`${backendurl}/superverse/${gameverse}/createtournament`
                }
            ).then((data)=>
            {
                //console.log(data.data);
                ChangeTournament(data.data);
                setisLoading(false);
                props.history.push(`/${gameverse}/auction`);

            }).catch((err)=>{
                console.log(err);
                setisLoading(false);
                alerterror();
            });
        }
        else
        {
            if(!gameverse)
            {
               // alert("Select a gameverse!");
                var alert={
                    message:'Select a gameverse!',
                    shown:true,
                    type:'red'
                }
                setalertdata(alert);
            }
            /*else{
                //alert("naruto is still in development");
                var alert={
                    message:'Naruto is stll in Development!',
                    shown:true,
                    type:'red'
                }
                setalertdata(alert);
            }*/
        }

    }

    const resetalert=()=>
    {
        setalertdata({
            message:"",
            shown:false,
            type:''
        })
    }

    const alerterror=()=>
    {
        var alert={
            message:'Oops an Error Occured! :(',
            shown:true,
            type:'red'
        }
        setalertdata(alert);
    }

    const handleindevelopment=()=>
    {
        setalertdata({
            message:'Feature Coming Soon!',
            shown:true,
            type:'red'
        })
    }

    const handlejoingame=()=>
    {
        if(joiningid!="")
        {
           
            var obj={
                userdata:User,
                joiningid:joiningid,
                numberofplayers:numberofplayers
            }
            setisLoading(true);

          
            axios({
                method:"POST",
                data:obj,
                url:`${backendurl}/superverse/${gameverse}/jointournament`
            }).then((data)=>
            {
                //console.log(data.data);
                ChangeTournament(data.data);
                setisLoading(false);
                props.history.push(`/${gameverse}/auction`);
            }).catch((err)=>{
                console.log(err);
                setisLoading(false);
                alerterror();
            });
        }
        else 
        {
            var alert={
                message:'Enter a valid Tournament Id',
                shown:true,
                type:'red'
            }
            setalertdata(alert);
        }
    }

    const handlelogout=()=>
    {
        Auth.signOut();
        ChangeAuth(null);
        ChangeToken(null);
        ChangeUser(null);
        props.history.push("/");
    }

    useEffect(()=>
    {
        if(!User)
            props.history.push("/");
    },[])

    useEffect(()=>
    {
        cloneddragonballplaylist=clone(dragonballplaylist);
        clonednarutoplaylist=clone(narutoplaylist);

        if(gameverse=='dragonball')
        {
            if(clonednarutoplaylist.playingnow!=-1)
            {
                var narutosong=document.getElementById(clonednarutoplaylist.array[clonednarutoplaylist.playingnow]);
                console.log(narutosong);
                if(narutosong)
                {
                    narutosong.pause();
                    narutosong.currentTime=0;
                }
               
            }

            if(cloneddragonballplaylist.playingnow+1<cloneddragonballplaylist.array.length)
            {
                cloneddragonballplaylist.playingnow+=1;
                var dragonballsong=document.getElementById(cloneddragonballplaylist.array[cloneddragonballplaylist.playingnow]);
                if(dragonballsong)
                {
                    dragonballsong.play();
                    dragonballsong.volume="0.4";
                }
            }
            else
            {
                cloneddragonballplaylist.playingnow=0;
                var dragonballsong=document.getElementById(cloneddragonballplaylist.array[cloneddragonballplaylist.playingnow]);
                if(dragonballsong)
                {
                    dragonballsong.play();
                }
            }

            setdragonplaylist(cloneddragonballplaylist);
           
        }
        if(gameverse=='naruto')
        {
            if(cloneddragonballplaylist.playingnow!=-1)
            {
                var dragonballsong=document.getElementById(cloneddragonballplaylist.array[cloneddragonballplaylist.playingnow]);
                if(dragonballsong)
                {
                    dragonballsong.pause();
                    dragonballsong.currentTime=0;
                }
               
            }

            if(clonednarutoplaylist.playingnow+1<clonednarutoplaylist.array.length)
                clonednarutoplaylist.playingnow+=1;
            
            else            
                clonednarutoplaylist.playingnow=0;

             var narutosong=document.getElementById(clonednarutoplaylist.array[clonednarutoplaylist.playingnow]);
             if(narutosong)
             {
               narutosong.play();
               narutosong.volume='0.4';
             }

             setnarutoplaylist(clonednarutoplaylist);
            
        
        }
    },[gameverse])

    return (
        <div className="GameVerseSelector">
            {alertdata.shown && <div className="GameVerse_Alert"><Alert alertdata={alertdata} resetalert={resetalert}/></div>}
           
            {/*Audio*/}
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612544441/audio/Dragon_Ball_Super_Opening_1_-_Chouzetsu_Dynamic_y9aqku.mp3" id="dbs_op_1" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612544587/audio/Dragon_Ball_Super_Opening_2_-_Limit-Break_x_Survivor_bmovws.mp3" id="dbs_op_2" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1611757758/audio/Ka_Ka_Kachi_Daze_Full_320_kbps_m1hwns.mp3" id="kachidaze" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1610367006/audio/bluebird_juhczs.mp3" id="bluebird" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612540613/audio/anime-ost_naruto-shippuden-opening-04-closer-by-inoue-joe_skampp.mp3" id="closer" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612543048/audio/Naruto_Shippuden_-_Opening_7_-_Full_r5oypz.mp3" id="naruto_op_7" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612543257/audio/naruto-shippuden-en-espanol_naruto-shippuden-opening-5-sha-la-la_rrkt51.mp3" id="shalala" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612543425/audio/naruto-shippuden-en-espanol_naruto-shippuuden-opening-1-hero-s-come-back_wphbn3.mp3" id="hero" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612543777/audio/anime-ost_naruto-shippuden-opening-16-silhouette-by-kana-boon_jer9wv.mp3" id="Silhouette" preload="metadata" type="audio/mpeg" loop></audio>
            <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1612550706/audio/Naruto_-_Strong_and_Strike_rj4o78.mp3" id="strong_and_strike" preload="metadata" type="audio/mpeg" loop></audio>

            {/*.....*/}
          {User && 
             <div className="GameVerseSelector__Frosted_Glass center flex-row">
             <div className="InfoBar">
                 <div className="Top">
                     <div className="Image"><img src={User.avatar}/></div>
                     <div className="Name">{User.Name}</div>
                     <div className="Tier"><strong>Lvl : </strong>{User.tier}</div>
                 </div>
                 <div className="Bottom">
                    <div className="Bottom-option" onClick={()=>setshowinstructionmodal(true)}>Game Rules</div>
                    <div className="Bottom-option" onClick={handleindevelopment}>Tournaments Won</div>
                    <div className="Bottom-option" onClick={handleindevelopment}>Duels Won</div>
                    <div className="Bottom-option" onClick={handleindevelopment}>Search Characters</div>
                    <div className="Bottom-option" onClick={handlelogout}>Logout</div>

                 </div>
             </div>
             <div className="GameCreateSection">
                 {/*!User.OngoingTournament &&*/
                    <div className="Scrollable">
                     <section className="Heading"><div ><span className="Super">Super</span><span className="Verse"> Verse</span></div></section>
                     <section className="margin-top-small"> 
                         <div className="Select-Universe-Title">Select Universe</div>
                         <div className="Select-Universe-div">
                             <div className="DBS">
                                 <div className={gameverse=="dragonball"?"Circle Circle-selected":"Circle"} onClick={()=>{setgameverse("dragonball")}}><img src={Dbs}/></div>
                                 <div>DragonBall</div>
                             </div>
                             <div className="Naruto">
                                 <div className={gameverse=="naruto"?"Circle Circle-selected":"Circle"} onClick={()=>setgameverse("naruto")}><img src={naru}/></div>
                                 <div>Naruto</div>
                             </div>
                         </div>
                     </section>
                     <section className="Number_of_Players margin-top-small">
                             <div className="number center-align-text-vertically">Number of Players : </div>
                             <div className="Number_of_Players__Config">
                                 <div onClick={()=>setnumberofplayers(2)}><img src={arrow}/></div>
                                 <div className="numberofplayers">{numberofplayers}</div>
                                 <div onClick={()=>setnumberofplayers(4)}><img src={arrow}/></div>
                             </div>
                     </section>
                     <section className="Generate_game">
                         <div onClick={handlecreategame} >create Game</div>
                         <input placeholder="gameid" value={joiningid} onChange={(e)=>setjoiningid(e.target.value)}/>
                         <div onClick={handlejoingame}>Join game</div>
                     </section>
                    </div>
                 }
                
               
             </div>
             {/*<div onClick={handlelogout}>Logout</div>*/}
         </div>
          }
           {showinstructionmodal && <div className="Overlay"><InstructionModal setfalse={()=>setshowinstructionmodal(false)}/></div>}
        
        {isLoading && <div className="Overlay"><Loader data="Processing...Please Wait!"/></div>}

          {invalidwidth && <div className="Overlay"><Loader data="Game not Supported on Smaller Screen Sizes !"/></div>}
        </div>
    )
}
export default GameVerseSelector;