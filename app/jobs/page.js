'use client'

import Loading from "@/app/components/Loading"
import { Button } from "@/components/ui/button"
import { Suspense, useEffect, useState } from "react"
import Header from "../components/Header";
import JobListing from "../components/JobListing";
import { FormatDate } from "@/utility/FormatDate";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Jobs = () =>
{
    const [ jobs, setJobs ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();
    const userRole = session?.user?.role; // adjust to match your session shape
    const canManage = userRole === 'maintainer' || userRole === 'admin';

    const getJobs = async () =>
    {
        try
        {
            const url = '/api/job'
            const response  = await axios.get(url);
            setJobs(response.data);
        }
        catch(error)
        {
            toast.error(error.message)
        }
        finally
        {
            setIsLoading(false)
        }
    }

    useEffect(()=>
    {
        getJobs();
    },[])

    if(isLoading)
        return <Loading/>

    return(
        <div className="">
            <Header/>
            <div className="lg:px-[10vw] px-[5vw] py-12 pt-24 space-y-4 mt-4">
                <div className="flex justify-between items-start space-y-4">
                    <div>
                        <h1 className="font-semibold text-lg">Listed Jobs</h1>
                        {jobs.length ? <p className="text-xs text-muted-foreground">Last updated {FormatDate(jobs[jobs.length-1]?.createdAt)}</p> : <p className="text-xs text-muted-foreground">Recently updated</p>}
                    </div>
                    {canManage && <Button onClick={()=> router.push('/admin/postJob')}>Post Job</Button>}
                </div>
                {jobs.length ? <JobListing jobs={jobs}/> : 
                <div className="text-center pt-[20%]">No jobs are listed as of now</div>}
            </div>
        </div>
    )
}

// const Jobs = () =>
// {

//     return(
//         <Suspense fallback={<Loading/>}>
//             <Page/>
//         </Suspense>
//     )
// }

export default Jobs