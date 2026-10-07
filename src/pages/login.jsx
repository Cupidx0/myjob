import React, {useState } from "react";
import { Link , useNavigate, useLocation} from "react-router-dom";
import {toast} from 'react-toastify';
import { auth } from "../utils/firebase";
import { GoogleIcon } from "../components/customIcons";
import { FaGithub } from "react-icons/fa";
import { signInWithEmailAndPassword,GoogleAuthProvider,GithubAuthProvider,signInWithPopup,sendPasswordResetEmail } from "firebase/auth";
//import { auth } from "./firebase";
//import { createUserWithEmailAndPassword } from "firebase/auth";
import '../index.css';
//import { useState } from "react";
export const Login = ()=> {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    // send users back to the protected page they were redirected from
    const redirectTo = location.state?.from || '/home';
  const handleLogin = async(e)=> {
    e.preventDefault();
    if(!email||!password){
      setError('please input the details above !');
      toast.error('fill the input to login.');
      return;
    }
    setError(''); 
    await loggedIn();
  }
  const loggedIn = async()=>{
    try{
      await signInWithEmailAndPassword(auth, email, password);
      //console.log ('logging in :',result.user.email);
      toast.success('login sucessful');
      navigate(redirectTo, { replace: true });
    }catch (err){
      console.error(err);
      toast.error(err.message);
    }
  }
  const googleUp = async()=>{
    const provider = new GoogleAuthProvider();
    try{
      await signInWithPopup(auth,provider);
      //console.log('user logged in :',userGoogleCredential.user);
      toast.success('login successful');
      navigate(redirectTo, { replace: true });
    }catch(err){
      console.error(err);
      toast.error(err.message);
    }
  }
  const githubUp = async()=>{
    const githubProvider = new GithubAuthProvider();
    try{
      await signInWithPopup(auth,githubProvider);
      //console.log('user logged in :',userGithubCredential.user);
      toast.success('login successful');
      navigate(redirectTo, { replace: true });
    }catch(err){
      console.error(err);
      toast.error(err.message);
    }
  }
  const forgotPassword = async()=>{
    if(!email){
      setError('Enter your email above, then click "Forgot password?" again.');
      toast.error('Enter your email first.');
      return;
    }
    setError('');
    try{
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link sent to your email.');
    }catch(err){
      console.error(err);
      toast.error(err.message);
    }
  }
  return (
    <div className="mx-auto w-full max-w-md">
    <div className="glass p-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Log in to keep swiping on your next role.</p>
      </div>
      <form className="space-y-4" onSubmit={handleLogin}>
        <label className="block">
          <span className="field-label">Email</span>
          <input type="mail"
           name="Email"
           placeholder="you@example.com"
           value={email}
           onChange={(e)=>setEmail(e.target.value)}
           className="field-input"
            />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-ink-soft">Password</span>
            <button type="button" onClick={forgotPassword} className="text-xs font-medium text-brand hover:text-brand-hover">Forgot password?</button>
          </span>
          <input type="password"
           name="password"
           placeholder="••••••••"
           value={password}
           onChange={(e)=>setPassword(e.target.value)}
           className="field-input"
            />
        </label>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <button 
            type="submit"
            className="btn-primary !mt-6">
            {/* <Link to="/home">*/}Login{/*</Link>*/}
        </button>
        <div className="flex items-center gap-3 py-1 text-xs uppercase tracking-wider text-subtle">
          <span className="h-px flex-1 bg-line"/>or<span className="h-px flex-1 bg-line"/>
        </div>
        <button 
          type="button"
          onClick={googleUp}
          className="btn-secondary"
        ><GoogleIcon className='mr-2'/>Sign In With Google</button>
        <button 
          type="button"
          onClick={githubUp}
          className="btn-secondary"
        ><FaGithub size={20}/>Sign In With Github</button>
        <p className="pt-2 text-sm text-center text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-brand hover:text-brand-hover">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
    </div>
  );
}
export default Login;
