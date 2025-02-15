'use client'

import { useEffect, useState } from 'react';
import axios from "axios";
import { useParams, useRouter } from 'next/navigation';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import Loading from '@/app/components/Loading';
import CourseDetail from '@/app/components/CourseDetail';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Slash } from "lucide-react"

const Course = () =>
{
    const [ course, setCourse ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { courseId } = useParams();
    const router = useRouter();
    
    useEffect(()=>
    {
        getCourses();
    },[]);

    const getCourses = async () =>
    {
        try
        {
            const url = `/api/course/${courseId}`
            const response = await axios.get(url);
            setCourse(response.data);
        }
        catch(error)
        {
            console.log(error)
        }
        finally
        {
            setIsLoading(false);
        }
    }

    if(isLoading)
        return <Loading/>

    return(
        <div className='mt-12'>
            <Header/>
            <div className='flex flex-col gap-4 lg:px-[10vw] px-[5vw] py-12 md:text-sm text-xs'>
            {/* <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                    <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                    <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/courses/${course.id}`}>{course.id.toUpperCase()}</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb> */}
            <div>
                <CourseDetail course={course} level='visitor'/>
            </div>
            </div>
            
            <Footer/>
        </div>
    )
    
}

export default Course