var express=require("express");
var app=express();
var cors=require("cors");
var bodyparser=require("body-parser");
var admin=require("./firebase-admin");
var socket=require("socket.io");
var path=require("path");

var DragonBall_Character=require("./Models/dragonball/dragonball_character");
var Naruto_Character=require("./Models/naruto/naruto_character");
var User=require("./Models/user/user");


//Helper Functions==============

const {
  auctionobjpresent,
  getauctionarray,
  updateauctionarray,

  
    getdragonballduelarray,
    dragonballduelobjpresent,
    updatedragonballduelarray
}=require("./helpers/dragonball/helper");

//==============================


const mongooseConnect=require("./Database/mongooseconnect");
var ObjectId=require("mongodb").ObjectId;
const { emit } = require("./Models/dragonball/dragonball_character");
mongooseConnect();


app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(
    cors({
      origin: "http://localhost:3000", // <-- location of the react app were connecting to
      
      credentials: true,
    })
  );

  app.use("/",require("./Routes/api/dragonball/routes"));
  //app.use("/",require("./Routes/api/naruto/routes"));
  

//User Authentication Goes Here

  const generatetoken=(data)=>
  {
    if(data && data.split(" ")[0]=="Bearer")
    {
      return data.split(" ")[1];
    }
    else
      return null;
  }

  app.post("/createorjoinuser",async (req,res)=>
  {
    try
    {
      const token=generatetoken(req.headers.authorization);
      if(token)
      {
        const userinfo= await admin.auth().verifyIdToken(token);
        req.user=userinfo;
       // console.log(req.user)
        const user=await User.findOne({uid:req.user.user_id});
        if(!user)
        {
          var userobj={
            Name:req.user.name,
            uid:req.user.user_id,
            avatar:req.user.picture,
            email:req.user.email,
            tier:1,
            OngoingTournament:false,
            Ongoing_Tournament_id:"",
            Ongoing_Duel_id:"",
            Ongoing_DragonBall_Deck:[],
            Ongoing_Naruto_Deck:[],
            Focus_Points:0,
            Account_Balance:0
          }
          var newuser= await User.create(userobj);
          return res.status(200).json(newuser);
        }
        else{
          console.log("user was already Present in Data base so not created! : ",user.Name);
          return res.status(200).json(user);
        }
        
      }
      else{
        return res.status(401).send("Not Authorized!!");
      }
    }
    catch(err)
    {
      console.log(err);
      return res.status(500).send("Internal Server Error!!");
    }
        
  })

 


//-----------------------------

const PORT=process.env.PORT || 5000;
var server=app.listen(PORT,()=>
{
    console.log(`Server started on port ${PORT}`);
})


var io=socket(server);

