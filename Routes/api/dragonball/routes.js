var express=require("express");
var ObjectId=require("mongodb").ObjectId;

var router=express.Router();

var DragonBall_Character=require("../../../Models/dragonball/dragonball_character");
var DragonBall_Duel = require("../../../Models/dragonball/dragonball_duel");
var DragonBall_Tournament=require("../../../Models/dragonball/dragonball_tournament");
var User = require("../../../Models/user/user");

router.post("/dragonball/gettournamentinfo",async (req,res)=>
{
    try
    {   
      // console.log(req.body);
       
           var tournament=await DragonBall_Tournament.findById(ObjectId(req.body.id));
           if(tournament)
           {
                await tournament.execPopulate('auction');
                await tournament.execPopulate('dragonballcharacters');
                await tournament.execPopulate('duels');
               return res.status(200).json(tournament);
           }
           return res.status(500).send("Tournament Not Found")
       

    }
    catch(err)
    {
        console.log(err);
       return  res.status(500).send(err);
    }
})


router.post("/dragonball/createcharacters",async (req,res)=>
{
    var array=req.body;
    await DragonBall_Character.deleteMany();
    try
    {
        array.map(async (x)=>
        {
            const character=await DragonBall_Character.create(x);
            
        })
        res.status(200).send("Updated!!");
    }
   catch(err)
   {
       console.log(err);
       res.status(500).send(err);
   }
})

router.post("/dragonball/createtournament",async (req,res)=>
{
    data=req.body;
    try
    {
        if(data.numberofplayers==2)
        {
        
            //var array=await DragonBall_Character.find({});
            
            var userid=ObjectId(data.creator_mongoid);
            var duelobj=
            {
                ongoing:false,
                winner:{name:"",mongoid:"",uid:"",avatar:""},
                player1:{name:data.creator_name,mongoid:data.creator_mongoid,uid:data.creator_uid,avatar:data.creator_avatar,occupied:true},
                player2:{name:"",mongoid:"",uid:"",avatar:"",occupied:false},
                final_match:true
            }
            var d= await DragonBall_Duel.create(duelobj);
            var tournamentobj=
            {
               
                type:2,
                winner:null,
               auction:[userid],
                duels:[d],
                ongoing:false
            }
            var x=await DragonBall_Tournament.create(tournamentobj);
            
            await x.execPopulate('auction');
            res.status(200).json(x);
            
        }


        if(data.numberofplayers==4)
        {
           // var array=await DragonBall_Character.find({});
            var userid=ObjectId(data.creator_mongoid);
            var match1=
            {
                ongoing:false,
                winner:{name:"",mongoid:"",uid:"",avatar:""},
                player1:{name:data.creator_name,mongoid:data.creator_mongoid,uid:data.creator_uid,avatar:data.creator_avatar,occupied:true},
                player2:{name:"",mongoid:"",uid:"",avatar:"",occupied:false},
                final_match:false
            }
            var match2=
            {
                ongoing:false,
                winner:{name:"",mongoid:"",uid:"",avatar:""},
                player1:{name:"",mongoid:"",uid:"",avatar:"",occupied:false},
                player2:{name:"",mongoid:"",uid:"",avatar:"",occupied:false},
                final_match:false
            }
            var match3=
            {
                ongoing:false,
                winner:{name:"",mongoid:"",uid:"",avatar:""},
                player1:{name:"",mongoid:"",uid:"",avatar:"",occupied:false},
                player2:{name:"",mongoid:"",uid:"",avatar:"",occupied:false},
                final_match:true
            }
            var firstmatch= await DragonBall_Duel.create(match1);
            var secondmatch= await DragonBall_Duel.create(match2);
            var finalmatch= await DragonBall_Duel.create(match3);

            var tournamentobj=
            {
                
                type:4,
                winner:null,
               auction:[userid],
                duels:[firstmatch,secondmatch,finalmatch],
                ongoing:false
            }

            var fourplayertournament=await DragonBall_Tournament.create(tournamentobj); //name will be changed ,now it is two only for testing
            await fourplayertournament.execPopulate('auction');
            res.status(200).json(fourplayertournament);
        }
    }
    catch(err)
    {
        res.status(500).send("Internal Server Error");
    }
    
})


router.post("/dragonball/jointournament",async (req,res)=>
{
    try
    {
        //console.log("Joining User is : ",req.body);
        var data=req.body;
      
            var tournament=await DragonBall_Tournament.findById(ObjectId(data.joiningid));

            if(tournament.auction.length===tournament.type)
                return res.status(500).send("Game Filled!");

            tournament.auction.push(ObjectId(data.userdata._id));
            await tournament.save();
            await tournament.execPopulate('auction');
            await tournament.execPopulate('dragonballcharacters');
           // await tournament.execPopulate('duels');

           
            //Pushing the second Participant to duels
            var ischanged;
            for(var i=0;i<tournament.duels.length;i++)
            {
                ischanged=false;
               var obj=await DragonBall_Duel.findById(tournament.duels[i]);
              // console.log("HHHHH the duel is : ",obj);
                if(obj && obj.player1.mongoid=="")               //Not needed for type 2 but still written
                {
                    obj.player1.name=data.userdata.Name;
                    obj.player1.mongoid=data.userdata._id;
                    obj.player1.uid=data.userdata.uid;
                    obj.player1.avatar=data.userdata.avatar;
                    obj.player1.occupied=true;

                    ischanged=true;
                }
                else if(obj && obj.player2.mongoid=="")
                {
                    obj.player2.name=data.userdata.Name;
                    obj.player2.mongoid=data.userdata._id;
                    obj.player2.uid=data.userdata.uid;
                    obj.player2.avatar=data.userdata.avatar;
                    obj.player2.occupied=true;

                    ischanged=true;
                }
                //console.log("Is it updated !!",obj);
                if(ischanged)
                {
                    await DragonBall_Duel.findByIdAndUpdate(tournament.duels[i],obj);
                    break;
                }
                 
            }
            //console.log("Okay :",tournament);
            //=======================================
            

            if(tournament)
            {
                res.status(200).json(tournament);
            }
            else
            {
                res.status(500).send("Tournament Doesnt Exist!!");
            }
        
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err);
    }
})


