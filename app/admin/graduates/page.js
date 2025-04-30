'use client'

import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import graduationIcon from '@/assets/graduation.png'
import Link from "next/link";
import GraduationForm from "@/app/components/GraduationForm";
import { Card } from "@/components/ui/card";

const Graduates = () =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ graduates, setGraduates ] = useState(null);   
    const [ newGrad, setNewGrad ] = useState(false)

    useEffect(()=>
    {
        getGrads();
    },[])

    const getGrads = async ()=>
    {
        try
        {
            const url = '/api/graduates';
            const response = await axios.get(url);
            const graduationCourse = {};
            response.data.forEach((graduationBatch)=>
            {
                if(!graduationCourse[graduationBatch.course.id])
                    graduationCourse[graduationBatch.course.id] = [];
                graduationCourse[graduationBatch.course.id].push(graduationBatch);
            })
            setGraduates(graduationCourse)
        }
        catch(error)
        {
            toast(error.message)
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
            <GraduationForm newGrad={newGrad} setNewGrad={setNewGrad} getGrads={getGrads}/>
            <div className="space-y-8">
            {Object.keys(graduates).map((course)=>
            (
                <div className="space-y-4" key={course}>
                    <h1 className="font-semibold">{course.toUpperCase()}</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {graduates[course].map((graduate)=>
                    (
                        <Link href={`/admin/graduates/${graduate.month +'-' +graduate.year}?graduationId=${graduate._id}`} key={graduate._id}>
                            <Card className='space-y-4 p-6 bg-gray-50 flex flex-col items-center' style={{backgroundImage: course === 'cams' ? "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)" : "radial-gradient(164.75% 100% at 50% 0, #834155 0, #3f172a 98.73%)"}}>
                            <Image className='rounded-full object-cover h-20' src={graduationIcon} alt='graduation' height={60} width={60}/>
                            <p className="text-sm font-semibold text-white">{graduate.month +' ' +graduate.year}</p>
                            </Card>
                        </Link>
                    ))}
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default Graduates