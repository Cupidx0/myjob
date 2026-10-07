
import React from 'react';
import '../index.css';
import {FaFacebook} from 'react-icons/fa';
import {FaTwitter} from 'react-icons/fa';
import {FaInstagram} from 'react-icons/fa';
import { Link } from 'react-router-dom';
function Footer(){
    const date = new Date().getFullYear();
    const linkClass = "text-slate-400 transition hover:text-white";
    return (
    <footer className="mt-12 border-t border-white/[0.06] bg-black/20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
                <p className="text-base font-bold text-white">Job <span className="gradient-text">Swipr</span></p>
                <p className="mt-2 max-w-xs text-sm text-slate-400">Swipe through jobs, apply in a flick, and keep track of every application in one place.</p>
                <div className="mt-4 flex gap-3 text-slate-400">
                    <FaFacebook className="transition hover:text-white" size={18}/>
                    <FaTwitter className="transition hover:text-white" size={18}/>
                    <FaInstagram className="transition hover:text-white" size={18}/>
                </div>
            </div>
            {/* Column 1 */}
            <nav>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Explore</p>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/home" className={linkClass}>Home</Link></li>
                    <li><Link to="/jobtracker" className={linkClass}>Applied Jobs</Link></li>
                    <li><Link to="/user" className={linkClass}>Profile</Link></li>
                </ul>
            </nav>
            {/* Column 2 */}
            <nav>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Company</p>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className={linkClass}>About</Link></li>
                  <li><Link to="/contact" className={linkClass}>Contact</Link></li>
                  <li><Link to="/privacy" className={linkClass}>Privacy Policy</Link></li>
                </ul>
            </nav>
            {/* Column 3 */}
            <nav>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Support</p>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/terms" className={linkClass}>Terms</Link></li>
                  <li><Link to="/faq" className={linkClass}>FAQ</Link></li>
                  <li><Link to="/signup" className={linkClass}>Sign Up</Link></li>
                </ul>
            </nav>
        </div>
        {/* Copyright */}
        <div className="border-t border-white/[0.06] py-5 text-center text-xs text-slate-500">
            &copy; {date} Godwin Ltd. All rights reserved.
        </div>
    </footer>
    )
}
export default Footer
