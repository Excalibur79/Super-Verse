import React from "react";
import "./Loader.scss";
import loader from "./loader.gif";

const Loader =({data})=>
{

    return(
        <div className="Loader">
            <div>
                {data}
            </div>
            <div>
                <img src={loader}/>
            </div>
        </div>
    )
}
export default Loader;