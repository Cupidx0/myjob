import React, { useRef, useEffect} from 'react'
import {HiMenu} from 'react-icons/hi';
import {HiX} from 'react-icons/hi';
import {AiFillHome} from 'react-icons/ai';
import {CgProfile} from 'react-icons/cg';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import '../index.css';
function Header({isOpen, setIsOpen}){
        const navRef = useRef();
        const { isLoggedIn, user } = useAuth();
        useEffect(() => {
            function handleClick(event){
                if(navRef.current && !navRef.current.contains(event.target)){
                    setIsOpen(false);
                }
            }
            if(isOpen){
                document.addEventListener('mousedown', handleClick);
            }
            return ()=>{
                document.removeEventListener('mousedown', handleClick);
            }
    },[isOpen, setIsOpen]);
    return(
        <header>
            <div className="content">
                <h2 className='text-2xl font-bold'><Link to = "/home" className='text-1xl font-bold flex items-center gap-1 transition-transform hover:scale-105 hover:text-blue-400'>Job Swipr</Link>
                </h2>
                {isLoggedIn ? (
                    <p className='text-md font-small border border-gray-200 rounded-md p-1 items-center text-center mt-4 ml-10 text-blue-500'>Welcome, {user?.email}</p>
                ) : (
                    <p className='text-md font-small'>Please sign in</p>
                )}
                <h2 id="burg">
                    <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <HiX size={30}/>:<HiMenu size={30}/>}
                    </button>
                    {isOpen&&(
                        <nav id='nav'
                             ref = {navRef}
                             className="absolute top-16 right-0 bg-white border border-gray-300 shadow-lg p-2 z-50 animateRight"
                            >
                                <ul className='gap-4 top-30 right-0 flex flex-col'>
                                    <li><Link to = "/home" onClick={()=> setIsOpen(false)}><AiFillHome/></Link></li>
                                    <li><Link to = "/user" onClick={()=>setIsOpen(false)}><CgProfile/></Link></li>
                                    <li><Link to = "/login" onClick={()=> setIsOpen(false)}>Login</Link></li>
                                    <li><Link to = "/Jobtracker" onClick={()=> setIsOpen(false)}>Applied Jobs</Link></li>
                                    <li><a href="/contact" onClick={()=> setIsOpen(false)}>Contact</a></li>
                                </ul>
                        </nav>
                )}
                </h2>
            </div>
        </header>   
    )
}
export default Header;