import React,{useState,useEffect,useContext} from "react";
import firebase from "../../Firebase_Config";
import axios from "axios";
import backend_url from "../../backend_url";
import {GlobalContext} from "../../Contexts/GlobalContext/GlobalContext";
import googlelogo from "../../assets/icons/google_logo.png";
import Dbs from "../../assets/icons/goku_vegeta.png";
import naru from "../../assets/icons/naruto_sasuke.png";

import "./UserConfig.scss";

const UserConfig =(props)=>
{
    const [UserToken,setUserToken]=useState(null);
    const [User,setUser]=useState(null);
    

    const auth=firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    const {ChangeUser,ChangeToken,ChangeAuth}=useContext(GlobalContext);


    //Setting Default Axios Header
    const setAxiosAuthHeader = (token) => {
        if (token) {
          axios.defaults.headers.common['Authorization'] = token;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
      };
    //---------------------------
    const handleGoogleSignIn=()=>
    {
        auth.signInWithPopup(provider)
            .then(
                (data)=>{
                   data.user.getIdToken().then((token)=>
                   {
                      
                       
                       setUserToken(`Bearer ${token}`);
                       
                       
                   })
                }
            )
    }

   useEffect(()=>
   {

        //Audio play
        const audio=document.getElementById("audio");
        audio.play();
        //----------
      auth.onAuthStateChanged((user)=>
      {
          if(user)
            {
                console.log(user);
                user.getIdToken().then((token)=>
                {
                    setUserToken(`Bearer ${token}`);
                   
                   
                })
            }
      })
   },[])

   useEffect(()=>
   {    
    setAxiosAuthHeader(UserToken);
    if(UserToken)
    {
        axios({
            method:"POST",
            url:`${backend_url}/createorjoinuser`
        }).then((data)=>{
             console.log(data);
             setUser(data.data);
        }).catch((err)=>
        {
             console.log(err);
        })
    }
   },[UserToken])


   useEffect(()=>
   {
        if(User)
        {
            ChangeToken(UserToken);
            ChangeUser(User);
            ChangeAuth(auth)
            //push to some another route
            props.history.push("/gameverse")
        }
   },[User])
    return(
        <div className="UserConfig">
            <div className="UserConfig__form blurred-box">
               <div className="UserConfig__Title"><span className="Super">Super</span><span className="Verse"> Verse</span></div>
                <div className="UserConfig__About">Dive Into The DragonBall and Naruto Verse</div>
                <div className="UserConfig__Dual_Images">
                    <img src={Dbs}/>
                    <img src={naru}/>
                </div>
                <div className="UserConfig__GoogleButton" onClick={handleGoogleSignIn}>
                    <div>Join through Google</div>
                    <div>
                         <img src={googlelogo}/>
                    </div> 
                </div>
            </div>

            <div className="Creator_Ankur_Saha">Made with ❤ By ANKUR SAHA</div>
            
           {User && <h1>{User.Name}</h1>}
          
           <audio src="https://res.cloudinary.com/drolmjcot/video/upload/v1610367006/audio/bluebird_juhczs.mp3" id="audio" preload="metadata" type="audio/mpeg" loop></audio>
        </div>
    )
}

export default UserConfig;