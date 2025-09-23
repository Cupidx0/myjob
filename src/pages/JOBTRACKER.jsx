import React,{ useState, useEffect } from "react";
import { collection, query, where, getDocs,doc,deleteDoc } from "firebase/firestore";
import { db } from '../utils/firebase';  // Ensure Firestore is imported
import { useAuth } from './AuthContext';  // Assuming you're using this hook for auth
import { toast } from "react-toastify";
import '../index.css';
const JobTracker = () => {
  const {user} = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user || !user.uid) return;  // If user is not authenticated, don't fetch data

      const q = query(
        collection(db, "appliedJobs"),
        where("userId", "==", user.uid)
      );

      try {
        const querySnapshot = await getDocs(q);
        const jobs = querySnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        setAppliedJobs(jobs);  // Set jobs into state
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [user]);  // Re-run this effect when user changes
const deleteDocField = async(jobId) => {
  const docRef = doc(db,'appliedJobs',jobId);
  try{
    await deleteDoc(docRef);
    console.log('job deleted successfully.');
    toast.success('job deleted successfully.');
    setAppliedJobs(prev => prev.filter(job => job.id !== jobId));
  }catch(err){
    console.error('error deleting job',err);
    toast.error('error deleting job');
  }
};
  return (
    <div>
      <h2 className="max-w-sm text-2xl text-left font-bold mb-4 text-blue-500">Applied Jobs</h2>
      <section className="m-4 h-screen !overflow-auto">
        <ul className="mb-[500px]">
          {appliedJobs.length === 0 ? (
            <li className="text-center text-gray-500">No jobs applied yet.</li>
          ) : (
            appliedJobs.map((newCard, idx) => (
              <li key={idx} className="flex items-center gap-2 cursor-pointer transition-transform hover:text-blue-500 rounded-md border border-gray-200 mb-4">
                <h3 className="mt-1 font-bold" onClick={()=>window.open(newCard.link)}>{newCard.title} <br /> {newCard.company}</h3>
                <p onClick={()=>window.open(newCard.link)}>location:{newCard.location}<br/>applied at:{newCard.appliedAt}</p>
                <button
                onClick={()=>deleteDocField(newCard.id)}
                className="text-red-500 hover:underline mt-2">Remove Job</button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

export default JobTracker;

