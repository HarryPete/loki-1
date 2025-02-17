'use client'

import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
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
            setGraduates(response.data)
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

    console.log(graduates)

    if(isLoading)
        return <Loading/>

    return(
        <div className="space-y-4">
            <GraduationForm newGrad={newGrad} setNewGrad={setNewGrad} getGrads={getGrads}/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {graduates.map((graduate)=>
            (
                <Link href={`/admin/graduates/${graduate.month +'-' +graduate.year}?graduationId=${graduate._id}`} key={graduate._id}>
                    <Card className='space-y-4 p-4'>
                    <div className="relative h-48 rounded">
                        <Image src='https://cdn.pixabay.com/photo/2020/09/13/20/28/graduate-5569301_1280.png' className="w-full rounded object-cover" alt='graduate' layout="fill"/>
                    </div>
                    <p className="text-sm font-semibold">{graduate.month +' ' +graduate.year}</p>
                    </Card>
                </Link>
            ))}
            </div>
        </div>
    )
}

export default Graduates