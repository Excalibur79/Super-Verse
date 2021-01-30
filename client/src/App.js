import React,{useState,useEffect} from "react";
import {Route,Switch,Link} from "react-router-dom";
import "./App.css";
import Loader from "./Components/Loader/Loader";

import UserConfig from "./pages/UserConfig/UserConfig";
import GameVerseSelector from "./pages/GameVerseSelector/GameVerseSelector";

//Dragon Ball======
import DragonBallAuction from "./DragonBall/Auction/DragonBallAuction";
import DragonBallDuel from "./DragonBall/Duel/Duel";
//===================

import {GlobalProvider} from "./Contexts/GlobalContext/GlobalContext";
const App=()=> 
{
  
 

 
  return (
    <div className="App">
     
      <Switch>
          <GlobalProvider>
              <Route exact path="/" render={(routeProps)=><UserConfig {...routeProps}/>}/>
              <Route exact path="/gameverse" render={(routeProps)=><GameVerseSelector {...routeProps}/>}/>
             {/*Dragon Ball Routes*/}
              <Route exact path="/dragonball/auction" render={(routeProps)=><DragonBallAuction {...routeProps}/>}/>
              <Route exact path ="/dragonball/duel" render={(routeProps)=><DragonBallDuel {...routeProps}/>}/>
             {/*------------------*/}
          </GlobalProvider>
          
      </Switch>
     
    </div>
  );
}

export default App;
