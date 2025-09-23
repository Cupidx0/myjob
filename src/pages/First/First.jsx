import React , {useState,useEffect, useRef, createElement} from "react";
import styles from "./First.module.css";
import { HiFilter,HiX } from 'react-icons/hi';
import { toast } from "react-toastify";
import { useAuth } from '../AuthContext.jsx';
import "react-toastify/dist/ReactToastify.css";
import { db } from '../../utils/firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import {jobFetcher} from "../../utils/JobFetcher.js";
import JobFilterForm from "../JobFilter.jsx";
import { Link } from "react-router-dom";
function First() {
  // State to track the touch start position
  const { isLoggedIn, user } = useAuth();
  const [showFilter, setShowFilter] = useState(false);
  const [showJobInfo, setShowJobInfo] = useState(false);
  const [swipeDirection, setCardSwipeDirection] = useState(null);
  const [cards, setCards] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const cardRef = useRef(null);
  const [notification, setNotification] = useState("");
  const [cardIndex, setCardIndex] = useState(0);
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
  const handleFilter = async (jobTitle, location) => {
    const jobCards = await jobFetcher(jobTitle, location);
    setCards(jobCards);
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
    toast.info('job info');
    setShowJobInfo(!showJobInfo);
  }
  const filterjob = ()=>{
    setShowFilter(prev => !prev);
  };
  useEffect(()=>{
    const handleClicker = (event) => {
      if(filterRef.current && !filterRef.current.contains(event.target)&&
       !navRef.current.contains(event.target)){
        setShowFilter(false);
      }
    }
    if(showFilter){
      document.addEventListener('mousedown',handleClicker);
    }
    return()=>{
      document.removeEventListener('mouseup',handleClicker);
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
  
      const jobData = {
        userId: user.uid,
        title: newCard.title,
        company: newCard.company,
        location: newCard.location,
        salaryMin: newCard.salaryMin,
        salaryMax: newCard.salaryMax,
        date: newCard.date,
        link: newCard.link,
        appliedAt: new Date().toLocaleDateString(),
      };
      await addDoc(collection(db, "appliedJobs"), jobData);
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
      //setNotification("Swiped left: Applying");
    if(diffX < -threshold){
      setCardSwipeDirection('left'); // or 'right'
      toast.success("Swiped left: Applied");
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
    setTimeout(() => {
      setCardSwipeDirection(null);
      if (cardIndex + 1 < cards.length) {
        setCardIndex(cardIndex + 1);
      } else {
        toast.warn("No new jobs available");
        setCardIndex(null);
      }
    }, 200); // Reduced delay for better responsiveness
  };
  const newCard = cards && cardIndex !== null ? cards[cardIndex]:null;
  return (
    <>
      <div className="top-0 ml-4 cursor-pointer " ref = {navRef} onClick={filterjob}>
      <HiFilter size={30}/>
      </div>
      {showFilter&&(
              <div className= {`max-w-sm absolute top-20 left-20 text-black rounded-md p-2 overflow-auto z-20 -translate-x-8 ${styles.animateLeft}`} ref = {filterRef}>
                  <div className="mt-2 p-3 bg-blue-100 rounded-md w-full">
                    <JobFilterForm onFilter={handleFilter}/>
                </div>
              </div>
            )
          }
  {isLoggedIn ? (
    <div className={styles.container} id="content">
      {newCard ?(

        <div ref={cardRef} className={`flex flex-col items-center justify-center p-4 mt-[70px] border border-gray-400 bg-white text-black rounded-lg max-w-md max-h-md cursor-grab transition-transform duration-300 overflow-scroll ease-in-out
          ${swipeDirection === "left" ? styles.swipeLeft: swipeDirection === "right" ? styles.swipeRight : ""}
        `} 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            >
            <div className="first-content">
                <h2 className='text-2xl font-bold mb-2 text-blue-500'>{newCard.title ? newCard.title : "swipe left or right"}</h2>
                <h3 className='mt-1 font-bold'>Jobtitle: {newCard.company}</h3>
                <h3 className='mt-1 font-bold'>Location: {newCard.location}</h3>
                <h4 className='mt-1 font-bold' >Salary: £{newCard.salaryMin}-£{newCard.salaryMax}{/*{newCard.salaryMin} - £ {newCard.salaryMax}*/}</h4>
                <h4 className='mt-1 font-bold'>job time: {newCard.contractTime ? newCard.contractTime :'not specified'}</h4>
                <h4 className='mt-1 font-bold'>job type: {newCard.contractType ? newCard.contractType :'not specified'}</h4>
                <h3 className='mt-1 font-bold'>Date posted: {newCard.date}</h3>
                <button className="mt-2 bg-black text-white rounded-xl w-full hover:bg-gray-400" onClick={about}>About job</button>
            </div>
            {showJobInfo&&(
                  <>
                   <div className={`absolute bottom-0 left-0 bg-white text-black rounded-md p-4 overflow-auto z-20 -translate-y-8 ${styles.animateslideIn}`}>
                    <div className={styles.animateslideIn}>
                    <HiX size={30} className="text-red-600 mr-0 ml-[90vw] justify-right items-right cursor-pointer" onClick={close}/>
                    <div className="mt-2 p-3 bg-blue-100 rounded-md w-full">
                        <details className="cursor-pointer">
                          <summary className="text-blue-600 underline font-semibold">Get to job through link</summary>
                          <a
                            href={newCard.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-1 text-sm text-blue-500 break-all"
                          >
                            {newCard.link}
                          </a>
                        </details>
                    </div>
                    <div className="top-5 p-3 bg-white rounded-md text-black overflow-auto z-10 h-full">
                      <h3 className="text-sm">{newCard.description}</h3>
                    </div>
                    </div>
                  </div>
                </>
                )
               } 
        </div>
      ):(
           <div className={styles.noImage}>
             {notification && (
              <div className={styles.notification}>
                 <p>{notification}</p>
              </div>
           )}
         </div>
        )
      }
    </div>
    ) : (
      <p className='text-md font-small'>Please <Link to ='/login' className="text-red-600">sign in</Link> to view jobs</p>
  )}
  </>
  );
}
export default First