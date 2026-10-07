import React , {useState,useEffect, useRef} from "react";
import styles from "./First.module.css";
import { HiFilter,HiX, HiOutlineLocationMarker, HiOutlineCash, HiOutlineClock, HiOutlineCalendar, HiOutlineDocumentText, HiArrowLeft, HiArrowRight, HiExternalLink, HiCheck } from 'react-icons/hi';
import { toast } from "react-toastify";
import { useAuth } from '../AuthContext.jsx';
import "react-toastify/dist/ReactToastify.css";
import { db } from '../../utils/firebase.js';
import { collection, doc, getDoc, getDocs, query, setDoc, where, serverTimestamp } from 'firebase/firestore';
import {jobFetcher} from "../../utils/JobFetcher.js";
import JobFilterForm from "../JobFilter.jsx";
import Spinner from "../../components/Spinner.jsx";
import { Link } from "react-router-dom";
function First() {
  // State to track the touch start position
  const { isLoggedIn, user, authLoading } = useAuth();
  const [showFilter, setShowFilter] = useState(false);
  const [showJobInfo, setShowJobInfo] = useState(false);
  const [swipeDirection, setCardSwipeDirection] = useState(null);
  const [cards, setCards] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const cardRef = useRef(null);
  const [notification, setNotification] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
  // current search + which Adzuna page we've loaded up to
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const  navRef = useRef(null);
  const filterRef = useRef(null);
  const close = ()=>{
      setShowJobInfo(!showJobInfo);
  }
  useEffect(()=>{
    const cards = async ()=>{
      const jobCards = await jobFetcher();
      setCards(jobCards);
    };
    cards();
  },[]);
  const handleFilter = async (filters) => {
    setShowFilter(false);
    setCards(null);
    setNotification("");
    setSearch(filters);
    setPage(1);
    const jobCards = await jobFetcher({ ...filters, page: 1 });
    setCards(jobCards);
    setCardIndex(0);
  };
  // Fetch the next page for the current search; returns true if new jobs were added.
  const loadMore = async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const moreCards = await jobFetcher({ ...search, page: nextPage });
    const seen = new Set((cards || []).map(card => card.id));
    const fresh = moreCards.filter(card => !seen.has(card.id));
    setLoadingMore(false);
    if (fresh.length === 0) return false;
    setCards(prev => [...(prev || []), ...fresh]);
    setPage(nextPage);
    return true;
  };
  
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    handleSwipe(touchEndX- touchStartX);
  };
  const handleMouseDown = (e) => {
    setTouchStartX(e.clientX);
  };
  const about =()=>{
    setShowJobInfo(!showJobInfo);
  }
  const filterjob = ()=>{
    setShowFilter(prev => !prev);
  };
  useEffect(()=>{
    const handleClicker = (event) => {
      if(filterRef.current && !filterRef.current.contains(event.target)&&
       navRef.current && !navRef.current.contains(event.target)){
        setShowFilter(false);
      }
    }
    if(showFilter){
      document.addEventListener('mousedown',handleClicker);
    }
    return()=>{
      document.removeEventListener('mousedown',handleClicker);
    }
  },[showFilter]);
  const handleMouseUp = (e) => {
    handleSwipe(e.clientX - touchStartX);
  };
  
  const applyToJob = async (newCard) => {
    try {
      if (!user||!user.uid) {
        toast.error("You must be logged in to apply.");
        return;
      }
      // One doc per user+job, so the same job can't be saved twice.
      const jobRef = doc(db, "appliedJobs", `${user.uid}_${newCard.id}`);
      const existing = await getDoc(jobRef);
      // Jobs saved before this change have random ids, so also match on link.
      const legacy = newCard.link && !existing.exists()
        ? await getDocs(query(collection(db, "appliedJobs"), where("userId", "==", user.uid), where("link", "==", newCard.link)))
        : null;
      if (existing.exists() || (legacy && !legacy.empty)) {
        toast.info(`You've already applied to ${newCard.title}`);
        return;
      }
  
      const jobData = {
        userId: user.uid,
        jobId: newCard.id,
        title: newCard.title,
        company: newCard.company,
        location: newCard.location,
        salaryMin: newCard.salaryMin ?? null,
        salaryMax: newCard.salaryMax ?? null,
        date: newCard.date,
        link: newCard.link,
        status: "applied",
        appliedAt: new Date().toLocaleDateString(),
        createdAt: serverTimestamp(),
      };
      await setDoc(jobRef, jobData);
      toast.success(`Applied to ${newCard.title}`);
      if(newCard.link){
        window.open(newCard.link);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to apply. Try again.");
    }
  };  
  const handleSwipe = (diffX) =>{
    const cardWidth = cardRef.current ? cardRef.current.offsetWidth : 0;
    const threshold = cardWidth * 0.15;
    if(diffX < -threshold){
      setCardSwipeDirection('left'); // or 'right'
      if (newCard) applyToJob(newCard);
    } else if( diffX > threshold){
      toast.error("Swiped right: Rejected");
      setCardSwipeDirection('right'); // or 'right'
      setNotification("Swiped right: Rejected")
    }
    else{
     setCardSwipeDirection(null);
     return;
    }
    setTimeout(async () => {
      setCardSwipeDirection(null);
      if (cardIndex + 1 < cards.length) {
        setCardIndex(cardIndex + 1);
      } else if (await loadMore()) {
        setCardIndex(cardIndex + 1);
      } else {
        toast.warn("No new jobs available");
        setCardIndex(null);
      }
    }, 200); // Reduced delay for better responsiveness
  };
  // Apply / Pass buttons for people who can't (or don't want to) drag the card.
  const swipeWithButton = (direction) => {
    if (swipeDirection) return;
    const cardWidth = cardRef.current ? cardRef.current.offsetWidth : 1;
    handleSwipe(direction === 'left' ? -cardWidth : cardWidth);
  };
  const newCard = !loadingMore && cards && cardIndex !== null ? cards[cardIndex]:null;
  const salary = newCard && (newCard.salaryMin || newCard.salaryMax)
    ? `£${Math.round(newCard.salaryMin || 0).toLocaleString()} – £${Math.round(newCard.salaryMax || newCard.salaryMin || 0).toLocaleString()}`
    : 'Not specified';
  const pretty = (value) => value ? value.replace(/_/g, ' ') : 'Not specified';
  return (
    <div className="relative">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Discover <span className="text-brand">jobs</span></h1>
          <p className="mt-1 text-sm text-muted">Swipe left to apply, swipe right to pass.</p>
        </div>
        <div
          className={`flex cursor-pointer select-none items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${showFilter ? 'border-brand/30 bg-brand-soft text-brand' : 'border-line bg-surface text-ink hover:bg-canvas'}`}
          ref = {navRef}
          onClick={filterjob}
        >
          <HiFilter size={18}/>
          Filters
        </div>
      </div>
      {showFilter&&(
              <div className= {`absolute right-0 top-20 z-30 w-full max-w-sm ${styles.animateLeft}`} ref = {filterRef}>
                    <JobFilterForm onFilter={handleFilter} initial={search}/>
              </div>
            )
          }
  {authLoading ? (
    <Spinner label="Checking your session…"/>
  ) : isLoggedIn ? (
    <div className={styles.container} id="content">
      {newCard ?(
        <div className="w-full">
        <div ref={cardRef} className={`relative w-full cursor-grab rounded-2xl border border-line bg-surface shadow-md select-none overflow-hidden transition-transform duration-300 ease-in-out active:cursor-grabbing
          ${swipeDirection === "left" ? styles.swipeLeft: swipeDirection === "right" ? styles.swipeRight : ""}
        `}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            >
            <div className="h-1 w-full bg-brand"/>
            <div className="first-content p-6">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-lg font-bold uppercase text-brand ring-1 ring-line">
                    {newCard.company ? newCard.company[0] : '?'}
                  </div>
                  <div className="min-w-0">
                    <h2 className='text-xl font-bold leading-snug text-ink'>{newCard.title ? newCard.title : "swipe left or right"}</h2>
                    <h3 className='mt-0.5 truncate text-sm font-medium text-brand'>{newCard.company}</h3>
                  </div>
                </div>
                <dl className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-line">
                    <HiOutlineLocationMarker className="shrink-0 text-muted" size={18}/>
                    <span className="truncate text-ink">{newCard.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-line">
                    <HiOutlineCash className="shrink-0 text-emerald-600" size={18}/>
                    <span className="truncate text-ink">{salary}</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-line">
                    <HiOutlineClock className="shrink-0 text-muted" size={18}/>
                    <span className="capitalize text-ink">{pretty(newCard.contractTime)}</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-line">
                    <HiOutlineDocumentText className="shrink-0 text-muted" size={18}/>
                    <span className="capitalize text-ink">{pretty(newCard.contractType)}</span>
                  </div>
                </dl>
                <p className="mt-4 flex items-center gap-2 text-xs text-subtle">
                  <HiOutlineCalendar size={14}/> Posted {newCard.date}
                  {cards && <span className="ml-auto rounded-full bg-surface px-2 py-0.5 text-muted">{cardIndex + 1} / {cards.length}</span>}
                </p>
                <button className="btn-secondary mt-5" onClick={about}>About job</button>
            </div>
            {showJobInfo&&(
                  <>
                   <div className="fixed inset-0 z-40 bg-ink/40" onClick={close}/>
                   <div className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[75vh] w-full max-w-2xl cursor-auto overflow-auto rounded-t-3xl border border-line bg-surface p-6 shadow-2xl ${styles.animateslideIn}`}>
                    <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line"/>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-ink">{newCard.title}</h3>
                        <p className="text-sm text-brand">{newCard.company}</p>
                      </div>
                      <button className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-canvas text-ink-soft transition hover:bg-rose-100 hover:text-rose-700" onClick={close} aria-label="Close">
                        <HiX size={20}/>
                      </button>
                    </div>
                    <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
                        <details className="cursor-pointer">
                          <summary className="font-medium text-brand">Get to job through link</summary>
                          <a
                            href={newCard.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex items-center gap-1.5 break-all text-sm text-brand hover:text-brand-hover"
                          >
                            <HiExternalLink className="shrink-0"/>{newCard.link}
                          </a>
                        </details>
                    </div>
                    <div className="mt-4">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">Description</h4>
                      <p className="text-sm leading-relaxed text-ink-soft">{newCard.description}</p>
                    </div>
                  </div>
                </>
                )
               }
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={()=>swipeWithButton('left')}
            disabled={!!swipeDirection}
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
          ><HiArrowLeft/><HiCheck size={16}/> Apply</button>
          <button
            type="button"
            onClick={()=>swipeWithButton('right')}
            disabled={!!swipeDirection}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
          >Pass <HiX size={16}/><HiArrowRight/></button>
        </div>
        <p className="mt-3 text-center text-xs text-subtle">Or drag the card left to apply, right to pass</p>
        </div>
      ):(
           <div className={styles.noImage}>
             {cards === null || loadingMore ? (
               <>
                 <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand"/>
                 <p className="text-sm text-muted">{loadingMore ? 'Loading more jobs…' : 'Loading jobs…'}</p>
               </>
             ) : (
               <>
                 <p className="text-lg font-semibold text-ink">You're all caught up</p>
                 <p className="text-sm text-muted">Try different filters to find more jobs.</p>
               </>
             )}
             {notification && !loadingMore && cards !== null && (
              <div className={styles.notification}>
                 <p>{notification}</p>
              </div>
           )}
         </div>
        )
      }
    </div>
    ) : (
      <div className="glass mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand text-white">
          <HiFilter size={26}/>
        </div>
        <h2 className="text-2xl font-bold text-ink">Find your next role, one swipe at a time</h2>
        <p className='mt-2 text-sm text-muted'>Please <Link to ='/login' className="font-medium text-brand hover:text-brand-hover">sign in</Link> to view jobs</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="btn-primary">Sign in</Link>
          <Link to="/signup" className="btn-secondary">Create account</Link>
        </div>
      </div>
  )}
  </div>
  );
}
export default First
