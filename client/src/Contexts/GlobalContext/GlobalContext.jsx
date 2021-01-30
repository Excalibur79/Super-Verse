import React,{useState,createContext} from "react";

export const GlobalContext=createContext();

export const GlobalProvider=(props)=>
{
    const [UserToken,setUserToken]=useState(null);
    const [User,setUser]=useState(null)
    const [Auth,setAuth]=useState(null);
    const [Tournament,setTournament]=useState(null);
    const [MySocket,setMySocket]=useState(null);

    const ChangeToken=(token)=>
    {
        setUserToken(token);
    }

    const ChangeUser=(user)=>
    {
        setUser(user);
    }

    const ChangeAuth=(auth)=>
    {
        setAuth(auth)
    }

    const ChangeTournament=(x)=>
    {
        setTournament(x)
    }
    const ChangeMySocket=(x)=>
    {
        setMySocket(x);
    }
    return (
        <GlobalContext.Provider
            value={
                {
                    User:User,
                    ChangeUser:ChangeUser,
                    UserToken:UserToken,
                    ChangeToken:ChangeToken,
                    Auth:Auth,
                    ChangeAuth:ChangeAuth,
                    Tournament:Tournament,
                    ChangeTournament:ChangeTournament,
                    MySocket:MySocket,
                    ChangeMySocket:ChangeMySocket
                }
            }
        >
            {props.children}
        </GlobalContext.Provider>
    )
}