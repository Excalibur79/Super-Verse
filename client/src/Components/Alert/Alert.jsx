import React,{useState,useEffect} from "react";
import "./Alert.scss";

const Alert =({alertdata,resetalert})=>
{
    const [classname,setclassname]=useState('Alert red animated');
    useEffect(()=>
    {
        setTimeout(()=>
        {
            resetalert();
        },3000)
    },[])

    useEffect(()=>
    {   
        if(alertdata.type=='red')
            setclassname('Alert red animated');
        if(alertdata.type=='green')
            setclassname('Alert green animated');
        if(alertdata.type=='yellow')
            setclassname('Alert yellow animated')
    },[alertdata])
   return(
       <div className={classname}>
           {alertdata.message}
       </div>
   )
}
export default Alert;