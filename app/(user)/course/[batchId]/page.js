'use client'

import axios from "axios";
import { useSession } from "next-auth/react"
import Image from 'next/image';
import locked from '../../../../assets/locked.png'
import pendingIcon from '../../../../assets/pendingIcon.png'
import youtube from '../../../../assets/youtube.png'
import { useParams, usebatchId, useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from 'sonner';
import Link from 'next/link';
import Loading from '@/app/components/Loading';
import mockIcon from '../../../../assets/mock.png'
import { Card } from '@/components/ui/card';
import { Book, Calendar, GroupIcon, Loader, Loader2, User, Video } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";
import { FormatDate } from "@/utility/FormatDate";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const completedSessions = (sessions, type='') =>
{
    if(!sessions)
        return

    const completed = sessions.filter((session) => session.status === 'Completed').length 
    if(type === 'count')
        return completed

    const progress = (completed/sessions.length)*100
    return progress
}

export const sprintProgress = (sessions, mocks) =>
{
    const sessionCompleted = sessions.filter((session) => session.status === 'Completed').length 
    const sessionProgress = (sessionCompleted/sessions.length)*70
    const mockProgress = (mocks.length/6)*30
    const totalProgress = sessionProgress + mockProgress
    return totalProgress
}

export const recordings = (sessions) =>
{
    const count = sessions.filter((session) => session.status === 'Completed').length
    return count === 0 ? 'NA' : count
}

const Page = () =>
{
    return(
        <Suspense fallback={<Loading/>}>
            <Batch/>
        </Suspense>
    )
}

const Batch = () =>
{
    const { data, status } = useSession();
    const [ enrollment, setEnrollment ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const params = useSearchParams();
    const enrolmentId = params.get('eId');
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("sessions");
    const [ pendingTests, setPendingTests ] = useState(null);
    const [ assignLoading, setAssignLoading ] = useState(false);
    const [ retakeLoading, setRetakeLoading ] = useState(false);
    const pathname = usePathname();

    const tabs = 
    [
        { id: "sessions", label: "Sessions", bg: 'bg-green-400', completed: completedSessions(enrollment?.batch?.sessions, 'count'), total: enrollment?.batch?.sessions?.length, progress: completedSessions(enrollment?.batch?.sessions) },
        { id: "assignedMocks", label: "Assigned mocks", bg: 'bg-orange-400', completed: enrollment?.mocks?.length, total: 6, progress: enrollment?.mocks?.length*100/6 },
        { id: "upcomingMocks", label: "Weekly mocks", bg: 'bg-blue-400', completed: enrollment?.batch?.mocks?.length, total: 6, progress: enrollment?.batch?.mocks?.length*100/6}
    ];
    
    const getEnrollment = async () =>
    {
        try
        {
            const url = `/api/enrollment/${enrolmentId}`
            const response = await axios.get(url);
            if(!response.data.batch.access)
            {
                router.push('/dashboard')
                toast('Access Denied')
            }
            setEnrollment(response.data)
            const pendingTests = response.data.batch.mocks.slice(response.data.mocks.length)
            setPendingTests(pendingTests.length)
        }
        catch(error)
        {
            toast(error.message);
        }
        finally
        {
            setIsLoading(false)
        }
    }

    useEffect(() => 
    {
        if(status === "authenticated")
        {
            getEnrollment();
        }
        else if(status === "unauthenticated")
            router.push('/')
        else
            setIsLoading(true);
            
    }, [status]);

    const handleAccess = (session, index) =>
    {
        if(session.status === 'Completed')
            router.push(`/course/${enrollment.batch.course.id}/lecture?lectureId=${session.lecture._id}&&course=${enrollment.batch.course.id}&&id=${index+1}`)
        else
            toast.error('Access denied')
    }

    const handleMock = async (mock) =>
    {
        try
        {
            setAssignLoading(true);
            const url = `/api/assessment`;
            const response = await axios.post(url, {quizId: mock.quiz, enrollmentId: enrollment._id, batchId: enrollment.batch._id, id:mock.id})
            toast.success(response.data.message);
            getEnrollment();
        }
        catch(error)
        {
            toast.error(error.message);
        }
        finally
        {
            setAssignLoading(false);
        }
    }

    const handleRetake = async (e, id) =>
    {
        e.preventDefault();

        try
        {
            setRetakeLoading(true)
            const mockDetails = { answers: [], status: 'Pending' }
            const url = `/api/assessment/${id}`
            const response = await axios.put(url, mockDetails)
            toast.success(response.data.message)
            router.push(`/mock-test?mockId=${id}`)
        }
        catch(error)
        {
            toast.error(error.message)
        }
        finally
        {
            setRetakeLoading(false)
        }
    }

    if(status === 'loading' || isLoading)
    return(
        <Loading/>   
    )

    return(
        <div className="space-y-6">
            <div className="text-white shadow-md p-6 rounded-xl space-y-6 text-sm" style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <div className="flex items-center space-x-3">
                    <User className="text-blue-500" size={20} />
                    <h2 className="text-xl font-bold ">Welcome, {data.user.name}!</h2>
                </div>
                <Progress value={sprintProgress(enrollment.batch.sessions, enrollment.mocks)} className="h-4 w-full bg-gray-100 rounded-full">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${sprintProgress(enrollment.batch.sessions, enrollment.mocks)}%` }} />
                </Progress>
                <div className="flex items-center justify-between">
                    <p>Sprint Progress ( Live classes + Mock tests )</p>
                    <p>{sprintProgress(enrollment.batch.sessions, enrollment.mocks).toFixed(2)}%</p>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 text-sm ">
            <div className="w-full md:w-1/3 rounded-xl shadow-md p-8 h-fit space-y-6 md:sticky md:top-28 overflow-y-auto text-black bg-neutral-50">
            {tabs.map((tab) => 
            (
                <div key={tab.id} className="flex gap-2 relative">
                
                {/* Animated Indicator */}
                {activeTab === tab.id && (
                <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-[-2] w-2 h-full rounded-lg"
                    style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />)}

                <button className={`w-full text-left space-y-2 relative p-2 pl-6 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id ? "" : "hover:bg-gray-200"}`} onClick={() => setActiveTab(tab.id)}>
                    <p className="font-medium">{tab.label}</p>

                    <Progress value={tab.progress} className="h-4 w-full bg-gray-300 rounded-full">
                        <motion.div
                        className={`${tab.bg} h-full rounded-full`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${tab.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}/>
                    </Progress>

                    <div className="flex items-center justify-between text-xs">
                    <p>{tab.completed}/{tab.total}</p>
                    
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}>
                    {tab.progress.toFixed(2)}%
                    </motion.p>
                    </div>
                </button>
            </div>
            ))}
            <div className="text-xs flex justify-around gap-2">
                

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <Book size={16} />
                            <p>Course</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{enrollment.batch.course.id.toUpperCase()}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <GroupIcon size={16} />
                            <p>Batch</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{enrollment.batch.title}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <Calendar size={16} />
                            <p>Duration</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{FormatDate(enrollment.batch.startDate) +' - ' +FormatDate(enrollment.batch.endDate)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <User size={16} />
                            <p>Mentor</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{enrollment.batch.mentor.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            </div>

            <div className="flex-1 space-y-6">
            {activeTab === "sessions" && (
            <div className="space-y-3">
                {enrollment.batch.sessions.map((session, index) => 
                (
                    <Card className='flex gap-2 justify-between cursor-pointer items-center p-6 bg-neutral-50' key={session._id}>
                        <div className="flex items-center gap-2">
                            <Image className='h-6 w-fit' src={youtube} alt='video'/>
                            <p>{session.lecture.title}</p>
                        </div>
                        {session.status === 'Upcoming' ? <Image className='h-5 w-fit' src={locked} alt={session.status}/> : <Button className='text-xs py-0' onClick={()=> handleAccess(session, index)}>Watch recording</Button>}
                    </Card>
                ))}
            </div>)}

           {activeTab === "assignedMocks" && (
                <div className="space-y-3">
                {enrollment.mocks.map((mock, index)=>
                (
                    <Card className={`${mock.status === 'Completed' ? 'bg-green-50' : 'bg-red-50'} space-y-2 p-5`} key={mock._id}>
                        {retakeLoading ?
                        <div>
                            <Loader2 className="animate-spin"/>
                            Resetting...
                        </div> :
                        <div>
                            <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Image className='h-6 w-fit' src={mockIcon} alt='test'/>
                                <h1>Mock {index+1}</h1>
                            </div>
                            <Button className='text-xs' onClick={()=> router.push(mock.status === 'Pending' ? `/mock-test?mockId=${mock._id}` : `/review-mock-test?mockId=${mock._id}`)}>{mock.status === 'Completed' ? 'Review' : 'Continue'}</Button>
                        </div>
                        {enrollment.batch.mocks[index].status === 'Unlocked' && mock.status === 'Completed' &&
                        <div className="flex gap-1 text-xs">
                            You can retake this mock now. 
                            <span className='text-xs text-blue-500 cursor-pointer' onClick={(e)=> handleRetake(e, mock._id)}> Click here!</span>
                        </div>}
                        </div>}
                    </Card>
                ))}
            </div>)}

            {activeTab === "upcomingMocks" && (
                <div className="space-y-3">
                {enrollment.batch.mocks.map((mock, index)=>
                (
                    <Card className={`bg-blue-50 p-6 flex items-center justify-between`} key={mock._id}>
                        <div className="flex items-center gap-2">
                            <Image className='h-6 w-fit' src={mockIcon} alt='test'/>
                            <h1>Mock {index+1}</h1>
                        </div>
                       {index+1 > enrollment.mocks.length  && 
                       <div>
                            { assignLoading ?
                            <Button className='text-xs'>
                                <Loader2 className="animate-spin"/>
                                Assigning...
                            </Button>
                            : <Button className='text-xs' disabled={assignLoading} onClick={()=> handleMock(mock)}>Start</Button>}
                        </div>}
                    </Card>
                ))}
            </div>)}
            
            </div>
        </div>
        </div>
    )
}

export default Page

