'use client'

import { useEffect, useState } from 'react'
import BillingCard from '../components/BillingCard'
import Footer from '../components/Footer'
import Header from '../components/Header'
import axios from 'axios'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import Loading from '../components/Loading'
import { FormatDate } from '@/utility/FormatDate'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Slash } from "lucide-react"
import { Button } from '@/components/ui/button'

const Checkout = () =>
{
    const [ course, setCourse ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { data, status } = useSession();
    const [ batches, setBatches ] = useState(null);
    const [ selectedBatch, setSelectedBatch ] = useState(false);
    const [ restrictUser, setRestrictUser ] = useState(false);

    useEffect(()=>
    {
        if(status === 'unauthenticated')
        {
            signIn(null, {callbackUrl: '/checkout'})
        }
    },[status])

    useEffect(()=>
    {
        const courseId = localStorage.getItem('selectedCourse')
        if(courseId)
            getCourse(courseId);
    },[])

    useEffect(()=>
    {
        if(batches && status === 'authenticated')
        {
            const isUser = batches.map((batch)=> batch.enrollments).reduce((acc, cur) =>  [...acc, ...cur],[]).find((enrollment)=> enrollment.user === data.user.id)
            if(isUser)
                setRestrictUser(true)
        }
    },[batches, status])

    const getCourse = async (courseId) =>
    {
        try
        {
            const url = `/api/course/${courseId}`
            const response = await axios.get(url);
            const completedBatches = response.data.batches;

            setBatches(completedBatches);
            setCourse(response.data);
        }
        catch(error)
        {
            toast.error(error.message);
            setIsLoading(false);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    const clearCart = () =>
    {
        localStorage.removeItem('selectedCourse');
        setCourse(null);
    }

    if(isLoading)
        return <Loading/>

    // if(restrictUser)
    //     return(
    //     <div className=''>
    //         <p>You have already enrolled</p>
    //         <Link href='/dashboard'>Go to Dashboard</Link>
    //     </div>)

    return(
        <div className='md:text-base text-sm mt-12'>
            <Header/>
            {(course ? 
            <div className='lg:px-[10vw] px-[5vw] py-12 flex flex-col gap-4'>
                {/* <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                    <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
                </Breadcrumb> */}
                <h1 className='md:3xl text-xl font-bold' style={{color:'var(--primary-bg)'}}>Your Cart</h1>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                
                 
                <div className='flex flex-col gap-4'>
                    <div className='flex justify-between items-center gap-4 p-4 rounded-xl bg-neutral-50 shadow-md'>
                        <div className='flex gap-4 items-center'>
                            <Image className='h-16 w-16 rounded-full object-cover' src={course.imageURL} alt={course.id} width={150} height={150} style={{backgroundColor: 'var(--primary-color)'}}/>
                            <p className='font-semibold md:text-sm text-xs'>{course.title}</p>
                        </div>
                        <Button onClick={clearCart} className='text-xs'>Remove</Button>
                    </div> 
                    <Select onValueChange={setSelectedBatch}>
                        <SelectTrigger className="w-full h-16 border-none shadow-md bg-neutral-50">
                            <SelectValue placeholder="Choose Batch" />
                        </SelectTrigger>
                        <SelectContent>
                        {batches.map((batch)=>
                        (
                            <SelectItem className='h-14' value={batch._id} key={batch._id}>{batch.title +' / ' +FormatDate(batch.startDate) +' - '+ FormatDate(batch.endDate)}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                </div>

                <BillingCard course={course} selectedBatch={selectedBatch}/>              
                </div> 
            </div>
            : <div className='h-[70vh] flex items-center justify-center text-5xl font-bold bg-white text-gray-200' style={{color: 'var(--action-color)'}}>Your cart is empty</div>)}
            <Footer/>
        </div>
    )
}

export default Checkout