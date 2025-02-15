'use client'

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import lectureIcon from '../../../../../assets/lecture.png'
import Loading from '@/app/components/Loading';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Video } from 'lucide-react';

const Page = () =>
{
    const [ lecture, setLecture ] = useState(null);
    const [ isLoading,setIsLoading ] = useState(true);
    const params = useSearchParams();
    const id = params.get('id');
    const lectureId = params.get('lectureId');
    const course = params.get('course');
    const [ url, setUrl ] = useState('')
    const path = usePathname();
    const { data, status } = useSession();
    const [ batchData, setBatchData ] = useState(null);
    const router = useRouter();

    useEffect(()=>
    {
        getLecture();
    },[])

    const getLecture = async () =>
    {
        try
        {
            const url = `/api/lecture/${lectureId}`
            const response = await axios.get(url);
            const videoId = response.data.recording.split("v=")[1];
            const embedUrl = response.data.recording;
            setUrl(embedUrl)
            setLecture(response.data);
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
        <div className='flex flex-col gap-4 space-y-2 md:text-base text-sm'>
            <h1 className='text-xl font-semibold'>{course.toUpperCase() +' > '} Lecture {id}</h1>
            <div className='rounded-lg  bg-neutral-100'>                
                <div className='flex rounded-lg items-center gap-2 p-6 text-white' style={{backgroundImage:"radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                    <Video size={20} className="text-neutral-50"/>
                    <h1 className='text-base font-semibold'>{lecture.title}</h1>
                </div>
                <div className='space-y-4 p-6 text-sm'>
                {lecture.modules.map((module,index)=>
                (
                    <p key={index}>{module}</p>
                ))}
                </div>
            </div>
            <iframe className='lg:w-[100%] lg:h-[60vh] h-[100%] w-[100%] rounded shadow-lg' width="560" height="315" src={url} title={lecture.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
    )
}

const Lecture = () =>
{
    return(
        <Suspense fallback={<Loading/>}>
            <Page/>
        </Suspense>
    )
}

export default Lecture
