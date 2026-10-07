import React, { useState, useEffect } from "react"; // Need useEffect
import { toast } from "react-toastify";
import { signOut, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { HiThumbUp, HiOutlineKey, HiOutlineLogout, HiOutlineDownload, HiOutlineTrash } from "react-icons/hi";
import { useAuth } from "./AuthContext.jsx";
import { db } from '../utils/firebase.js'; // Or './firebase', be consistent!
import { doc, getDoc, setDoc, getDocs, deleteDoc, collection, query, where } from 'firebase/firestore';
import { auth } from "../utils/firebase.js"; // Or '../firebase', be consistent!

// Firebase only lets an account be deleted shortly after signing in
const RECENT_LOGIN_MS = 5 * 60 * 1000;

const appliedJobsQuery = (uid) => query(collection(db, "appliedJobs"), where("userId", "==", uid));

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

    // Right of access / portability: everything we hold about the user, as JSON
    const downloadData = async () => {
        try {
            const [profileSnap, jobsSnap] = await Promise.all([
                getDoc(doc(db, "users", user.uid)),
                getDocs(appliedJobsQuery(user.uid)),
            ]);
            const profile = profileSnap.data() || {};
            if (profile.consent?.acceptedAt?.toDate) {
                profile.consent = { ...profile.consent, acceptedAt: profile.consent.acceptedAt.toDate().toISOString() };
            }
            const data = {
                exportedAt: new Date().toISOString(),
                account: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    signInMethods: user.providerData.map(p => p.providerId),
                    createdAt: user.metadata.creationTime,
                    lastSignIn: user.metadata.lastSignInTime,
                },
                profile,
                appliedJobs: jobsSnap.docs.map(d => {
                    const job = d.data();
                    return { ...job, appliedAt: job.appliedAt?.toDate ? job.appliedAt.toDate().toISOString() : job.appliedAt };
                }),
            };
            const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
            const a = document.createElement("a");
            a.href = url;
            a.download = "job-swipr-my-data.json";
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error exporting data:", err);
            toast.error("Couldn't download your data. Please try again.");
        }
    };

    // Right to erasure: saved jobs, profile, then the login itself
    const deleteAccount = async () => {
        const lastSignIn = new Date(user.metadata.lastSignInTime).getTime();
        if (Date.now() - lastSignIn > RECENT_LOGIN_MS) {
            toast.info("For your security, please log out, sign in again, then delete your account.");
            return;
        }
        if (!window.confirm("Delete your account and all saved jobs? This can't be undone.")) return;
        try {
            const jobsSnap = await getDocs(appliedJobsQuery(user.uid));
            await Promise.all(jobsSnap.docs.map(d => deleteDoc(d.ref)));
            await deleteDoc(doc(db, "users", user.uid));
            await deleteUser(auth.currentUser);
            toast.success("Your account and data have been deleted.");
            navigate('/home');
        } catch (err) {
            console.error("Error deleting account:", err);
            toast.error(err.code === "auth/requires-recent-login"
                ? "Please log out, sign in again, then delete your account."
                : "Couldn't delete your account. Please try again or contact us.");
        }
    };

    return (
        <>
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-ink">Profile</h2> {/* Capitalized 'Profile' */}
                <p className="mt-1 text-sm text-muted">View and update your profile details here.</p> {/* More descriptive */}
            </div>
            <div className="grid gap-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
                <section className="glass flex flex-col items-center p-6 text-center">
                    <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-brand text-3xl font-bold uppercase text-white">
                        {(user?.displayName || user?.email || '?')[0]}
                    </div>
                    {user?.displayName && <p className="text-lg font-semibold text-ink">{user.displayName}</p>}
                    <h3 className={`max-w-full break-all ${user?.displayName ? 'text-sm text-muted' : 'font-semibold text-ink'}`}>{user ? user.email : 'Not logged in'}</h3> {/* Capitalized 'Not logged in' */}
                    {userStatus && <p className="mt-1 text-sm text-muted">{userStatus}</p>}
                    {/* Only show reset password if user is logged in */}
                    {user && (
                        <button
                            onClick={resetPassword}
                            className="btn-secondary mt-6"
                        >
                            <HiOutlineKey size={16}/>
                            Reset Password
                        </button>
                    )}
                    {/* Only show logout button if user is logged in */}
                    {user && (
                        <button
                            className="btn-danger mt-3 w-full"
                            onClick={logOut}
                        >
                            <HiOutlineLogout size={16}/>
                            Logout
                        </button>
                    )}
                </section>
                <section className="glass p-6">
                    <h4 className="text-lg font-semibold text-ink">Your Status</h4> {/* Clearer heading */}
                    <p className="text-sm text-muted">Let people know what you're looking for.</p>
                    <article className="mt-5 flex flex-col">
                        {user ? (
                            <>
                                {/* Display fetched status if available */}
                                <p className="rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink-soft">{userStatus ? `Status: ${userStatus}` : 'No status set yet.'}</p>

                                {/* Form to update status */}
                                <form onSubmit={saveUserStatus} className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        name="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)} // Use onChange for input updates
                                        placeholder="Enter your status"
                                        className="field-input"
                                    />
                                    <button
                                        type="submit" // Use type="submit" for form button
                                        className="btn-primary !w-auto shrink-0"
                                        disabled={!status.trim()} // Disable button if status is empty
                                        aria-label="Save status"
                                    >
                                        <HiThumbUp size={18}/>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <p className="text-sm text-muted">Log in to set your status.</p> // Message when not logged in
                        )}
                    </article>
                </section>
                {user && (
                    <section className="glass p-6 md:col-span-2">
                        <h4 className="text-lg font-semibold text-ink">Your data</h4>
                        <p className="text-sm text-muted">
                            Download a copy of everything we hold about you, or permanently delete your account and saved jobs.
                            See our <Link to="/privacy" className="font-medium text-brand hover:text-brand-hover">Privacy Policy</Link> for your other rights.
                        </p>
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <button className="btn-secondary sm:!w-auto" onClick={downloadData}>
                                <HiOutlineDownload size={16}/>
                                Download my data
                            </button>
                            <button className="btn-danger" onClick={deleteAccount}>
                                <HiOutlineTrash size={16}/>
                                Delete my account
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default UserDetails;
