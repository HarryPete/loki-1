'use client'

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Lecturecard from '@/app/components/LectureCard';
import { toast } from 'sonner';
import Loading from '@/app/components/Loading';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Rating from '@/app/components/Rating';
import defaultDP from '../../../../assets/defaultDP.png'
import CourseDetail from '@/app/components/CourseDetail';
import { FormatDate } from '@/utility/FormatDate';
import { Textarea } from '@/components/ui/textarea';
import deleteIcon from '../../../../assets/delete.png'
import SessionCard from '@/app/components/SessionCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from "framer-motion";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormMessageeFormMessage} from "@/components/ui/form"
    import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip" 
import material from '@/assets/material.png'
import LectureCard from '@/app/components/LectureCard';


const formSchema = z.object({
    recording: z.string().min(7, {
      message: "Invalid title",
    })    
})

const Course = () =>
{
    const [ course, setCourse ] = useState(null);
    const [ isLoading,setIsLoading ] = useState(true);
    const pathname = usePathname();
    const courseId = pathname.split('/')[3];
    const [ selectedFeedback, setSelectedFeedback] = useState(null);
    const [ userFeedback, setUserFeedback ] = useState('');
    const [activeTab, setActiveTab] = useState("sessions");
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: 
        {
            recording: "",
        }
    })

    const tabs = 
    [
        { id: "sessions", label: "Sessions", count: course?.lectures?.length },
        { id: "feedbacks", label: "Feedbacks", count: course?.feedbacks?.length} 
    ];

async function onSubmit(data) 
{
    try
    {
        setIsLoading(true)
        const url = '/api/course'
        const response = await axios.post(url, data);
        toast(response.data.message);
    }   
    catch(error)
    {
        console.log(error)
    }
    finally
    {
        setIsLoading(false)
    }
}

    useEffect(()=>
    {
       getCourse();
    },[])

    const getCourse = async () =>
    {
        try
        {
            const url = `/api/course/${courseId}`
            const response = await axios.get(url);
            setCourse(response.data);
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

    const handleUpdate = async (id, type) =>
    {
        try
        {
            const feedbackDetails = { comment: userFeedback, type, courseId: course._id}
            const url = `/api/feedback/${id}`
            const response = await axios.put(url, feedbackDetails)
            toast.success(response.data.message)
            getCourse();
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    const handleDelete = async (id) =>
    {
        try
        {
            const url = `/api/feedback/${id}`
            const response = await axios.delete(url, { courseId: course._id})
            toast.success(response.data.message);
            // getCourse()
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    if(isLoading)
        return <Loading/>

    return(
        <div className='space-y-4 md:text-sm text-xs leading-relaxed'>

            <div className='flex flex-col text-sm md:text-base h-[50vh] rounded-xl text-white justify-center items-center relative'  style={{backgroundImage: course.id === 'cams' ? "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)" : "radial-gradient(164.75% 100% at 50% 0, #834155 0, #3f172a 98.73%)"}}>
                <Image className='object-cover rounded-xl h-48 w-fit' src={course.imageURL} alt={course.title} height={100} width={100}/>
                <div className='md:text-xl md:bottom-12 text-lg absolute bottom-4 px-8 w-full text-center space-y-2 mb-2 z-50'>
                    <p className='font-semibold'>{course.title}</p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
            {tabs.map((tab) => 
            (
                <div key={tab.id} className="flex gap-2 relative">
                    <button className={`w-full flex flex-col justify-between items-center p-4 space-y-2 relative pl-6 rounded-lg transition-all duration-300 ${activeTab === tab.id ? "bg-yellow-400" : "bg-neutral-100 hover:bg-gray-200"}`} onClick={() => setActiveTab(tab.id)}>
                        <p className="font-semibold md:text-base text-sm">{tab.label}</p>
                        <p className="">{tab.count}</p>
                    </button>
                </div>))
            }
            </div>

            {activeTab === 'sessions' && 
            <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                {course.lectures.map((lecture, index) => 
                (
                    <LectureCard lecture={lecture} index={index} key={lecture._id} course={course}/>
                ))}
            </div>}

            {activeTab === 'feedbacks' &&
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
            {course.feedbacks.map((feed)=>
            (
                <Card key={feed._id} className='p-5 bg-neutral-50 flex justify-between items-center relative'>
                    <div className='flex items-center gap-2'>
                        <Image className="h-8 w-8 object-cover rounded-full object-top" src={feed.user?.imageURL ? feed.user?.imageURL  : defaultDP } alt='user' width={100} height={100}/>
                        <p className="">{feed.user.name}</p>
                    </div>
                    <div className="">
                        <Dialog open={selectedFeedback === feed._id} onOpenChange={()=> setSelectedFeedback(null)}>
                            
                            <div className='flex items-center gap-3' >
                                <Button className='h-6' 
                                onClick={()=> 
                                {
                                    setUserFeedback(feed.comment)
                                    setSelectedFeedback(feed._id)
                                }}>Edit</Button>
                                
                            </div>

                            <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit feedback</DialogTitle>
                                <DialogDescription>
                                Feedback submitted on {FormatDate(feed.updatedAt)}
                                </DialogDescription>
                            </DialogHeader>
                                <div className='space-y-1 flex flex-col items-center'>
                                <p className="text-sm font-semibold">{feed.user.name}</p>
                                <Rating value={feed.rating}/>
                                </div>
                                <Textarea className='p-2 min-h-36' value={userFeedback} onChange={(e)=> setUserFeedback(e.target.value)}/>
                                <div className='grid grid-cols-2 gap-2'>
                                    <Button onClick={()=> handleUpdate(feed._id, "edit")}>Update</Button>
                                    <Button variant="outline" onClick={()=> handleUpdate(feed._id, "delete")}>Delete</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card> 
            ))}
            </div>}
        </div>
    )
}

export default Course
