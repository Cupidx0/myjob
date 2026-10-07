import React,{ useState, useEffect } from "react";
import { collection, query, where, getDocs,doc,deleteDoc,updateDoc } from "firebase/firestore";
import { db } from '../utils/firebase';  // Ensure Firestore is imported
import { useAuth } from './AuthContext';  // Assuming you're using this hook for auth
import { toast } from "react-toastify";
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineTrash, HiExternalLink, HiOutlineBriefcase } from "react-icons/hi";
import Spinner from "../components/Spinner.jsx";
import AdzunaAttribution from "../components/AdzunaAttribution.jsx";
import '../index.css';

// Application stages; jobs saved before stages existed count as "applied".
const STAGES = [
  { value: "applied", label: "Applied", badge: "bg-brand-soft text-brand ring-brand/30" },
  { value: "interviewing", label: "Interviewing", badge: "bg-amber-50 text-amber-700 ring-amber-200" },
  { value: "offer", label: "Offer", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  { value: "rejected", label: "Rejected", badge: "bg-rose-50 text-rose-700 ring-rose-200" },
];
const stageOf = (job) => job.status || "applied";

const JobTracker = () => {
  const {user} = useAuth();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState("all");

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
        // newest first; older docs without createdAt go last
        jobs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setAppliedJobs(jobs);  // Set jobs into state
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        toast.error("Couldn't load your applied jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user]);  // Re-run this effect when user changes
const deleteDocField = async(jobId) => {
  const docRef = doc(db,'appliedJobs',jobId);
  try{
    await deleteDoc(docRef);
    toast.success('job deleted successfully.');
    setAppliedJobs(prev => prev.filter(job => job.id !== jobId));
  }catch(err){
    console.error('error deleting job',err);
    toast.error('error deleting job');
  }
};
const updateStage = async(jobId, status) => {
  try{
    await updateDoc(doc(db,'appliedJobs',jobId), { status });
    setAppliedJobs(prev => prev.map(job => job.id === jobId ? { ...job, status } : job));
    toast.success(`Moved to ${STAGES.find(s => s.value === status).label}`);
  }catch(err){
    console.error('error updating stage',err);
    toast.error("Couldn't update the stage.");
  }
};
  if (loading) return <Spinner label="Loading your applications…"/>;
  const visibleJobs = stageFilter === "all" ? appliedJobs : appliedJobs.filter(job => stageOf(job) === stageFilter);
  const countFor = (stage) => appliedJobs.filter(job => stageOf(job) === stage).length;
  const chip = (active) => `rounded-full px-3 py-1.5 text-sm font-medium transition ${active ? 'bg-brand-soft text-brand ring-1 ring-brand/30' : 'bg-surface text-muted ring-1 ring-line hover:text-ink'}`;
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink">Applied <span className="text-brand">Jobs</span></h2>
          <p className="mt-1 text-sm text-muted">Every role you've swiped to apply for.</p>
        </div>
        <span className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink-soft">{appliedJobs.length} total</span>
      </div>
      {appliedJobs.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button type="button" className={chip(stageFilter === "all")} onClick={()=>setStageFilter("all")}>All ({appliedJobs.length})</button>
          {STAGES.map(stage => (
            <button key={stage.value} type="button" className={chip(stageFilter === stage.value)} onClick={()=>setStageFilter(stage.value)}>
              {stage.label} ({countFor(stage.value)})
            </button>
          ))}
        </div>
      )}
      <section>
        <ul className="grid gap-4 md:grid-cols-2">
          {visibleJobs.length === 0 ? (
            <li className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-canvas px-6 py-14 text-center text-muted">
              <HiOutlineBriefcase size={32} className="text-subtle"/>
              {appliedJobs.length === 0 ? "No jobs applied yet." : "No jobs in this stage."}
            </li>
          ) : (
            visibleJobs.map((newCard) => {
              const stage = STAGES.find(s => s.value === stageOf(newCard)) || STAGES[0];
              return (
              <li key={newCard.id} className="glass group flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:border-brand/30">
                <div className="flex cursor-pointer items-start gap-3" onClick={()=>window.open(newCard.link)}>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft font-bold uppercase text-brand ring-1 ring-line">
                    {newCard.company ? newCard.company[0] : '?'}
                  </div>
                  <h3 className="min-w-0 flex-1 font-semibold leading-snug text-ink transition group-hover:text-brand-hover">
                    {newCard.title}
                    <span className="mt-0.5 block text-sm font-medium text-brand">{newCard.company}</span>
                  </h3>
                  <HiExternalLink className="shrink-0 text-subtle transition group-hover:text-brand-hover" size={18}/>
                </div>
                <p className="flex cursor-pointer flex-wrap gap-x-4 gap-y-1 text-sm text-muted" onClick={()=>window.open(newCard.link)}>
                  <span className="flex items-center gap-1.5"><HiOutlineLocationMarker/>{newCard.location}</span>
                  <span className="flex items-center gap-1.5"><HiOutlineCalendar/>Applied {newCard.appliedAt}</span>
                </p>
                <AdzunaAttribution/>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted">
                    Stage
                    <select
                      value={stage.value}
                      onChange={(e)=>updateStage(newCard.id, e.target.value)}
                      className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold ring-1 outline-none [&>option]:bg-surface [&>option]:text-ink ${stage.badge}`}
                    >
                      {STAGES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </label>
                  <button
                  onClick={()=>deleteDocField(newCard.id)}
                  className="btn-danger !px-3 !py-1.5 text-xs"><HiOutlineTrash size={14}/>Remove Job</button>
                </div>
              </li>
              );
            })
          )}
        </ul>
      </section>
    </div>
  );
};

export default JobTracker;
