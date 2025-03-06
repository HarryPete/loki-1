'use client'

import JobForm from "@/app/components/JobForm";
import Loading from "@/app/components/Loading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormatDate } from "@/utility/FormatDate";
import axios from "axios";
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner";
import defaultDP from '../../../assets/defaultDP.png'
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () =>
{
    const [ jobs, setJobs ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ jobId, setJobId ] = useState(null);
    const router = useRouter();

    const handleOpenDialog = (jobId) => 
    {
        setJobId(jobId);
    };

    const handleCloseDialog = () => 
    {
        setJobId(null);
    };

    useEffect(()=>
    {
        getJobs();
    },[])

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

    if(isLoading)
        return <Loading/>

    return(
        <div className="space-y-4">
            <div>
                <h1 className="font-semibold text-lg">Listed Jobs</h1>
                <p className="text-xs text-muted-foreground">Last updated {FormatDate(jobs[jobs.length-1].createdAt)}</p>
            </div>
            <Button onClick={()=> router.push('/job-portal')}>Post Job</Button>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {jobs.map((job)=>
            (
                <Card key={job._id} className='p-6 md:text-sm text-xs space-y-1 bg-neutral-50'>
                    <div className="font-semibold flex items-center justify-between">
                        <span>{job.title}</span>
                        <span className="text-muted-foreground">{job.company}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <p><span>Experience : </span>{job.experience} years</p>
                        <span></span>{job.city +', ' +job.country}
                    </div>
                    <p className="pb-4"><span>Openings : </span>{job.openings}</p>
                    {/* <p className="border-t py-4">{job.description}</p> */}
                    <footer className="flex gap-2 text-xs justify-between">
                        <div className="space-y-2">
                        <div className="space-x-2">
                            <span className="bg-gray-100 p-1 rounded">{job.jobType}</span>
                            <span className="bg-gray-100 p-1 rounded">{job.workplaceType}</span>
                        </div>
                        <p className="text-muted-foreground">Posted on {FormatDate(job.createdAt)}</p>
                        </div>
                        <Button className='text-sm' onClick={() => handleOpenDialog(job._id)}>{job.interests.length} interests</Button>
                       
                        <Dialog open={jobId === job._id} onOpenChange={handleCloseDialog}>
                        <DialogContent className="sm:max-w-[425px] text-sm">
                            <DialogHeader>
                                <DialogTitle>{job.company}</DialogTitle>
                                <DialogDescription>{job.title}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                {job.interests.length > 0 ? job.interests.map((user)=>
                                (
                                    <Card key={user._id} className="flex gap-2 p-2">
                                        <Image className='h-8 w-8 object-cover rounded-full object-top' src={user?.imageURL ? user?.imageURL : defaultDP} alt={user.name} width={100} height={100}/>
                                        <div>
                                        <h1 className="font-semibold">{user.name}</h1>
                                        <div className="flex gap-1 text-muted-foreground text-xs">
                                            <span>{user.experience} years | </span>
                                            <span>{user.domain} | </span>
                                            <span>{user.country}</span>
                                        </div>
                                        </div>
                                    </Card>
                                )) : <h1 className="text-center">No interests shown</h1>}
                                {/* <h1 className="font-semibold border-b border-gray-300 pb-2">Profile details</h1>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Email</span>
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Contact</span>
                                        <span>{user?.contact}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Experience</span>
                                        <span>{user?.experience}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Domain</span>
                                        <span>{user?.domain}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Country</span>
                                        <span>{user?.country}</span>
                                    </div>
                                </div>
                                <h1 className="font-semibold border-b border-gray-300 pb-2">Enrollments</h1>
                                <div className="space-y-1">
                                    {user?.enrollments?.map((enrollment)=>
                                    (
                                        <div key={enrollment._id}>
                                            <h1>{enrollment?.batch?.title}</h1>
                                        </div>
                                    ))}
                                </div>
                                <p className="pt-4 text-gray-400">{user.role +' since ' +FormatDate(user.createdAt)}</p> */}
                            </div>
                        </DialogContent>
                        </Dialog>
                    </footer>
                </Card>
            ))}
            </div>
        </div>
    )
}

const JobPortal = () =>
{

    return(
        <Suspense fallback={<Loading/>}>
            <Page/>
        </Suspense>
    )
}

export default JobPortal
