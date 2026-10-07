import React from "react";
import { Link } from "react-router-dom";
function Four(){
    return(
        <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
            <h2 className="gradient-text text-8xl font-extrabold tracking-tighter sm:text-9xl">404</h2>
            <div>
                <p className="text-xl font-semibold text-white">Page not found</p>
                <p className="mt-1 text-sm text-slate-400">The page you're looking for doesn't exist or has moved.</p>
            </div>
            <Link to = "/home" className="btn-primary !w-auto px-6">Go back home</Link>
        </div>
    )
}
export default Four;
