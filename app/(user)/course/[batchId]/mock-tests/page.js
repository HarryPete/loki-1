'use client'

import axios from "axios";
import { useSession } from "next-auth/react"
import Image from 'next/image';
import locked from '../../../../../assets/locked.png'
import pendingIcon from '../../../../../assets/pendingIcon.png'
import correctIcon from '../../../../../assets/correct.png'
import { useParams, usebatchId, useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from 'sonner';
import Link from 'next/link';
import Loading from '@/app/components/Loading';
import ProgressBar from '@/app/components/ProgressBar';
import Lecturecard from '@/app/components/LectureCard';
import mockIcon from '../../../../../assets/mock.png'
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import LoadingMini from "@/app/components/LoadingMini";

export const pendingSessions = (sessions) =>
{
    return sessions.filter((session) => session.status === 'Upcoming').length
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
    const [ isLoading, setIsLoading ] = useState(true)
    const [ cardLoading, setCardloading ] = useState(false);
    const params = useSearchParams();
    const enrolmentId = params.get('eId');
    const router = useRouter();
    const [ pendingTests, setPendingTests ] = useState(null);
    const pathname = usePathname();
    
    const getEnrollment = async () =>
    {
        try
        {
            const url = `/api/enrollment/${enrolmentId}`
            const response = await axios.get(url);
            if(!response.data.batch.access || !response.data.access)
            {
                router.push('/dashboard')
                toast('Access Denied')
            }
            setEnrollment(response.data)
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


    const handleMock = async (mock) =>
    {
        try
        {
            setIsLoading(true);
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
            setIsLoading(false);
        }
    }

    const handleRetake = async (e, id) =>
    {
        e.preventDefault();

        try
        {
            setCardloading(true)
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
            setCardloading(false)
        }
    }

    if(status === 'loading' || isLoading)
    return(
        <Loading/>   
    )

    return(
        <div className="space-y-6">
            {enrollment.batch.mocks.length === 0 ?
            <div className="md:text-lg text-base font-semibold text-center">
                No Mocks Available
            </div>
            :<div className="space-y-4 pb-4">
            {(enrollment.batch.mocks.length > enrollment.mocks.length) && <h1 className="text-base font-semibold">Weekly Mock Test</h1>}
                <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4">
                {enrollment.batch.mocks.map((data)=>
                (
                    <Card key={data._id} className='p-4 space-y-1 cursor-pointer' onClick={()=> handleMock(data)}>
                        <div className="flex justify-center items-center p-8 bg-gray-100 rounded">
                            <Image className='h-12 w-fit' src={mockIcon} alt='test'/>
                        </div>
                        {/* <div className='flex justify-between gap-4 items-center '>
                            
                            <Image className='h-5 w-fit' src={locked} alt={data.status}/>
                        </div> */}
                        <h1 className="text-center md:text-sm text-xs">Set {data.id}</h1>
                    </Card>
                )).slice(enrollment.mocks.length)}
                </div>
            </div>}
            {enrollment.mocks.length>0 && <div className="space-y-4">
            <h1 className="text-base font-semibold">Enrolled Mock Tests</h1>
                <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4">
                {enrollment.mocks.map((data, index)=>
                (
                    <Link key={data._id} href={data.status === 'Pending' ? `/mock-test?mockId=${data._id}` : `/review-mock-test?mockId=${data._id}`}>
                        <Card className='p-4 relative'>
                        {cardLoading ? <LoadingMini/> :
                        <div className="space-y-2">
                            <div className="flex flex-col justify-center items-center p-8 space-y-2 bg-gray-100 rounded">
                                <Image className='h-12 w-fit' src={mockIcon} alt='test'/>
                                {(enrollment.batch.mocks[index]?.status === 'Unlocked' && data?.status === 'Completed') && <Button className='h-6 text-xs' onClick={(e)=> handleRetake(e, data._id)}>Retake</Button>}
                            </div>
                            <div className='flex justify-between gap-4 items-center md:text-sm text-xs'>
                                <h1>Mock {index+1}</h1>
                                <Image className='h-5 w-fit' src={data.status === 'Completed' ? correctIcon : pendingIcon} alt={data.status}/>
                            </div>
                        </div>}
                        </Card>
                    </Link>
                ))}
            </div>
            </div>}
        </div>
    )
}

export default Page

