import config from '../config.json'
const appId = config.appid;
const appKey = config.apikey;
const Country ="gb";
export const jobFetcher = async (jobTitle ='', location = "horley") => {
    const encodedKeyword = encodeURIComponent(jobTitle);
    const encodedLocation = encodeURIComponent(location);
    const url = `https://api.adzuna.com/v1/api/jobs/${Country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodedKeyword}&where=${encodedLocation}`;
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data.results.map((jobs)=>{
            return {
                id: jobs.id,
                title: jobs.title,
                jobtitle: jobs.title,
                company: jobs.company.display_name,
                img: jobs.company.logo || "https://via.placeholder.com/150",
                description: jobs.description,
                contractTime:jobs.contract_time,
                contractType:jobs.contract_type,
                salaryMin:jobs.salary_min,
                salaryMax:jobs.salary_max,
                location: jobs.location.display_name,
                date: new Date(jobs.created).toLocaleDateString('en-uk'),
                link: jobs.redirect_url
            };
        })
    }catch(error){
        console.error("Error fetching jobs data:", error);
        return [];
    }
};
