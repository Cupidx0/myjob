import React, {useState} from 'react';
import '../index.css';
import {toast} from 'react-toastify';
//import { FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db} from '../utils/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { GoogleIcon } from '../components/customIcons';
import { FaGithub } from 'react-icons/fa';
import { GoogleAuthProvider,GithubAuthProvider,createUserWithEmailAndPassword,signInWithPopup,updateProfile} from 'firebase/auth';
export const SignUp =()=>{
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleSignup = async(e)=>{
      e.preventDefault();
      if(!firstName||!lastName||!email||!password||!confirmPassword){
        setError("please fill in your details !");
        toast.error('please fill in your details!');
        return;
      }else if(password != confirmPassword){
        setError("passwords does not match!");
        toast.error('passwords does not match!');
        return;
      }
      setError("");
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        // save the name; a failure here shouldn't undo the signup
        try {
          await updateProfile(newUser, { displayName: `${firstName} ${lastName}`.trim() });
          await setDoc(doc(db, "users", newUser.uid), { firstName, lastName, email: newUser.email }, { merge: true });
        } catch (profileErr) {
          console.error("Error saving profile:", profileErr);
        }
        toast.success("Signup successful!");
        navigate('/home');
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    const googleUp = async()=>{
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth,provider);
        toast.success("Signup successful!");
        navigate('/home');
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    const githubUp = async()=>{
      const githubProvider = new GithubAuthProvider();
      try{
        await signInWithPopup(auth,githubProvider);
        toast.success("Signup successful!");
        navigate('/home');
      }catch (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // You might also get email or credential depending on the error
        const email = error.email; // For account-exists-with-different-credential
    
        // Check if the error is the specific account-exists-with-different-credential error
        if (errorCode === 'auth/account-exists-with-different-credential') {
          console.warn('Account exists with a different credential:', email);
          //console.log('Pending GitHub credential:', credential);
          toast.error(`An account with this email already exists. Please sign in with your existing method to link your GitHub account.`);
    
          // Important: Do NOT navigate away or proceed as if the user is signed in
          // until the linking process (steps B and C above) is complete.
    
        } else {
          // Handle other errors (network issues, incorrect credentials for a new account, etc.)
          console.error("Authentication Error:", error);
          toast.error(errorMessage); // Show the generic error message for other errors
        }
      }
    }
    return(
        <div className="mx-auto w-full max-w-md">
        <div className="glass p-8 text-white">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Create An Account</h2>
        <p className="mt-1 text-sm text-slate-400">Start swiping and tracking applications in minutes.</p>
      </div>
      <form  className="space-y-4 bg-transparent" onSubmit={handleSignup}>
        <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor='firstname' className="field-label">First Name</label>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value = {firstName}
            onChange ={(e)=> setFirstName(e.target.value)}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor='lastname' className="field-label">Last Name</label>
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value = {lastName}
            onChange = {(e)=> setLastName(e.target.value)}
            className="field-input"
          />
        </div>
        </div>
        <div>
          <label htmlFor='email' className="field-label">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value = {email}
            onChange = {(e)=>setEmail(e.target.value)}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor='password' className="field-label">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value = {password}
            onChange = {(e)=>setPassword(e.target.value)}
            className="field-input"
          />
        </div>
        <div>
          <label htmlFor='confirmpassword' className="field-label">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value = {confirmPassword}
            onChange = {(e)=>setConfirmPassword(e.target.value)}
            className="field-input"
          />
        </div>
        {error && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
        <div className='space-y-3 pt-2 text-center'>
          <button
            type="submit"
            className="btn-primary"
          >
            Sign Up
          </button>
          <div className="flex items-center gap-3 py-1 text-xs uppercase tracking-wider text-slate-500">
            <span className="h-px flex-1 bg-white/10"/>or<span className="h-px flex-1 bg-white/10"/>
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
          <p className="pt-2 text-sm text-center text-slate-400">
          Already have an account?{' '}
          <Link to ="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
            Log In
          </Link>
        </p>
        </div>
      </form>
    </div>
    </div>
    )
}
export default SignUp
