// Jobs come from our own /api/jobs endpoint, which holds the Adzuna key server-side
// (api/jobs.js on Vercel, functions/index.js on Firebase, vite.config.js in dev).
const CONTRACT_PARAMS = {
    "Full-Time": "full_time",
    "Part-Time": "part_time",
    "Contract": "contract",
    "Permanent": "permanent",
};
export const jobFetcher = async ({ jobTitle = '', location = '', contractType = '', salaryMin = '', salaryMax = '', page = 1 } = {}) => {
    const params = new URLSearchParams({ page: String(page) });
    if (jobTitle) params.set("what", jobTitle);
    if (location) params.set("where", location);
    if (CONTRACT_PARAMS[contractType]) params.set(CONTRACT_PARAMS[contractType], "1");
    if (salaryMin) params.set("salary_min", salaryMin);
    if (salaryMax) params.set("salary_max", salaryMax);
    try{
        const response = await fetch(`/api/jobs?${params}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Request failed with ${response.status}`);
        return data.results.map((jobs)=>{
            return {
                id: jobs.id,
                title: jobs.title,
                jobtitle: jobs.title,
                company: jobs.company?.display_name,
                description: jobs.description,
                contractTime:jobs.contract_time,
                contractType:jobs.contract_type,
                salaryMin:jobs.salary_min,
                salaryMax:jobs.salary_max,
                location: jobs.location?.display_name,
                date: new Date(jobs.created).toLocaleDateString('en-uk'),
                link: jobs.redirect_url
            };
        })
    }catch(error){
        console.error("Error fetching jobs data:", error);
        return [];
    }
};
