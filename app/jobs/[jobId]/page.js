'use client'

import Loading from "@/app/components/Loading"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import Image from "next/image"
import editIcon from '../../../assets/edit-dark.png'
import deleteIcon from '../../../assets/delete-dark.png'
import { FormatDate } from "@/utility/FormatDate"
import Header from "@/app/components/Header"
import { useSession } from "next-auth/react"

const Page = () =>
{
    const [ job, setJob ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const params = useParams();
    const jobId = params.jobId; // change to params.jobId if your folder is [jobId]
    const router = useRouter();
    const { data: session } = useSession();

    const userRole = session?.user?.role; // adjust to match your session shape
    const canManage = userRole === 'maintainer' || userRole === 'admin';

    useEffect(()=>
    {
        if(jobId)
            getJobDescription();
    },[jobId])

    const getJobDescription = async () =>
    {
        try
        {
            const url = `/api/job/${jobId}`
            const response = await axios.get(url);
            setJob(response.data);
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

    const handleDelete = async () =>
    {
        if(!confirm('Are you sure you want to delete this job?')) return;

        try
        {
            await axios.delete(`/api/job/${jobId}`);
            toast.success('Job deleted');
            router.push('/jobs');
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    if(isLoading)
        return <Loading/>

    if(!job)
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <p className="text-muted-foreground">Job not found.</p>
            </div>
        )

    return (
        <div>
            <Header/>
            <div className="lg:px-[10vw] px-[5vw] py-12 pt-24">
            <Card className="p-6 space-y-6 bg-neutral-50">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{job.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {job.company} • {job.city}, {job.country}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Posted {FormatDate(job.createdAt)}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        {/* <button onClick={() => router.push(`/jobs/${jobId}/edit`)}>
                            <Image src={editIcon} alt="Edit" width={20} height={20} />
                        </button> */}
                        {canManage && (
                        <div className="flex gap-3">
                            <button onClick={handleDelete}>
                                <Image src={deleteIcon} alt="Delete" width={20} height={20} />
                            </button>
                        </div>
                        )}
                    </div>
                </div>

                {/* Key details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground font-bold">Workplace Type</p>
                        <p className="font-medium">{job.workplaceType}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground font-bold">Job Type</p>
                        <p className="font-medium">{job.jobType}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground font-bold">Experience</p>
                        <p className="font-medium">{job.experience} years</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground font-bold">Openings</p>
                        <p className="font-medium">{job.openings}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground font-bold">Budget</p>
                        <p className="font-medium">
                            {job.budget ? `AED ${job.budget.toLocaleString()}` : 'NA'}
                        </p>
                    </div>
                    {job.link && (
                        <div>
                            <p className="text-muted-foreground font-bold">Apply Link</p>
                            <a
                                href={job.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 underline"
                            >
                                Click here to apply
                            </a>
                        </div>
                    )}
                </div>

                <div className="space-y-1">
                    <h2 className="text-muted-foreground font-bold">Description</h2>
                    <p className="text-sm whitespace-pre-line">
                        {job.description}
                    </p>
                </div>

                {/* Skills */}
                {job.skills?.length > 0 && (
                    <div>
                        <h2 className="font-medium mb-2">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-neutral-200 rounded-full text-xs"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <Button onClick={() => router.push('/jobs')}>Back to Jobs</Button>
            </Card>
        </div>
        </div>
    )
}

const JobDescription = () =>
{
    return(
        <Suspense fallback={<Loading/>}>
            <Page/>
        </Suspense>
    )
}

export default JobDescription