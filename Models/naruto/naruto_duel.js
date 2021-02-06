var mongoose = require("mongoose");

var Naruto_DuelSchema=new mongoose.Schema(
    {
      
        winner:
        {
            name:String,
            mongoid:String,
            uid:String,
            avatar:String
        },
        player1:
        {
            name:String,
            mongoid:String,
            uid:String,
            avatar:String,
            occupied:Boolean

        },
        player2:
        {
            name:String,
            mongoid:String,
            uid:String,
            avatar:String,
            occupied:Boolean
           
        },
        final_match:Boolean
    }
)
module.exports = mongoose.model("Naruto_Duel",Naruto_DuelSchema);