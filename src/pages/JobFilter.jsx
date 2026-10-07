import React , {useState, useRef} from "react";
function JobFilterForm({onFilter, initial = {}}){
    // State to track filter values (seeded from the current search so they survive reopening)
    const [jobTitle, setJobTitle] = useState(initial.jobTitle || "");
    const [location, setLocation] = useState(initial.location || "");
    const [contractType, setContractType] = useState(initial.contractType || "");
    const [salaryMin, setSalaryMin] = useState(initial.salaryMin || "");
    const [salaryMax, setSalaryMax] = useState(initial.salaryMax || "");
    const [error, setError] = useState("");
    // Handle form submission
    const navRef = useRef();
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!jobTitle.trim() && !location.trim()) {
        setError("Enter a job title or a location");
      } else if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
        setError("Minimum salary can't be more than the maximum");
      } else {
        setError("");
        onFilter({
          jobTitle: jobTitle.trim(),
          location: location.trim(),
          contractType,
          salaryMin,
          salaryMax,
        });
      }
    };  
    return(
        <div className="glass w-full !bg-[#131624]/95 p-5" >
                        <div className="mb-4">
                          <h3 className="text-base font-semibold text-white">Filter jobs</h3>
                          <p className="text-xs text-slate-400">Narrow down roles by title and location.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4" ref={navRef}>
                        <div>
                            <label htmlFor="jobTitle" className="field-label">
                              Job Title
                            </label>
                            <input
                              type="text"
                              id="jobTitle"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              className="field-input"
                              placeholder="e.g. Frontend Developer"
                            />
                          </div>

                          {/* Location */}
                          <div>
                            <label htmlFor="location" className="field-label">
                              Location
                            </label>
                            <input
                              type="text"
                              id="location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="field-input"
                              placeholder="e.g. London"
                            />
                          </div>

                          {/* Contract Type */}
                          <div>
                            <label htmlFor="contractType" className="field-label">
                              Contract Type
                            </label>
                            <select
                              id="contractType"
                              value={contractType}
                              onChange={(e) => setContractType(e.target.value)}
                              className="field-input [&>option]:bg-[#131624]"
                            >
                              <option value="">Any</option>
                              <option value="Full-Time">Full-Time</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Contract">Contract</option>
                              <option value="Permanent">Permanent</option>
                            </select>
                          </div>

                          {/* Salary Range */}
                          <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="salaryMin" className="field-label">
                              Min Salary (£)
                            </label>
                            <input
                              type="number"
                              id="salaryMin"
                              min="0"
                              step="1000"
                              value={salaryMin}
                              onChange={(e) => setSalaryMin(e.target.value)}
                              className="field-input"
                              placeholder="e.g. 30000"
                            />
                          </div>
                          <div>
                            <label htmlFor="salaryMax" className="field-label">
                              Max Salary (£)
                            </label>
                            <input
                              type="number"
                              id="salaryMax"
                              min="0"
                              step="1000"
                              value={salaryMax}
                              onChange={(e) => setSalaryMax(e.target.value)}
                              className="field-input"
                              placeholder="e.g. 50000"
                            />
                          </div>
                          </div>

                          {/* Error Message */}
                          {error && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

                          {/* Submit Button */}
                          <div>
                            <button
                              type="submit"
                              className="btn-primary"
                            >
                              Apply Filter
                            </button>
                          </div>
                        </form>
                      </div>
    );
}
export default JobFilterForm