io.on("connection",async (socket)=>
{
 // socket.id = socket.handshake.query['foo'];
  //socket.emit("nani",{data:socket.id});
  //console.log(socket.id);
  console.log("A socket Connection has been made : ",socket.id);

  socket.on("joinauction",async (data,cb)=>
  {
    //console.log(data);
    //Refactoring ==========
    var obj=auctionobjpresent(data.auction_id);
    var userobj=
    {
        name:data.name,
        avatar:data.avatar,
        uid:data.uid,
        mongoid:data.mongoid,
        socketid:socket.id,
        charactersarray:[],
        votedtoendauction:false
        
    }
    if(!obj)
    {
      var auctionarray=getauctionarray();
      var dbcharacters=await DragonBall_Character.find({});
       //Durstenfeld Shuffle algorithm

        var shufflearr=[...dbcharacters];
        for(var i =shufflearr.length-1;i>0;i--)
        {
          var j=Math.floor(Math.random()*(i+1));
          var temp=shufflearr[i];
          shufflearr[i]=shufflearr[j];
          shufflearr[j]=temp;
        }

       //=============================
        var newauction=
        {
          auction_id:data.auction_id,
          type:data.type,
          gameverse:data.gameverse,
          charactersarray:shufflearr,
          members:[userobj],
          presentcharacter:shufflearr[0],
          characterindex:0,
          priceofcharacter:shufflearr[0].base_price-1,
          investor:[],
          finishcounter:0
        }
        auctionarray.push(newauction);
        updateauctionarray(auctionarray);
        socket.join(data.auction_id);
        io.to(data.auction_id).emit("updateauction",{data:newauction});


       //console.log("Tournament Created and tournament array is : ",getauctionarray());
    }
    else
    {
        if(obj.members.length!==obj.type)
        {
          var userismember=obj.members.find((member)=>data.mongoid==member.mongoid);
          if(!userismember)
          {
             obj.members.push(userobj);
             socket.join(data.auction_id);
             io.to(data.auction_id).emit("updateauction",{data:obj});
             if(obj.members.length==obj.type)
               io.to(data.auction_id).emit("triggerauction",{data:obj});
            
           // console.log("User Joined the tournament and the tournament array is : ",getauctionarray());
          }
        }
        else
          console.log("Tournament Full !!");
    }

    //======================
        
  
  })

  socket.on("bid",async (data)=>
  {
    //console.log(data);
    var obj=auctionobjpresent(data.auction_id);
    if(obj)
    {
      obj.priceofcharacter=data.bidprice;
      if(obj.investor.length==0)
      {
        obj.investor.push(data.investor);
      }
      else
      {
        obj.investor.splice(0,1);
        obj.investor.push(data.investor);
      }

     // console.log("New Bid Auction Obj is : ",obj);
     // var auctionarray=getauctionarray();
     // console.log("Now the Auction array is : ",auctionarray);
      io.to(obj.auction_id).emit("bidded",{data:obj});
  
    }
   
  })


  socket.on('nextcharacter',async (data)=>
  {
    var obj=auctionobjpresent(data.auction_id);
    if(obj)
    {
      if(obj.characterindex+1<obj.charactersarray.length)
      {
        obj.characterindex++;
        obj.presentcharacter=obj.charactersarray[obj.characterindex];
        obj.investor.splice(0,1);
        obj.priceofcharacter=obj.presentcharacter.base_price - 1;
        
        /*var auctionarray=getauctionarray();
        console.log("NExt array obj is :",obj);
        console.log("after next character  the auction array is : ",auctionarray);*/


        io.to(data.auction_id).emit('updateauctionnextcharacter',{data:obj});

      }
      else
      {
        var auctionarray=getauctionarray();

        auctionarray=auctionarray.filter((x)=>x.auction_id!=data.auction_id);

        updateauctionarray(auctionarray);

       // console.log("Characters finished so now the app.js auction array is : ",auctionarray);
       // var x=getauctionarray()
        //console.log("Characters FInished !! so now the auction array is : ",x);

        io.to(data.auction_id).emit('finishauction',{message:"Characters Finished!! Processing Tournament..."});
      }
    }

  })

  socket.on('increasefinishcounter',(data)=>
  {
    var obj=auctionobjpresent(data.auction_id);
    if(obj)
    {
      obj.finishcounter++;
      if(obj.finishcounter==obj.type)
      {
        var auctionarray=getauctionarray();
        auctionarray=auctionarray.filter((x)=>x.auction_id!==data.auction_id);
        updateauctionarray(auctionarray);
        io.to(data.auction_id).emit('finishauction',{message:"Acc Bal is below $1000000!! Processing Tournament..."});
       
      }
     
      //var x=getauctionarray()
      //console.log("Auction Array After increment is : ",x);
    }
  })


  socket.on('voted',(data)=>
  {
    var obj=auctionobjpresent(data.auction_id);
    if(obj)
    {
      var member=obj.members.find((x)=>x.mongoid===data.usermongoid);
      member.votedtoendauction=true;

      var counter=0;
      for(var i=0;i<obj.members.length;i++)
      {
        if(obj.members[i].votedtoendauction)
          counter++;
      }

      io.to(data.auction_id).emit("updateauctionvotes",{data:obj});

      if(counter==obj.type)
      {
        var auctionarray=getauctionarray();
        auctionarray=auctionarray.filter((x)=>x.auction_id!==data.auction_id);
        updateauctionarray(auctionarray);
        io.to(data.auction_id).emit('finishauction',{message:"All Members Voted To End Auction!"});
       
      }

     // console.log("Now the auction array is : ",getauctionarray());
    }
  })



  //dragonball duel ==========================

 

  socket.on('joindragonballduel',(data)=>
  {
      var obj=dragonballduelobjpresent(data.duel_id);
      if(obj)
      {
        if(data.isPlayerone)
        {
          obj.player1=data.playerobj;
        }
        else 
        {
          obj.player2=data.playerobj;
        }
        socket.join(data.duel_id);
        io.to(data.duel_id).emit("startmatch",{data:obj});

      //  console.log("The duel array is : ",getdragonballduelarray());
      }
      else 
      {
        var duelarray=getdragonballduelarray();
        if(data.isPlayerone)
        { 
          var duelobj=
          {
            duel_id:data.duel_id,
            tournament_id:data.tournament_id,
            player1:data.playerobj,
            player2:null,
            defend:'player2',
            attacker:[],
            defender:[],
            final_match:data.final_match
           
            
          }
        }
        else 
        {
          var duelobj=
          {
            duel_id:data.duel_id,
            tournament_id:data.tournament_id,
            player1:null,
            player2:data.playerobj,
            defend:'player2',
            attacker:[],
            defender:[],
            final_match:data.final_match         
            
          }
        }
        duelarray.push(duelobj);
        updatedragonballduelarray(duelarray);
       socket.join(data.duel_id);
      }
  })

  socket.on('attack',(data)=>
  {
    var obj=dragonballduelobjpresent(data.duel_id);
    if(obj)
    {
        obj.attacker=[];
        obj.attacker.push(data.playerobj);
        io.to(data.duel_id).emit('attacked',{data:obj});

        //Check trigger fight state
          if(obj.defender.length!==0 && obj.attacker.length!==0)
          {
            io.to(data.duel_id).emit('fight');
          }
        //=========================
    }
  })

  socket.on('defend',(data)=>
  {
    var obj=dragonballduelobjpresent(data.duel_id);
    if(obj)
    {
      obj.defender=[];
      obj.defender.push(data.playerobj);
      io.to(data.duel_id).emit('defended',{data:obj});

        //Check trigger fight state
        if(obj.defender.length!==0 && obj.attacker.length!==0)
          {
            io.to(data.duel_id).emit('fight');
          }
        //=========================
    }
  })

  socket.on('reset',(data)=>
  {
    var obj=dragonballduelobjpresent(data.duel_id);
    if(obj)
    {
      obj.player1=data.player1;
      obj.player2=data.player2;
      if(obj.defend=='player2')
        obj.defend='player1'
      else 
        obj.defend='player2';
      obj.attacker=[];
      obj.defender=[];

      //console.log("reset data is : ",obj);
      io.to(data.duel_id).emit('resetted',{data:obj});
    }
  })

  socket.on('lostduel',async(data)=>
  {
    socket.broadcast.to(data.duel_id).emit('iwon');//This signifies opponennt won
    var mongoid=socket.handshake.query['foo'];
    await User.findByIdAndUpdate(ObjectId(mongoid),{
      Ongoing_DragonBall_Deck:[],
      Ongoing_Naruto_Deck:[],
      OngoingTournament:false,
      Ongoing_Tournament_id:"",
      Account_Balance:0,
      Ongoing_Duel_id:""
    })

   
    var duelarray=getdragonballduelarray();
    duelarray=duelarray.filter((duelobj)=>duelobj.duel_id!==data.duel_id);
    updatedragonballduelarray(duelarray);

    console.log("Now the duel array is after duel completion : ",getdragonballduelarray());

    
  })
  //=========================================
  

  socket.on("disconnect",()=>
  {
    console.log("Disconnected",socket.handshake.query['foo']);
  })

  //Needs to be refactored !!
  /*socket.on('unfortunatedisconnect',async ()=>
  {
      var user=removeuser(socket.id);
      if(user)
      {
        console.log(`${user.name} with socketid ${user.socketid} disconnected`);
        user.rooms.map(async (room)=>
        {
          await destroyauction(room);
          io.to(room).emit("unfortunatedisconnectmessage",{data:`${user.name} got Disconnected :( hence the tournament is cancelled!`})
        })
      }
     
  })*/

})


if(process.env.NODE_ENV==="production")
{
    app.use(express.static("client/build"));
    app.get("*",function(req,res)
    {
        res.sendFile(path.resolve(__dirname,"client","build","index.html"));
    });
}

