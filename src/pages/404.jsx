import React from "react";
import { Link } from "react-router-dom";
function Four(){
    return(
        <div className="flex flex-col items-center justify-center gap-10 bg-black-100">
            <h2 className="text-red-500">
                <img src="https://www.1stopdesign.com/wp-content/uploads/2024/04/1_hFwwQAW45673VGKrMPE2qQ.png"></img>
            </h2>
            <button className="max-w-[180px] h-[43px] bg-black text-white rounded-md transition-transform hover:scale-105 hover:bg-black-300">
                <Link to = "/home" className="w-full h-full block font-bold text-center">Go back home</Link>
            </button>
        </div>
    )
}
export default Four;