router.post("/dragonball/updateuser/auctiondata",async (req,res)=>
{
    try
    {
        //console.log(req.body);
        var data=req.body;
        var user=await User.findByIdAndUpdate(ObjectId(data.userdata._id),{
            Ongoing_DragonBall_Deck:[],
            Ongoing_Naruto_Deck:[],
            OngoingTournament:true,
            Ongoing_Tournament_id:data.tournament._id,
            Focus_Points:0,
            Account_Balance:30000000
        },{new:true});

        //var user=await User.findById(ObjectId(data.userdata._id));
        if(user)
        {
            res.status(200).json(user);
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send("Internal Server Error!!")
    }
})

router.post("/dragonball/auction/buycharacter",async (req,res)=>
{
    try
    {
        var data=req.body;
        var user=await User.findByIdAndUpdate(ObjectId(data.usermongoid),{
            Account_Balance:data.newaccountbalance
        },{new:true});
        if(user)
        {
            user.Ongoing_DragonBall_Deck.push(ObjectId(data.characterid));
            await user.save();

           // var x=await User.findById(ObjectId(data.usermongoid));
            await user.execPopulate('Ongoing_DragonBall_Deck');
           // console.log(x);
            res.status(200).json(user);
        }
        else
        {
            console.log(err);
            res.status(500).send("User Not Found!!");
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err);
    }
})


router.post("/dragonball/duel/updateuser",async (req,res)=>
{
    try 
    {
        var data=req.body;
       
       var user=await User.findByIdAndUpdate(ObjectId(data.userid),{

        Ongoing_Duel_id:data.duel_id.toString()
       })
       //console.log("Hokaaaaa : ",data,user);
       if(user)
       {
          return  res.status(200).send("User Updated with duel id");
       }
       return res.status(500).send("User Not Found!!");
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err);
    }
})

router.post("/dragonball/tournamentwon",async (req,res)=>
{
    try  //will have to change the model name afterwards for 4 player type
    {
        var data=req.body;
        console.log("updating ",data);
        await DragonBall_Tournament.findByIdAndUpdate(data.tournament_id,
            {
                winner:data.user._id,
                ongoing:false
            })
        
        await User.findByIdAndUpdate(data.user._id,{
            tier:data.user.tier+1,
            Ongoing_DragonBall_Deck:[],
            Ongoing_Naruto_Deck:[],
            OngoingTournament:false,
            Ongoing_Tournament_id:"",
            Account_Balance:0,
            Ongoing_Duel_id:""
        })

        await DragonBall_Duel.findByIdAndUpdate(ObjectId(data.duel_id),
        {
            winner:
            {
                name:data.user.Name,
                mongoid:data.user._id,
                uid:data.user.uid,
                avatar:data.user.avatar

            }
        })


        res.status(200).send("Sucessfully Updated!");
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err);
    }
})


router.post("/dragonball/duel/nextmatch",async (req,res)=>
{
    try
    {
        var data=req.body;
        var user=await User.findByIdAndUpdate(data.user._id,
            {
                Ongoing_Duel_id:data.duel_id.toString(),
                Focus_Points:5
            },{new:true});
        
        await DragonBall_Duel.findByIdAndUpdate(ObjectId(data.winning_duel_id),{
            winner:{
                name:data.user.Name,
                mongoid:data.user._id.toString(),
                uid:data.user.uid,
                avatar:data.user.avatar
            }
        });
        
        var duelobj=await DragonBall_Duel.findById(data.duel_id);
        if(duelobj)
        {
            if(!duelobj.player1.occupied)
            {
                duelobj.player1.name=data.user.Name;
               duelobj.player1.mongoid=data.user._id.toString();
                duelobj.player1.uid=data.user.uid;
                duelobj.player1.avatar=data.user.avatar;
                duelobj.player1.occupied=true;
            }
            else 
            {
                duelobj.player2.name=data.user.Name;
                duelobj.player2.mongoid=data.user._id.toString();
                 duelobj.player2.uid=data.user.uid;
                 duelobj.player2.avatar=data.user.avatar;
                 duelobj.player2.occupied=true;
            }

            var duel=await DragonBall_Duel.findByIdAndUpdate(data.duel_id,duelobj,{new:true});

            await user.execPopulate('Ongoing_DragonBall_Deck');

            res.status(200).json({
                user:user,
                final_match:duel
            })
        }
        else
        {
            res.status(500).send("oops! Couldnt find Duel!");
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send(err);
    }
})


module.exports=router;