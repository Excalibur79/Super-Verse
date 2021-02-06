const user = require("../../Models/user/user");

var narutoauctionarray=[];
var narutoduelarray=[];


const getnarutoauctionarray=()=>
{
    return narutoauctionarray;
}


const updatenarutoauctionarray=(newarray)=>
{
   narutoauctionarray=newarray;
}

const narutoauctionobjpresent=(auctionid)=>
{
    var obj=narutoauctionarray.find((obj)=>obj.auction_id===auctionid);
    return obj?obj:null;
}


const getnarutoduelarray=()=>
{
    return narutoduelarray;
}

const updatenarutoduelarray=(array)=>
{
    narutoduelarray=array;
}

const narutoduelobjpresent=(duelid)=>
{
    var obj=narutoduelarray.find((duel)=>duel.duel_id==duelid);
    return obj?obj:null;
}


module.exports={
    narutoauctionobjpresent,
    getnarutoauctionarray,
    updatenarutoauctionarray

    ,
    getnarutoduelarray,
   narutoduelobjpresent,
    updatenarutoduelarray
};