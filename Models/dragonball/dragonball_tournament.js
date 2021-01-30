var mongoose = require("mongoose");

var dbtournamentschema=new mongoose.Schema(
{
   
    type:Number,
    winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    auction:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    duels:[
       {
            type:mongoose.Schema.Types.ObjectId,
            ref:"DragonBall_Duel"
        }
    ],
    ongoing:Boolean


});

module.exports=mongoose.model("DragonBall_Tournament",dbtournamentschema);