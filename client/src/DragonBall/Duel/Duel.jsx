import React,{useState,useEffect,useContext} from "react";
import axios from "axios";
import {GlobalContext} from "../../Contexts/GlobalContext/GlobalContext";
import backendurl from "../../backend_url";
import Card from "../Card/Card";
import "./Duel.scss";
import transformationarray from "../transformations";

import FourTournament from "../../Components/Tournaments/Four/FourTournament";

import trophy from "../../assets/icons/trophy.png";
import {clone} from "ramda";
import  Loader from "../../Components/Loader/Loader";
import spinner from "../../Components/Loader/loader.gif";
import arrow from "../../assets/icons/left-arrow.png";
import Alert from "../../Components/Alert/Alert";

import transformationsound from "../../assets/sounds/dbtransformation.mpeg";
import abilitypoints from "../../assets/sounds/abilitypoints.mpeg";

const Duel=(props)=>
{
    const {User,ChangeUser,Tournament,ChangeTournament,MySocket}=useContext(GlobalContext);
    const [DuelOngoing,setDuelOngoing]=useState(false);
    const [isPlayerOne,setisPlayerOne]=useState(false);
    const [index,setindex]=useState(0);
    const [DuelObj,setDuelObj]=useState(null);
    const [isLoading,setisLoading]=useState(false);
    const [isFinalMatch,setisFinalMatch]=useState(false);
    const [iwon,setiwon]=useState(false);
    const [result,setresult]=useState({
        message1:'',
        message2:'',
        message3:'',
        shown:false
    })

    const [alertdata,setalertdata]=useState({
        message:"",
        shown:false,
        type:''
    })

   
    //const [keyboardkey,setkeyboardkey]=useState("");
   
    const [styleobj,setstyleobj]=useState({
        "background":`linear-gradient(to bottom right,#00C9FF,#92FE9D 100%)`
             
    })


    const [myzonestyle,setmyzonestyle]=useState('My_Zone');
   

  
    //Object 
    const [myobj,setmyobj]=useState(null);
    const [mymove,setmymove]=useState('');
    const[mycharacterplaced,setmycharacterplaced]=useState(false);
    const [fight,setfight]=useState(false);
    const [opponentobj,setopponentobj]=useState(null);
    const [transforming,settransforming]=useState(false);
    var xx='';
    var arr1=[];var arr2=[];
    var x;
    var y;



    const [opponentrestore,setopponentrestore]=useState({
        array:[],
        value:0
    });
    
    const [myrestore,setmyrestore]=useState({
        array:[],
        value:0
    })

    //======

    /*useEffect(()=>//Configuring keypress events
    {
        if(keyboardkey!=="")
        {
            if(keyboardkey=="ArrowLeft")
            {
                handleleftcharacter();
                setkeyboardkey("");
            }
                
            if(keyboardkey=="ArrowRight")
            {
                handlerightcharacter();
                setkeyboardkey("");
            }
               
        }
    },[keyboardkey])*/


    useEffect(()=>
    {
        
        if(!MySocket || !User || !Tournament)
            props.history.push("/");
       
        if(MySocket)
        {

           // console.log("Start Match");

           MySocket.on('resetted',(data)=>
           {
             setfight(false);
              // console.log("resetted",data.data);
               setDuelObj(data.data);
                setmycharacterplaced(false);
               var initialdata=data.data;
              
              if(initialdata.player1.mongoid==User._id.toString())//Means I am Player 1
              {
                 

                  setmyobj(initialdata.player1);
                  initialdata.defend=='player1'?setmymove('defend'):setmymove('attack');

                  xx=initialdata.defend=='player1'?'defend':'attack';

                  setopponentobj(initialdata.player2);

              }
              else//Means Player 2 
              {
                 
                  setmyobj(initialdata.player2);
                  initialdata.defend=='player2'?setmymove('defend'):setmymove('attack');

                  xx=initialdata.defend=='player2'?'defend':'attack';

                  setopponentobj(initialdata.player1);

                
              }

           })


           MySocket.on('attacked',(data)=>
           {
               var res=data.data;
             
                 //  console.log('Attacked : ',data);
                   setDuelObj(res);

                 

                   if(xx=='defend')
                   {
                      // console.log('ahifsf');
                       setopponentobj(res.attacker[0]);
                   }
               
              
           })

           MySocket.on('defended',(data)=>
           {
               var res=data.data;
              
                  // console.log('Defended : ',data);
                   //console.log('my xx move is : ,',xx);
                   setDuelObj(res);
                   if(xx=='attack')
                   {
                       setopponentobj(res.defender[0]);
                   }
               
              
           })

            
            MySocket.on('fight',()=>setfight(true));

            MySocket.on('iwon',()=>
            {
               
                //console.log(isFinalMatch?"This is the last match":"Not Final Match");
                setiwon(true);
            })
        }

        
       
    },[])

    useEffect(()=>
    {
        if(DuelOngoing)
        {
            setisLoading(false);
            //Update User here with axios
        }
    },[DuelOngoing])


    useEffect(()=>
    {
        if(iwon && isFinalMatch)
        {
           // alert("You Won The Tournament");

            //Setting Result
            var resultdata={
                message1:'YOU WON!',
                message2:'You Won the Tournament!',
                message3:'Redirecting...',
                shown:true
            }
            setresult(resultdata);

            //================
            //update tournament , duel and user
            var data={
                user:User,
                tournament_id:Tournament._id,
                duel_id:DuelObj.duel_id
            }
            axios({
                method:"POST",
                data:data,
                url:`${backendurl}/superverse/dragonball/tournamentwon`
            }).then((res)=>
            {
                console.log(res);

                //redirect to /

                setTimeout(()=>
                {
                    props.history.push('/');
                },9000);

            }).catch((err)=>console.log(err));
            
            //==============================
        }
        else if(iwon && !isFinalMatch)
        {
           // alert("you Won The Duel!! get geared Up for next match");

           //setting result==
           var resultdata={
            message1:'YOU WON!',
            message2:'You Won the Duel! Get geared Up for Next Match',
            message3:'Processing Next Match',
            shown:true
           }
           setresult(resultdata);
           //================
            
            axios({
                method:'POST',
                data:{
                    user:User,
                    duel_id:Tournament.duels[Tournament.duels.length-1]._id,
                    tournament_id:Tournament._id,
                    winning_duel_id:DuelObj.duel_id.toString()
                },
                url:`${backendurl}/superverse/dragonball/duel/nextmatch`
            }).then((res)=>
            {
                console.log(res);
                var data=res.data;
                ChangeUser(data.user);

                var tournament_clone=clone(Tournament);
                tournament_clone.duels[tournament_clone.duels.length-1]=data.final_match;
                ChangeTournament(tournament_clone);

                //Reinitializing Duel Data for this final duel
                setDuelOngoing(false);
                setisPlayerOne(false);
                setDuelObj(null);
                setmyobj(null);
                setmymove('');
                setmycharacterplaced(false);
                setfight(false);
                setopponentobj(null);
                settransforming(false);
                xx='';


                //reinitializing result
                setTimeout(()=>
                {
                    var resultdata={
                        message1:'',
                        message2:'',
                        message3:'',
                        shown:false
                    } 
                    setresult(resultdata);
                },6000)
               
                //=====================
                //============================================
            }).catch((err)=>
            {
                console.log(err);
            })
            //Now we have to update the tournament 's duel with this person and also this person s ongoing duel in his account
        }

    },[iwon])

    useEffect(()=>
    {
        if(MySocket)
        {
          
            MySocket.on('startmatch',(data)=>
            {
                setiwon(false);
                setDuelObj(data.data);
                setDuelOngoing(true);

                setalertdata({
                    message:"Match Started!",
                    shown:true,
                    type:'green'
                })

                var initialdata=data.data;
                 //Setting The States of my and opponent
                initialdata.final_match?setisFinalMatch(true):setisFinalMatch(false);

                if(initialdata.player1.mongoid==User._id.toString())//Means I am Player 1
                {
                   

                    setmyobj(initialdata.player1);
                    initialdata.defend=='player1'?setmymove('defend'):setmymove('attack');

                    xx=initialdata.defend=='player1'?'defend':'attack';

                    setopponentobj(initialdata.player2);

                }
                else//Means Player 2 
                {
                 

                    setmyobj(initialdata.player2);
                    initialdata.defend=='player2'?setmymove('defend'):setmymove('attack');

                    xx=initialdata.defend=='player2'?'defend':'attack';

                    setopponentobj(initialdata.player1);

                  

                }
                //=====================================

                //console.log("lets Start the match");
            })
            
        }
        
    })

  
    useEffect(()=>
    {
        if(DuelObj && opponentobj)
        {
            var healthbar=document.getElementById('opponent_health');
            if(healthbar)
            {
                healthbar.style.width=(opponentobj.playerhealth/opponentobj.totalhealth)*100+'%';

            }
        }
    },[opponentobj,DuelObj])

    useEffect(()=>
    {

     
        //setting style obj
        if(myobj && opponentobj)
        {
            var presentcharactertheme=myobj.chosencharacter.theme;
            var array=presentcharactertheme.split(",");
            array[array.length-1]=".5)";
            var lowopacitytheme=array.join(',');

            var optheme=opponentobj.chosencharacter.theme;
            var oparray=optheme.split(",");
            oparray[oparray.length-1]=".5)";
            var lowopacityopponenttheme=oparray.join(",");

           // console.log(lowopacitytheme);  #D8E1DC
            var newstyle={"background":`linear-gradient(to right bottom,${opponentobj.chosencharacter.theme},${lowopacityopponenttheme},#BEC6C2,${lowopacitytheme},${presentcharactertheme})`};
           
            setstyleobj(newstyle);
            
            
        }

        //===================

        if(DuelObj && myobj)
        {
           var healthbar=document.getElementById('my_health');
           // console.log(healthbar);
            if(healthbar)
            {
                
                healthbar.style.width=(myobj.playerhealth/myobj.totalhealth)*100+'%';

            }
        }

        if(myobj && DuelObj)
        {
            if(myobj.deck.length==0)
            {

                MySocket.emit('lostduel',{duel_id:DuelObj.duel_id});
                var resultdata={
                    message1:'YOU LOST!',
                    message2:'You lost the Tournament!',
                    message3:'Redirecting...',
                    shown:true
                } 
                setresult(resultdata);

                setTimeout(()=>
                {
                    props.history.push('/');
                },9000);

            }
        }
    },[myobj,DuelObj])

    useEffect(()=>
    {
        if(fight)
        {
           // console.log("Okay Lets Battle!!");
            if(mymove=='defend')
            {
                var y=clone(myobj);
               

                setTimeout(async ()=>
                {
                    var damage=Math.floor((opponentobj.chosencharacter.attack/y.chosencharacter.defence)*20);

                    //If attacking card's stamina is low
                    if(opponentobj.chosencharacter.stamina < opponentobj.chosencharacter.stamina_threshold)
                    {
                        var damage_hindered=Math.floor(((opponentobj.chosencharacter.stamina_threshold - opponentobj.chosencharacter.stamina)/10)*damage);
                        damage = damage - damage_hindered;
                    }
                    //==================================

                    if(y.chosencharacter.stamina<y.chosencharacter.stamina_threshold)
                    {
                        var extradamage=Math.floor(((y.chosencharacter.stamina_threshold - y.chosencharacter.stamina)/10)*damage);
                        damage=damage + extradamage;
                    }


                    if(y.chosencharacter.health<damage)
                    {
                        damage=y.chosencharacter.health;
                        y.deck[y.chosencharacterindex].health=0;
                    }
                    else 
                    {
                        y.deck[y.chosencharacterindex].health = y.deck[y.chosencharacterindex].health-damage;
                    }
                    y.chosencharacter=y.deck[y.chosencharacterindex];
                    y.playerhealth=y.playerhealth-damage;
                    
                     if(damage<=16)//Increasing Focus Points
                    {
                        y.focuspoints++;
                        var as=document.getElementById('ability_sound');
                        as.play();

                        setalertdata({
                            message:"Got 1 Ability Point",
                            shown:true,
                            type:'yellow'
                        })
                    }
                    else 
                    {
                        setalertdata({
                            message:`Damage Taken - ${damage}`,
                            shown:true,
                            type:'red'
                        })
                    }


                    setmyobj(y);

                     x=clone(opponentobj);
                    for(var i=0;i<x.deck.length;i++)
                    {
                       
                        if(i==x.chosencharacterindex)
                        {
                            if(x.deck[i].stamina-1>=0)
                                x.deck[i].stamina-=1;
                        }
                        else 
                        {
                            if(x.deck[i].stamina+1<=10)
                                x.deck[i].stamina++;
                        }
                    }
                    x.chosencharacter=x.deck[x.chosencharacterindex];
                    console.log("Opponent has attacked and his data should be : ",x);
                    setopponentobj(x);


                },1000);


                setTimeout(()=>
                {
                    if(y.playerhealth<=0 && opponentobj.playerhealth>0)
                    {
                        //Make the opponent winner 
                       
                        MySocket.emit('lostduel',{duel_id:DuelObj.duel_id});
                       // alert("You Lost!");

                        //setting result
                        var resultdata={
                            message1:'YOU LOST!',
                            message2:'You lost the Tournament!',
                            message3:'Redirecting...',
                            shown:true
                        } 
                        setresult(resultdata);

                        setTimeout(()=>
                        {
                            props.history.push('/');
                        },9000);
                        //==============


                       // MySocket.off();
                        //Push the user to / route
                    }
                    else //Lets reset the moves and update the state of the game
                    {
                        
                        if(isPlayerOne)
                        {
                           var data={
                                player1:y,
                                player2:x,
                                duel_id:DuelObj.duel_id
                            }
                        }
                        else 
                        {
                           var data={
                                player1:x,
                                player2:y,
                                duel_id:DuelObj.duel_id
                            }
                        }
                       // console.log('before reset data is : ',data);
                        MySocket.emit('reset',data);
    
                    }
                  
                },5000)
               
               
            }
            else //I am attacker (spectator)
            {
                var y=clone(opponentobj);

               

                setTimeout(async ()=>
                {
                    var damage=Math.floor((myobj.chosencharacter.attack/y.chosencharacter.defence)*20);

                    //if my stamina is lower than threshold
                    if(myobj.chosencharacter.stamina < myobj.chosencharacter.stamina_threshold)
                    {
                        var damage_hindered=Math.floor(((myobj.chosencharacter.stamina_threshold - myobj.chosencharacter.stamina)/10)*damage);
                        damage = damage - damage_hindered;
                    }
                    //=====================================

                    if(y.chosencharacter.stamina<y.chosencharacter.stamina_threshold)
                    {
                        var extradamage=Math.floor(((y.chosencharacter.stamina_threshold - y.chosencharacter.stamina)/10)*damage);
                        damage=damage + extradamage;
                    }

                    if(y.chosencharacter.health<damage)
                    {
                        damage=y.chosencharacter.health;
                        y.deck[y.chosencharacterindex].health=0;
                    }
                    else 
                    {
                        y.deck[y.chosencharacterindex].health=y.deck[y.chosencharacterindex].health-damage;
                    }
                    y.chosencharacter=y.deck[y.chosencharacterindex];
                    y.playerhealth=y.playerhealth-damage;
                    setopponentobj(y);

                    setalertdata({
                        message:`Damage Given - ${damage}`,
                        shown:true,
                        type:'green'
                    })


                    //Stamina algo
                   /* var copiedmyobj=clone(myobj);
                    for(var i=0;i<copiedmyobj.deck.length;i++)
                    {
                        
                        if(i===myobj.chosencharacterindex)
                        {
                            if(copiedmyobj.deck[i].stamina-1>=0)
                                copiedmyobj.deck[i].stamina-=1;
                        }
                        else 
                        {
                            if(copiedmyobj.deck[i].stamina+1<=10)
                              copiedmyobj.deck[i].stamina+=1;
                        }
                    }
                    copiedmyobj.chosencharacter=copiedmyobj.deck[copiedmyobj.chosencharacterindex];
                    console.log("Attack stamina result : ",copiedmyobj);
                    console.log("My Original Obj is : ",myobj);
                    //setmyobj(copiedmyobj);*/
                   
                    //============

                },1000);
            }
           
            
        }
    },[fight])

    useEffect(()=>//This useeffect sets my one styles
    {   
        if(myobj)
        {
            if(mycharacterplaced)
            {
                setmyzonestyle("My_Zone placed");

                setalertdata({
                    message:"Character Placed",
                    shown:true,
                    type:'green'
                })
            }
           else if(mymove=="attack")
            {
                setmyzonestyle("My_Zone attack");

                setalertdata({
                    message:"Your Move - Attack",
                    shown:true,
                    type:'green'
                })
            }
            else if(mymove=="defend")
            {
                setmyzonestyle("My_Zone defence");

                setalertdata({
                    message:"Your move - Defend!",
                    shown:true,
                    type:'green'
                })
            }
        }
    },[mycharacterplaced,mymove])

    useEffect(()=>
    {
        if(myobj && opponentobj)
        {
            var myregeneratepoints=Math.floor(myobj.focuspoints/3);
            var opponentregeneratepoints=Math.floor(opponentobj.focuspoints/3);
            
             arr1=[];arr2=[];
            for(var i=0;i<myregeneratepoints;i++)
                arr1.push(i);
            for(var i=0;i<opponentregeneratepoints;i++)
                arr2.push(i);

            setmyrestore({
                array:arr1,
                value:myregeneratepoints
            });
            setopponentrestore({
                array:arr2,
                value:opponentregeneratepoints
            });
        }
      

    },[myobj,opponentobj])


    //Stamina System my move config===============
    useEffect(()=>
    {
        if(myobj)
        {
            if(myobj.chosencharacter.stamina<myobj.chosencharacter.stamina_threshold)
            {
                setalertdata({
                    message:"Warning! Stamina Low",
                    shown:true,
                    type:'red'
                })
            }
           
        }
           
       
    },[mymove])

    //=======================================



    //Functions ================

    const resetalert=()=>
    {
        setalertdata({
            message:"",
            shown:false,
            type:''
        })
    }


    const isplayer1=(mongoid)=>
    {
       return mongoid==User._id.toString() ?true:false;       
    }

    const handlemymove =()=>
    {
        if(!mycharacterplaced)
        {
            if(myobj.chosencharacter.health!==0)
            {
               
                    setmycharacterplaced(true);
                    var player=
                    {
                        name:User.Name,
                        avatar:User.avatar,
                        uid:User.uid,
                        mongoid:User._id,
                        deck:myobj.deck,
                        chosencharacter:myobj.chosencharacter,
                        chosencharacterindex:myobj.chosencharacterindex,
                        focuspoints:myobj.focuspoints,
                        totalhealth:myobj.totalhealth,
                        playerhealth:myobj.playerhealth
                    }
                    var data=
                    {
                            usermongoid:User._id.toString(),
                            duel_id:DuelObj.duel_id,
                            isPlayerone:isplayer1(DuelObj.player1.mongoid),
                            playerobj:player
                        
                    }
    
                   // console.log("placing move",data);
    
                    if(mymove=='attack')
                    {
                      //  console.log('attacking now ',data);
                            MySocket.emit('attack',data);
                    }
                    else if(mymove=='defend')
                    {
                       // console.log('defending now : ',data);
                        MySocket.emit('defend',data);
                    }
               
                
               
           }
           else 
           {
                setalertdata({
                    message:"Character is Dead!",
                    shown:true,
                    type:'red'
                })
           }
                
            
        }
        else 
       {
            setalertdata({
                message:"You have already placed your Character!",
                shown:true,
                type:'red'
            })
       }
        
    }



    
    const handleleftcharacter=()=>
    {
       var y=clone(myobj);
      // console.log(y)
       if(y.chosencharacterindex-1>=0)
       {
           y.chosencharacterindex--;
          y.chosencharacter=y.deck[y.chosencharacterindex];
            setmyobj(y);
       }

    }

    const handlerightcharacter=()=>
    {
        var y=clone(myobj);
       // console.log(y);
        if(y.chosencharacterindex+1<y.deck.length)
        {
            y.chosencharacterindex++;
           y.chosencharacter=y.deck[y.chosencharacterindex];
             setmyobj(y);

             
        }
    }



   

    const handletransformcharacter=()=>
    {
        if(myobj && !mycharacterplaced)
        {
            if(myobj.chosencharacter.health>0)
            {
                if(myobj.chosencharacter.transformable)
                {
                    //Check if you have enough focus points
                    if(myobj.focuspoints>0)
                    {
                        var nextcharacter=transformationarray.find((obj)=>obj.name===myobj.chosencharacter.next_character);
                        if(nextcharacter)
                        {
                            settransforming(true);
                            //transform sound
                            var ts=document.getElementById('transform_sound');
                            if(ts)
                            {
                                //console.log(ts);
                                ts.play();
                            }
                            //===============

                            setTimeout(()=>
                            {
                                //console.log(nextcharacter);
                                var copiedmyobj=clone(myobj);
                                var finalhealth;
                                var finalplayerhealth;
                                var increment;

                                if(copiedmyobj.chosencharacter.health+25>=copiedmyobj.chosencharacter.total_health)//character health configuration
                                {
                                    finalhealth=copiedmyobj.chosencharacter.total_health;

                                   
                                }
                                else
                                {
                                    finalhealth=copiedmyobj.chosencharacter.health+25;
                                   
                                }
                                    
                                increment=finalhealth-copiedmyobj.chosencharacter.health;

                                finalplayerhealth= copiedmyobj.playerhealth + increment;

                               /* if(copiedmyobj.playerhealth+25>=copiedmyobj.totalhealth)//player health configuration
                                    finalplayerhealth=copiedmyobj.totalhealth;
                                else
                                    finalplayerhealth=copiedmyobj.playerhealth+25;*/

                                //setting stamina increment 
                                var final_stamina=0;
                                if(copiedmyobj.chosencharacter.stamina+3>10)
                                  final_stamina=10;
                                else
                                   final_stamina=copiedmyobj.chosencharacter.stamina+3;
                              //===========================


                                copiedmyobj.deck[myobj.chosencharacterindex]=nextcharacter;
                                copiedmyobj.deck[myobj.chosencharacterindex].health=finalhealth;//Setting the final health

                                copiedmyobj.deck[myobj.chosencharacterindex].stamina=final_stamina;

                                copiedmyobj.chosencharacter=copiedmyobj.deck[myobj.chosencharacterindex];
                                copiedmyobj.focuspoints--;
                                copiedmyobj.playerhealth=finalplayerhealth;
                                setmyobj(copiedmyobj);

                                settransforming(false);

                                setalertdata({
                                    message:"Character Transformed !",
                                    shown:true,
                                    type:'yellow'
                                })
                            },1500)
                           
                        }
                           
                        else
                            alert("Wierd ! Not Found");
                    }
                    else 
                    {
                        setalertdata({
                            message:"Not enough Ability Points",
                            shown:true,
                            type:'red'
                        })
                    }

                   
                }
                else 
                {
                    setalertdata({
                        message:"Character does'nt Transform!",
                        shown:true,
                        type:'red'
                    })
                }
            }
            else 
             {
                setalertdata({
                    message:"Character is Dead!",
                    shown:true,
                    type:'red'
                })
             }
        }
      
    }




    const regeneratehealth=()=>
    {
        if(myobj && !mycharacterplaced)
        {
           
            if(myobj.chosencharacter.health>0)
            {
                if(myrestore.value>0 && myobj.focuspoints>=3)
                {
                    var copiedmyobj=clone(myobj);
                    var finalhealth;
                    var finalplayerhealth;
                    var increment;

                    if(copiedmyobj.chosencharacter.health+25>=copiedmyobj.chosencharacter.total_health)//character health configuration
                    {
                        finalhealth=copiedmyobj.chosencharacter.total_health;
                    }
                    else
                    {
                        finalhealth=copiedmyobj.chosencharacter.health+25;
                       
                    }
                        
                    increment=finalhealth-copiedmyobj.chosencharacter.health;

                    finalplayerhealth= copiedmyobj.playerhealth + increment;

                    copiedmyobj.deck[copiedmyobj.chosencharacterindex].health=finalhealth;//Setting the final health
                    copiedmyobj.deck[copiedmyobj.chosencharacterindex].stamina=10;
                    copiedmyobj.chosencharacter=copiedmyobj.deck[myobj.chosencharacterindex];
                    copiedmyobj.focuspoints-=3;
                    copiedmyobj.playerhealth=finalplayerhealth;
                   
                    settransforming(true);
                    setTimeout(()=>
                    {
                        setmyobj(copiedmyobj);
                    },500)
                    setTimeout(()=>
                    {
                        settransforming(false);
                        setalertdata({
                            message:'Health Regenerated!',
                            shown:true,
                            type:'yellow'
                        })
                    },1000)


                }
                else
                {
                    setalertdata({
                        message:"Not Enough Chakra!",
                        shown:true,
                        type:'red'
                    })
                }
            }
            else 
            {
                setalertdata({
                    message:"Character is Dead!",
                    shown:true,
                    type:'red'
                })
            }
        }
    }


    const setupmatch=(data,player)=>
    {
        //Axios Request setting onging duel id in user==
        //console.log("The Created data is : ",data);
        axios({
            method:'POST',
            data:data,
            url:`${backendurl}/superverse/dragonball/duel/updateuser`
        }).then((res)=>
        {
            console.log(res.data);

            //Emitting Start Duel

                //Calculating Total Health====
                var sum=0;
                for(var i=0;i<User.Ongoing_DragonBall_Deck.length;i++)
                {
                    sum=sum+User.Ongoing_DragonBall_Deck[i].health;
                }
                //============================
            var obj={
                duel_id:data.duel_id,
                tournament_id:Tournament._id,
                playerobj:
                {
                    name:User.Name,
                    avatar:User.avatar,
                    uid:User.uid,
                    mongoid:User._id,
                    deck:User.Ongoing_DragonBall_Deck,
                    chosencharacter:User.Ongoing_DragonBall_Deck[0],
                    chosencharacterindex:0,
                    focuspoints:User.Focus_Points,
                   totalhealth:sum,
                   playerhealth:sum

                },
                isPlayerone:player.isPlayerone,
                final_match:data.final_match
            }

            MySocket.emit('joindragonballduel',obj);
            //===================

        }).catch((err)=>
        {
            console.log(err);
        })

        //==========================================
    }

    const handlenextmatch=()=>
    {
        //console.log("Lets Find Next match");
        setisLoading(true);
        for(var i=index;i<Tournament.duels.length;i++)
        {
            var obj=Tournament.duels[i];
            if(obj.player1.mongoid==User._id.toString())
            {
                var data=
                {
                    duel_id:obj._id,
                    userid:User._id,
                    final_match:obj.final_match
                   
                }
                setupmatch(data,{isPlayerone:true});
                setisPlayerOne(true);
                setindex(i+1);
              
                break;
            }
            if(obj.player2.mongoid==User._id.toString())
            {
                var data=
                {
                    duel_id:obj._id,
                    userid:User._id,
                    final_match:obj.final_match
                   
                }
                setupmatch(data,{isPlayerone:false});
                setindex(i+1);
                break;
            }

        }
    }

   /*
        document.addEventListener('keydown',(e)=>//KEy press event
        {
            setkeyboardkey(e.key);
        })*/
   
   


    //=======================

    return(
        <div className="Duel_page" style={styleobj}>{Tournament &&
                <div>
                    {isLoading && <Loader data="Waiting For Opponent!"/>}
                    {alertdata.shown && <div className="Duel_Alert"><Alert alertdata={alertdata} resetalert={resetalert}/></div>}
                    {result.shown && 
                    <div className="Result">
                        <div className="Result_Info">
                            <div><img src={User.avatar}/></div>
                            <div className={result.message1=='YOU WON!'?'victory':'lost'}><h1>{result.message1}</h1></div>
                            <div>{result.message2}</div>
                            <div>{result.message3}</div>
                            <div><img src={spinner}/></div>
                        </div>
                     </div>}
                    {!DuelOngoing && Tournament && !isLoading &&
                    <div className="Super_Verse_heading">
                        <span>Super</span> <span>Verse</span>
                    </div>}
                     {!DuelOngoing && Tournament.type==2 && !isLoading &&
                    <div className="Tournament_Tree_two">
                            
                          <div className="firstlevel">
                              <img src={trophy}/>
                          </div>
                          <div className="secondlevel"></div>
                          <div className="thirdlevel"></div>
                          <div className="fourthlevel">
                              <img src={Tournament.duels[0].player1.avatar}/>
                              <img src={Tournament.duels[0].player2.avatar}/>
                          </div>
                          {!DuelOngoing && 
                        <div onClick={handlenextmatch} className="Next_Button">
                            Next Duel  
                        </div>}
                    </div>}

                    {!DuelOngoing && Tournament.type==4 && !isLoading &&
                    <div className="Center">
                        <div>
                            <FourTournament
                                match1={Tournament.duels[0]}
                                match2={Tournament.duels[1]}
                                match3={Tournament.duels[2]}
                            />
                        </div>
                         <div onClick={handlenextmatch} className="Next_Button">
                            Next Duel  
                        </div>
                    </div>
                    }

                    {DuelOngoing && DuelObj && User && myobj && opponentobj &&
                    
                    <div className="Duel-Area">
                        {myobj.deck.length>0 && opponentobj.deck.length>0 &&
                        <div className="Players-Details">
                                 {myobj && <div className="My_Deck">
                                    {myobj.deck.map((character)=><img src={character.dp} style={myobj.chosencharacter.name==character.name?{"backgroundColor":"gold"}:{}}/>)}
                                </div>}
                            <div className="opponent">
                                <div className="name_n_focus">
                                     <div>{opponentobj.name}</div>
                                     <div className="focuspoints" ><div>{opponentobj.focuspoints} X </div><div className="gold_circle"></div></div>

                                </div>
                                <div className="details">
                                    <img src={opponentobj.avatar}/>
                                    <div id="opponent_healthbar">
                                        <div id="opponent_health"></div>
                                    </div>
                                </div>
                                <div className="Health_Number">
                                   <span>HP : </span> {opponentobj.playerhealth}
                                </div>

                                <div className="Senzu_Bean_div">
                                    {opponentrestore.array.map(()=> <div><img src="https://res.cloudinary.com/drolmjcot/image/upload/q_auto:eco/v1612515973/senzu_bean_ptpqfp.png"/></div>)}
                                </div>
                               
                            </div>

                            <div className="Me">
                                <div className="name_n_focus">
                                  <div>You</div>
                                  <div className="focuspoints" onClick={handletransformcharacter}><div>{myobj.focuspoints} X </div><div className="gold_circle"></div></div>
                                </div>
                                <div className="details">
                                    <img src={myobj.avatar}/>
                                    <div id="my_healthbar">
                                        <div id="my_health"></div>
                                    </div>
                                </div>
                                <div className="Health_Number">
                                   <span>HP : </span> {myobj.playerhealth}
                                </div>
                                <div className="Senzu_Bean_div">
                                    {myrestore.array.map(()=> <div onClick={regeneratehealth}><img src="https://res.cloudinary.com/drolmjcot/image/upload/q_auto:eco/v1612515973/senzu_bean_ptpqfp.png"/></div>)}
                                </div>
                               
                            </div>
                        </div>}

                     
                        {/*<section className="Fight_Zone">
                            <div className="Defence_Zone" onClick={defend}>

                            </div> 
                            <div className="Select_Character">
                                <div className="Left" onClick={handleleftcharacter}>Left</div>
                                <div className="My_Character">
                                    {mychosencharacter && <img src={mychosencharacter.url}/>} 
                                </div>
                                <div className="Right" onClick={handlerightcharacter}>Right</div>
                            </div>
                            <div className="Attack_Zone" onClick={attack}>

                            </div>

                        </section>*/}

                        {myobj.deck.length>0 && opponentobj.deck.length>0 && <div className="Fight_Zone">
                            
                            <audio id="transform_sound">
                                <source src={transformationsound} type="audio/mpeg"/>
                            </audio>

                            <audio id="ability_sound">
                                <source src={abilitypoints} type="audio/mpeg"/>
                            </audio>

                            <div  className={mymove=='attack'?"Opponent_Zone defence":"Opponent_Zone attack"}  >

                                {mymove=='attack' && DuelObj.defender.length!=0 && DuelObj.attacker.length==0 && <div  className="opponent_placed"><div>{opponentobj.name} has placed his card</div><div><img src={spinner}/></div></div>}
                                {mymove=='defend' && DuelObj.defender.length==0 && DuelObj.attacker.length!=0 && <div  className="opponent_placed"><div>{opponentobj.name} has placed his card</div><div><img src={spinner}/></div></div>}
                                {DuelObj.defender.length!==0 && DuelObj.attacker.length!==0 && 
                                <div>
                                <Card
                                    name={opponentobj.chosencharacter.name}
                                    health={opponentobj.chosencharacter.health}
                                    attack={opponentobj.chosencharacter.attack}
                                    defence={opponentobj.chosencharacter.defence}
                                    baseprice={opponentobj.chosencharacter.base_price}
                                    url={opponentobj.chosencharacter.url}
                                    theme={opponentobj.chosencharacter.theme}
                                    transformable={opponentobj.chosencharacter.transformable}
                                    next_character={opponentobj.chosencharacter.next_character}
                                    stamina={opponentobj.chosencharacter.stamina}
                                    stamina_threshold={opponentobj.chosencharacter.stamina_threshold}
                                    type='Duel'
                                /></div>}

                            </div> 

                            <div className="Select_Character" >
                                <div>
                                    {(!mycharacterplaced && !transforming) && <div className="Left" onClick={handleleftcharacter} ><img src={arrow}/></div>} 
                                    <div className="My_Character" >
                                        {myobj.chosencharacter && <div><img src={myobj.chosencharacter.url}/></div>} 
                                    </div>
                                    {(!mycharacterplaced && !transforming)  && <div className="Right" onClick={handlerightcharacter}><img src={arrow}/></div>}
                                </div>
                             
                            </div>

                            <div  className={myzonestyle}  onClick={handlemymove} >
                                <Card
                                    name={myobj.chosencharacter.name}
                                    health={myobj.chosencharacter.health}
                                    attack={myobj.chosencharacter.attack}
                                    defence={myobj.chosencharacter.defence}
                                    baseprice={myobj.chosencharacter.base_price}
                                    url={myobj.chosencharacter.url}
                                    theme={myobj.chosencharacter.theme}
                                    transformable={myobj.chosencharacter.transformable}
                                    next_character={myobj.chosencharacter.next_character}
                                    stamina={myobj.chosencharacter.stamina}
                                    stamina_threshold={myobj.chosencharacter.stamina_threshold}
                                    type='Duel'
                                />
                            </div>

                        </div>}

                    </div>}
                   
                </div>}
           
          
        </div>
    )
}
export default Duel;