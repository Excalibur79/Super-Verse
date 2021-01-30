var mongoose =require("mongoose");

var userschema=new mongoose.Schema(
    {
        Name:String,
        uid:String,
        avatar:String,
        email:String,
        tier:Number,
        OngoingTournament:Boolean,
        Ongoing_Tournament_id:String,
        Ongoing_Duel_id:String,
        Ongoing_DragonBall_Deck:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"DragonBall_Character"
            }
        ],
        Ongoing_Naruto_Deck:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Naruto_Character"
            }
        ],
        Focus_Points:Number,
        Account_Balance:Number
    }
)

module.exports=mongoose.model("User",userschema);