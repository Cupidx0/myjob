import React, { useRef, useEffect} from 'react'
import {HiMenu} from 'react-icons/hi';
import {HiX} from 'react-icons/hi';
import {AiFillHome} from 'react-icons/ai';
import {CgProfile} from 'react-icons/cg';
import {HiOutlineBriefcase, HiOutlineLogin, HiOutlineMail} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import '../index.css';
function Header({isOpen, setIsOpen}){
        const navRef = useRef();
        const { isLoggedIn, user, authLoading } = useAuth();
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
    const navItem = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white";
    return(
        <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0b0d14]/70 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link to = "/home" className='group flex items-center gap-2.5'>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition group-hover:scale-105">
                        <HiOutlineBriefcase size={20}/>
                    </span>
                    <span className="text-lg font-bold tracking-tight text-white">Job <span className="gradient-text">Swipr</span></span>
                </Link>
                <div className="flex items-center gap-3">
                    {authLoading ? null : isLoggedIn ? (
                        <p className='hidden max-w-[16rem] items-center gap-2 truncate rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 text-sm text-slate-300 sm:flex'>
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-500/20 text-xs font-semibold uppercase text-indigo-200">{user?.email?.[0]}</span>
                            <span className="truncate">{user?.email}</span>
                        </p>
                    ) : (
                        <p className='hidden text-sm text-slate-400 sm:block'>Please sign in</p>
                    )}
                    <div id="burg" className="relative" ref = {navRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08]"
                        >
                            {isOpen ? <HiX size={20}/>:<HiMenu size={20}/>}
                        </button>
                        {isOpen&&(
                            <nav id='nav'
                                 className="glass absolute right-0 top-12 z-50 w-56 !bg-[#131624]/95 p-2 animateRight"
                                >
                                    <ul className='flex flex-col gap-0.5'>
                                        <li><Link to = "/home" className={navItem} onClick={()=> setIsOpen(false)}><AiFillHome size={18}/>Home</Link></li>
                                        <li><Link to = "/user" className={navItem} onClick={()=>setIsOpen(false)}><CgProfile size={18}/>Profile</Link></li>
                                        {!isLoggedIn && <li><Link to = "/login" className={navItem} onClick={()=> setIsOpen(false)}><HiOutlineLogin size={18}/>Login</Link></li>}
                                        <li><Link to = "/Jobtracker" className={navItem} onClick={()=> setIsOpen(false)}><HiOutlineBriefcase size={18}/>Applied Jobs</Link></li>
                                        <li><Link to = "/contact" className={navItem} onClick={()=> setIsOpen(false)}><HiOutlineMail size={18}/>Contact</Link></li>
                                    </ul>
                            </nav>
                    )}
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header;
