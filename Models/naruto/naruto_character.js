var mongoose = require("mongoose");

var Naruto_CharacterSchema=new mongoose.Schema(
    {
        name:String,
        url:String,
        dp:String,
        theme:String,
        attack:Number,
        defence:Number,
        health:Number,
        total_health:Number,
        base_price:Number,
        transformable:Boolean,
        next_character:String
    }
)
module.exports = mongoose.model("Naruto_Character",Naruto_CharacterSchema);