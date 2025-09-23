import React, { useState, useEffect } from "react"; // Need useEffect
import { toast } from "react-toastify";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { HiThumbUp } from "react-icons/hi";
import { useAuth } from "./AuthContext.jsx";
import { db } from '../utils/firebase.js'; // Or './firebase', be consistent!
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Need doc, getDoc, setDoc
import { auth } from "../utils/firebase.js"; // Or '../firebase', be consistent!

export const UserDetails = () => {
    const [status, setStatus] = useState(''); // State for the input field
    const [userStatus, setUserStatus] = useState(null); // State to hold the FETCHED user status
    const navigate = useNavigate();
    const {user} = useAuth(); // This gives the user state *when the component renders*

    useEffect(() => {
        const fetchUserStatus = async () => {
            if (user) {
                try {
                    const userDocRef = doc(db,"users", user.uid); // Reference the user's document
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        // Document exists, get the status
                        setUserStatus(userDocSnap.data().status || null); // Get 'status' field, default to null if not found
                        // You might also want to set the input field state if they can edit it
                        setStatus(userDocSnap.data().status || '');
                    } else {
                        // No document for this user yet
                        setUserStatus(null);
                        setStatus('');
                    }
                } catch (error) {
                    console.error("Error fetching user status:", error);
                    toast.error("Failed to load user status.");
                }
            } else {
                // User logged out
                setUserStatus(null);
                setStatus('');
            }
        };

        fetchUserStatus();

        // Cleanup function if you were using an onSnapshot listener
        // return () => unsubscribe();

    }, [user]); // Rerun this effect when the 'user' object changes

    // Function to save the status to Firestore
    const saveUserStatus = async (e) => {
        e.preventDefault(); // Prevent default form submission if used in a form
        if (!user || !user.uid) {
            toast.error("You must be logged in to update status.");
            return;
        }

        try {
            const userDocRef = doc(db, "users", user.uid);
            // Use setDoc to create or overwrite the document for this user
            // Using merge: true is often good so you don't delete other fields
            await setDoc(userDocRef, { status: status }, { merge: true });
            setUserStatus(status); // Update the displayed status state
            toast.success("Status updated successfully!");
        } catch (error) {
            console.error("Error saving user status:", error);
            toast.error("Failed to update status. Try again.");
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            toast.success("Signout successful!");
            navigate('/home'); // Redirect after signout
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    const resetPassword = async () => {
        if (user && user.email) {
            try {
                await sendPasswordResetEmail(auth, user.email);
                toast.success('Password reset link sent to your email.');
            } catch (err) {
                console.error(err.message);
                toast.error(err.message);
            }
        } else {
            // User might not be logged in or email is missing
            toast.error("Please log in to reset your password.");
        }
    };

    return (
        <>
            <div className="top-0 m-4">
                <h2 className="text-2xl font-bold">Profile</h2> {/* Capitalized 'Profile' */}
                <p>View and update your profile details here.</p> {/* More descriptive */}
            </div>
            <div className="flex flex-col md:flex-row gap-3">
                <section className="flex flex-col items-center p-4 border border-gray-400 bg-gray-900 rounded-md max-w-[250px] max-h-[400px] ml-4 cursor-grab transition-transform duration-300 overflow-scroll ease-in-out"> {/* Removed justify-center - email might be long */}
                    <h3>{user ? user.email : 'Not logged in'}</h3> {/* Capitalized 'Not logged in' */}
                    {/* Only show reset password if user is logged in */}
                    {user && (
                        <button
                            onClick={resetPassword}
                            className="mt-2 p-1 text-sm bg-blue-500 hover:bg-blue-400 rounded-md" // Added some styling
                        >
                            Reset Password
                        </button>
                    )}
                </section>
                <section className="flex flex-col items-center justify-start p-4 border border-gray-400 bg-gray-900 rounded-md max-w-[350px] max-h-[400px] cursor-grab transition-transform duration-300 overflow-scroll ease-in-out">
                    <h4 className="mb-2">Your Status</h4> {/* Clearer heading */}
                    <article className="flex flex-col">
                        {user ? (
                            <>
                                {/* Display fetched status if available */}
                                <p>{userStatus ? `Status: ${userStatus}` : 'No status set yet.'}</p>

                                {/* Form to update status */}
                                <form onSubmit={saveUserStatus} className="mt-4">
                                    <input
                                        type="text"
                                        name="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)} // Use onChange for input updates
                                        placeholder="Enter your status"
                                        className="p-1 rounded mr-2 text-black" // Added styling for visibility
                                    />
                                    <button
                                        type="submit" // Use type="submit" for form button
                                        className="bg-transparent text-green-600 text-2xl" // Adjusted size
                                        disabled={!status.trim()} // Disable button if status is empty
                                    >
                                        <HiThumbUp />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <p>Log in to set your status.</p> // Message when not logged in
                        )}
                    </article>
                    {/* <h4>Bio and other details</h4> */} {/* Removed or clarify what this section is for */}
                </section>
            </div>
            {/* Only show logout button if user is logged in */}
            {user && (
                <button
                    className="m-6 rounded-md p-1 text-md cursor-pointer bg-red-500 hover:bg-red-400"
                    onClick={logOut}
                >
                    Logout
                </button>
            )}
        </>
    );
};

export default UserDetails;
