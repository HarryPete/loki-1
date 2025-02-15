'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Slash } from "lucide-react"

const Courses = () =>
{
    const [ courses, setCourses ] = useState(null);
    const  [ isLoading, setIsLoading ] = useState(true);    

    useEffect(()=>
    {
        getCourses();
    },[])

    const getCourses = async () =>
    {
        try
        {
            const url = `/api/course`
            const response = await axios.get(url);
            setCourses(response.data);
        }
        catch(error)
        {
            conosle.error(error.message)
        }
        finally
        {
            setIsLoading(false);
        }
    }

    const removeCourse = async (id) =>
    {
        try
        {
            const url = `/api/course/${id}`
            const response = await axios.delete(url)
            setCourses(response.data)
        }
        catch(error)
        {
            console.log(error)
        }
    }

    if(isLoading)
        return <Loading/>
    

    return(
        <div className='mt-12'>
            <Header/>

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
                        <BreadcrumbLink href="/courses">Courses</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb> */}

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {courses?.map((course) =>
            (
                <CourseCard level="user" key={course._id} course={course} removeCourse={removeCourse}/>
            ))}
            </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Courses