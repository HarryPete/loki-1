import { Job } from "@/models/job.model";
import { User } from "@/models/user.model";

class jobService
{
    async postNewJob(data)
    {
        try
        {
            const newJob = await Job.create(data)
            await newJob.save();
            return newJob
        }
        catch(error)
        {
            throw error
        }
    }
    
    async updateJob(jobId, jobDetails)
    {
        try
        {
            const job = await Job.findByIdAndUpdate(jobId, { $set: jobDetails });
            return job
        }
        catch(error)
        {
            throw error
        }
    }

    async getJobById(jobId)
    {
        try
        {
            const job = await Job.findById(jobId);
            return job
        }
        catch(error)
        {
            throw error
        }
    }

    async getAllJobs()
    {
        try
        {
            const jobs = await Job.find().populate({ path: 'interests', model: User});
            return jobs
        }
        catch(error)
        {
            throw error
        }
    }

    async deleteJobById(jobId)
    {
        try
        {
            const job = await Job.deleteOne({ _id: jobId });
            return job
        }
        catch(error)
        {
            throw error
        }
    }
}

export default jobService