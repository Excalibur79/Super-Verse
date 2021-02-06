var mongoose = require("mongoose");

var narutotournamentschema=new mongoose.Schema(
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
            ref:"Naruto_Duel"
        }
    ],
    ongoing:Boolean


});

module.exports=mongoose.model("Naruto_Tournament",narutotournamentschema);