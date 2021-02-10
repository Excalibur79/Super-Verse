import React,{useState,useEffect,useContext} from "react";
import {GlobalContext} from "../../Contexts/GlobalContext/GlobalContext";
import "./DragonBallAuction.scss";
import dollar from "../../assets/icons/dollar.png";
import Card from "../Card/Card";
import Alert from "../../Components/Alert/Alert";
import Loader from "../../Components/Loader/Loader";
import axios from "axios"
import backendurl from "../../backend_url";
import io from "socket.io-client";
const ENDPOINT="https://excalibur-superverse.herokuapp.com/";




const DragonBallAuction =(props)=>
{
    const {User,ChangeUser,Tournament,ChangeTournament,ChangeMySocket}=useContext(GlobalContext);
    const [Socket,setsocket]=useState(null)
    
    const [voted,setvoted]=useState(false);

    const [AuctionObj,setAuctionObj]=useState(null);
    const [allmemberspresent,setallmemberspresent]=useState(false);

    const [bidvalue,setbidvalue]=useState(0);

    const [timeleft,settimeleft]=useState(15);
    const [timerid,settimerid]=useState(null);

    const [EndAuction,setEndAuction]=useState(false);

    const [StyleObj,setStyleObj]=useState({});

    const [alertdata,setalertdata]=useState({
        message:"",
        shown:false,
        type:''
    })

    const [Loading,setLoading]=useState({
        data:'',
        loading:false
    });


    const resetalert=()=>
    {
        setalertdata({
            message:"",
            shown:false,
            type:''
        })
    }


    const investorselector=(member)=>
    {
        if(AuctionObj.investor[0])
        {
            if(AuctionObj.investor[0].mongoid===member.mongoid)
                return 'investor';
            return ''
        }
    }
    const handlecopy=()=>
    {
        var copyText = document.getElementById("id");
        copyText.focus();
        copyText.select();
        document.execCommand("copy");
       
         alert("Match Id Copied!");
        
      
       
      // alert(copyText);
    }

    const handleVote=()=>
    {
        if(User && Socket)
        {
            if(AuctionObj.investor.length==0)
            {
                setvoted(true);
                Socket.emit('voted',{
                    auction_id:AuctionObj.auction_id,
                    usermongoid:User._id.toString()
                })
            }
            else
            {
                setalertdata({
                    message:"Wait Till The Current Character is Bought!",
                    shown:true,
                    type:'red'
                })
            }
           
        }
       
    }

    const resettimer=()=>
    {
        if(timerid)
        {
            clearInterval(timerid);
            
        }
        settimerid(null);
        settimeleft(15);
       
    }

    const triggertimer=()=>
    {
        var time=15;
        settimerid(setInterval(()=>
        {
            /*if(time==15)
            {
                settimerid(id);
            }*/
            if(time<0)
            {
                clearInterval(timerid);
                
                    settimerid(null);
                    settimeleft(15);
                
               
                 
            }
            time=time-1;

            if(time>=0)
             settimeleft(time);
        },1000))
    }

    const nextcharacter=()=>
    {
        if(User && AuctionObj)
        {
            if(AuctionObj.investor.length==0)
            {
                var data={auction_id:AuctionObj.auction_id};
                Socket.emit('nextcharacter',data);
            }
            else 
            {
                setalertdata({
                    message:"Can't Skip! Bidding has Started!",
                    shown:true,
                    type:'red'
                })
            }
        }
      
    }

    const handletriggerbuy=()=>
    {
        if(bidvalue<=User.Account_Balance)
        {
            if(bidvalue>AuctionObj.priceofcharacter)
            {
                if(timeleft>2)
                {  
                    var investor;
                    for(var i=0;i<AuctionObj.members.length;i++)
                    {
                        if(AuctionObj.members[i].mongoid==User._id.toString())
                        {
                            investor= AuctionObj.members[i];
                            break;
                        }
                    }

                    var data={
                        investor:investor,bidprice:bidvalue,auction_id:AuctionObj.auction_id
                    }
                   // console.log("Lets bid",data);
                    Socket.emit("bid",data);
                }
                else 
                {
                    setalertdata({
                        message:"Time's almost Up for Interruption!",
                        shown:true,
                        type:'red'
                    })
                }
                
            }
            else
            {
                setalertdata({
                    message:"Need to Pay Higher!",
                    shown:true,
                    type:'red'
                })
            }
        }
        else
        {
            setalertdata({
            message:"Low In cash",
            shown:true,
            type:'red'
        })
        }
            
    }

    useEffect(()=>
    {
        if(!Tournament)
            props.history.push("/");
        else if(User)
        {
            var socket = io(ENDPOINT,{query:`foo=${User._id.toString()}`});
            //socket.id=User.uid.toString();
            //console.log("hmmmm",socket.id)
            setsocket(socket);
            ChangeMySocket(socket);//This is the global Socket
              
            //socket.on("nani",()=>console.log(socket));
            
        }
    },[])

    
    useEffect(()=>
    {
        if(timerid == null)
        {
            settimeleft(15);
        }
    },[timerid])

    useEffect(()=>
    {
        if(Socket!==null)
        {
          //  console.log(Socket);
            
            //Update the User
                var data={
                    tournament:Tournament,
                    userdata:User
                }
                axios({
                    method:"POST",
                    data:data,
                    url:`${backendurl}/superverse/dragonball/updateuser/auctiondata`
                }).then((data)=>
                {
                   // console.log("updateduser is : ",data);
                    ChangeUser(data.data);
                }).catch((err)=>console.log(err))
            //=============



            var data=
            {
                auction_id:Tournament._id,
                name:User.Name,
                avatar:User.avatar,
                uid:User.uid,
                mongoid:User._id,
                gameverse:"dragonball",
                type:Tournament.type
            }
            Socket.emit("joinauction",data,(returneddata)=>
            {
               // console.log("returned data ",returneddata);

            })
        }
    },[Socket])

    useEffect(()=>
    {
        if(Socket!==null)
        {

            Socket.on("updateauction",(data)=>
            {
               // console.log("UpdateAuction of user : ",data);
                
                setAuctionObj(data.data);
                //axios request needed to update the global AUCtion state
               
                    var tournamentid=data.data.auction_id;
                    var x={
                        id:tournamentid,
                        type:data.data.type
                    }
                    axios({
                        method:"POST",                   
                        data:x,
                        url:`${backendurl}/superverse/dragonball/gettournamentinfo`
                    }).then((res)=>
                    {
                        //console.log("UPdaaateedd@@@");
                        ChangeTournament(res.data);
                    }).catch((err)=>console.log(err));
                
                   
                //======================================================
            })

            Socket.on("triggerauction",(data)=>
            {
                //alert("Lets Start The Auction!");
               // console.log("trigger auction",data);
                setbidvalue(data.data.presentcharacter.base_price);
                setallmemberspresent(true);
               
            })

            Socket.on("bidded",(data)=>
            {
               // console.log("Lets Timer with this : ",data.data);
                setAuctionObj(data.data);
                if(timerid)
                    resettimer();
                triggertimer();
               

            })

            Socket.on("updateauctionvotes",(data)=>
            {
                setAuctionObj(data.data);
               
            })
            Socket.on("updateauctionnextcharacter",(data)=>
            {
                setAuctionObj(data.data);
                setbidvalue(data.data.presentcharacter.base_price);
                resettimer();
            })
            Socket.on('finishauction',(data)=>
            {
               // console.log("Auction has Finsihed Because all of you spent your money");
               setLoading({
                   data:data.message,
                   loading:true
               })
               setTimeout(()=>
               {
                    setLoading({
                        data:'',
                        loading:false
                    })
                    props.history.push("/dragonball/duel");

               },7000)
                setEndAuction(true);
            })


            //Needs to be refactored-----
            /*
            Socket.on('unfortunatedisconnectmessage',(data)=>
            {
                alert(data.data);
                window.location.reload();
               
            })*/
            //-------------------------

            return ()=>
            {
                Socket.emit("disconnect");
                Socket.off();
            }
        }
       
    })

    useEffect(()=>
    {

        //Progress Bar Styling
        if(AuctionObj && User)
        {
            var x=document.getElementsByClassName("progress")[0]
            if(x)
            {
                x.style.width=((100/15)*timeleft)+"%";

            }
           // console.log(x);
        }
        //====================

        if(AuctionObj && User)
        {
            if(timeleft==0 && AuctionObj.investor[0])
            {
                resettimer();
                if(AuctionObj.investor[0].mongoid==User._id.toString())
                {
                    //console.log("You Bought This Character!!");
                    var data={
                        usermongoid:User._id.toString(),
                        auction_id:AuctionObj.auction_id,
                        characterid:AuctionObj.presentcharacter._id.toString(),
                        type:2,
                        gameverse:'dragonball',
                        newaccountbalance:User.Account_Balance - AuctionObj.priceofcharacter
                    }

                    //Buying Character===
                    axios({
                        method:"POST",
                        data:data,
                        url:`${backendurl}/superverse/dragonball/auction/buycharacter`
                    }).then((data)=>
                    {   
                        console.log("You Bought : ",data);
                        ChangeUser(data.data);

                        //alertdata
                        var alert={
                            message:'Purchase Successful !!',
                            shown:true,
                            type:'green'
                        }
                        setalertdata(alert);
                        //===========

                        //Next Character
                        var data={auction_id:AuctionObj.auction_id};
                        Socket.emit('nextcharacter',data);

                        //=============

                    }).catch((err)=>console.log(err));
                    //===================
                }
            }
        }
       
    },[timeleft])


    useEffect(()=>
    {
        if(User && User.Account_Balance<1000000 && Socket)
        {
            var data={auction_id:AuctionObj.auction_id};
            Socket.emit("increasefinishcounter",data);
        }
    },[User])

    useEffect(()=>
    {
        if(AuctionObj && allmemberspresent)
        {
            var background_style={
                background:`linear-gradient(to bottom,rgba(140,122,122,.7)0%,${AuctionObj.presentcharacter.theme}65%,${AuctionObj.presentcharacter.theme}100%)`,
               
              
            }
            
        }
        else
        {
            var background_style={
                background:"linear-gradient(to bottom, rgba(140,122,122,1) 0%, rgba(175,135,124,1) 65%, rgba(175,135,124,1) 100%)",
                background:"url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/coc-background.jpg) no-repeat center center",
                backgroundSize:"cover"
            }
        }
        setStyleObj(background_style);
    },[AuctionObj,allmemberspresent])

    return (
        <div>
            {!allmemberspresent && AuctionObj &&
             <div className="DragonBall_Auction" style={StyleObj}>
                
                 <Loader data="Waiting For Other Players!"/>
                <div className="Copy">
                    <div className="Attendance">{AuctionObj.members.map((obj)=><img src={obj.avatar}/>)}</div>
                    <input id="id" value={AuctionObj.auction_id}/>
                    <div onClick={handlecopy}>Copy Match Id</div>
                </div>
            </div>}
           {allmemberspresent && AuctionObj && User &&
           
           <div className="DragonBall_Auction" style={StyleObj}>
                   {alertdata.shown && <div className="DragonBall_Auction_Alert"><Alert alertdata={alertdata} resetalert={resetalert}/></div>}
                   {Loading.loading &&<div className="Loader_Overlay"><Loader data={Loading.data}/></div>}
                    <div className="Auction-Area clearfix" >
                           
                             <div className="User_Account">
                                <div className="Account"><img src={User.avatar}/><div><span>Account Balance : </span>$ {User.Account_Balance}</div></div>
                                <div className="Characters_Left"><span>Characters Left : </span><span>{AuctionObj.charactersarray.length-1-AuctionObj.characterindex}</span></div>
                                <div className="Present_Price"><span>Present Price : </span> $ {parseInt(AuctionObj.priceofcharacter)+1}</div>
                                <div className="Bid"><span>BID :</span> $ {bidvalue}</div>
                             </div>
                           
                            <div className="My_Deck">
                                {User.Ongoing_DragonBall_Deck.map((character)=><img src={character.dp}/>)}
                            </div>
                           
                           <div className="ProgressBar">
                               <div className="progress"></div>
                           </div>

                           <div className="Config">
                               <div className="Participants_Votes">
                                    {AuctionObj.members.map((member)=>
                                        <div className={member.votedtoendauction?'voted':'not_voted'} >
                                            VOTED
                                        </div>
                                    )}
                               </div>
                                <div className="Participants">
                                    {AuctionObj.members.map((member)=>
                                    
                                        <div >
                                            <img className={investorselector(member)} src={member.avatar}/>
                                        </div>
                                    )}
                                </div>
                                <div className="Controller">
                                    <div className="range-slider"><input className="range-slider__range" type="range" value={bidvalue} min={AuctionObj.presentcharacter.base_price} max={AuctionObj.presentcharacter.base_price+4000000} step="100" onChange={(e)=>setbidvalue(parseInt(e.target.value))}/></div>
                                    <div className="Skip" onClick={nextcharacter}>Skip</div>
                                    <div onClick={handletriggerbuy}><img src={dollar}/></div>
                                </div>
                                {!voted && User.Ongoing_DragonBall_Deck.length>0 &&
                                <div className="Vote">
                                    <div onClick={handleVote}>Vote To End Auction</div>
                                </div>}
                               
                           </div>
                           
                           <div className="Cardplace">
                                <Card 
                                    name={AuctionObj.presentcharacter.name}
                                    health={AuctionObj.presentcharacter.health}
                                    attack={AuctionObj.presentcharacter.attack}
                                    defence={AuctionObj.presentcharacter.defence}
                                    baseprice={AuctionObj.presentcharacter.base_price}
                                    url={AuctionObj.presentcharacter.url}
                                    theme={AuctionObj.presentcharacter.theme}
                                    transformable={AuctionObj.presentcharacter.transformable}
                                    next_character={AuctionObj.presentcharacter.next_character}
                                    type='Auction'
                                />
                           </div>
                          
                           
                          
                    </div>
           </div>
            }
        </div>
    )
}
export default DragonBallAuction;