import React , {useState,useEffect, useRef, createElement} from "react";
//import {db} from './config/firebase';
//import { setDoc } from "firebase/firestore";
function JobFilterForm({onFilter}){
    // State to track filter values
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [contractType, setContractType] = useState("");
    const [salaryRange, setSalaryRange] = useState("");
    const [error, setError] = useState("");
    //useEffect(()=>{
        //const set
    //})
    // Handle form submission
    const navRef = useRef();
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!jobTitle || !location) {
        setError("Please fill out all fields");
      } else {
        setError("");
        onFilter(jobTitle,location);
        // Here you can handle the filter logic or API call
        console.log({
          jobTitle,
          location,
          contractType,
          salaryRange,
        });
      }
    };  
    return(
        <div className="mt-2 p-3 bg-black text-white rounded-md w-full" >
                        <form onSubmit={handleSubmit} className="space-y-4" ref={navRef}>
                        <div>
                            <label htmlFor="jobTitle" className="block font-medium">
                              Job Title
                            </label>
                            <input
                              type="text"
                              id="jobTitle"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              className="w-full p-2 border rounded text-white"
                              placeholder="Enter job title"
                            />
                          </div>

                          {/* Location */}
                          <div>
                            <label htmlFor="location" className="block font-medium">
                              Location
                            </label>
                            <input
                              type="text"
                              id="location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="w-full p-2 border rounded text-white"
                              placeholder="Enter location"
                            />
                          </div>

                          {/* Contract Type */}
                          <div>
                            <label htmlFor="contractType" className="block font-medium">
                              Contract Type
                            </label>
                            <select
                              id="contractType"
                              value={contractType}
                              onChange={(e) => setContractType(e.target.value)}
                              className="w-full p-2 border rounded text-white text-white"
                            >
                              <option value="">Select contract type</option>
                              <option value="Full-Time">Full-Time</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Contract">Contract</option>
                              <option value="Temporary">Temporary</option>
                            </select>
                          </div>

                          {/* Salary Range */}
                          <div>
                            <label htmlFor="salaryRange" className="block font-medium">
                              Salary Range
                            </label>
                            <input
                              type="text"
                              id="salaryRange"
                              value={salaryRange}
                              onChange={(e) => setSalaryRange(e.target.value)}
                              className="w-full p-2 border rounded"
                              placeholder="Enter salary range"
                            />
                          </div>

                          {/* Error Message */}
                          {error && <p className="text-red-500">{error}</p>}

                          {/* Submit Button */}
                          <div>
                            <button
                              type="submit"
                              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Apply Filter
                            </button>
                          </div>
                        </form>
                      </div>
    );
}
export default JobFilterForm