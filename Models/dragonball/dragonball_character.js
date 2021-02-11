var mongoose = require("mongoose");

var DragonBall_CharacterSchema=new mongoose.Schema(
    {
        name:String,
        url:String,
        dp:String,
        theme:String,
        attack:Number,
        defence:Number,
        health:Number,
        total_health:Number,
        stamina:Number,
        stamina_threshold:Number,
        base_price:Number,
        transformable:Boolean,
        next_character:String
    }
)
module.exports = mongoose.model("DragonBall_Character",DragonBall_CharacterSchema);