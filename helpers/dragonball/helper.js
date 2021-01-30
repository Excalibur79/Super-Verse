const user = require("../../Models/user/user");

var auctionarray=[];
var duelarray=[];


const getauctionarray=()=>
{
    return auctionarray;
}


const updateauctionarray=(newarray)=>
{
    auctionarray=newarray;
}

const auctionobjpresent=(auctionid)=>
{
    var obj=auctionarray.find((obj)=>obj.auction_id===auctionid);
    return obj?obj:null;
}


const getdragonballduelarray=()=>
{
    return duelarray;
}

const updatedragonballduelarray=(array)=>
{
    duelarray=array;
}

const dragonballduelobjpresent=(duelid)=>
{
    var obj=duelarray.find((duel)=>duel.duel_id==duelid);
    return obj?obj:null;
}


module.exports={
    auctionobjpresent,
    getauctionarray,
    updateauctionarray

    ,
    getdragonballduelarray,
    dragonballduelobjpresent,
    updatedragonballduelarray
};