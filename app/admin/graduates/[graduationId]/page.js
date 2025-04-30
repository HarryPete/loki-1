'use client'

import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toPng } from "html-to-image";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import logo from '../../../../assets/logo.png'
import trophy from '../../../../assets/trophy.png'
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const Page = () =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ graduates, setGraduates ] = useState(null);   
    const params = useSearchParams();
    const graduationId = params.get('graduationId')
    const divRef = useRef(null);

    useEffect(()=>
    {
      getGraduates();
    },[])

    const getGraduates = async ()=>
    {
        try
        {
            const url = `/api/graduates/${graduationId}`;
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

    const downloadScores = () => 
    {   
        // if(divRef.current === null) 
        //     return

        console.log('het')

        toPng(divRef.current, { cacheBust: true, })
        .then((dataUrl) => {
            const link = document.createElement('a')
            link.download = `Graduates.png`
            link.href = dataUrl
            link.click()
        })
        .catch((err) => 
        {
            console.log(err)
        })
    }

    if(isLoading)
        return <Loading/>

    return(
            
        <div className="space-y-2">
            
            <Button onClick={downloadScores}>Download</Button>
            <div ref={divRef} className="bg-white p-12 space-y-4 flex flex-col items-center" style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
            

            <div className="w-full grid grid-cols-2 p-4 text-white">
                <div className="flex justify-start items-center gap-4">
                    <Image className="h-10 w-fit" src={logo} alt='FINTS AML'/>
                    <p className="text-sm">www.fintsaml.com</p>
                </div>
                
                <div className="flex justify-end items-center gap-2">
                    <p className="text-sm text-end">{graduates.course.id.toUpperCase()} Results - {graduates.month +', ' +graduates.year}</p>
                    <Image className="h-12 w-fit" src={trophy} alt='trophy'/>
                </div>
                
                
            </div>
            <Table className='bg-white'>
                <TableHeader className=''>
                <TableRow className='text-bas font-bold bg-yellow-400 ' >
                    <TableHead className='text-center p-5 font-semibold' style={{color: 'var(--primary-bg)'}}>Sr. No.</TableHead>
                    <TableHead className='text-center p-5 font-semibold' style={{color: 'var(--primary-bg)'}}>Graduates</TableHead>
                    <TableHead className='text-center p-5 font-semibold' style={{color: 'var(--primary-bg)'}}>Country</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {graduates?.enrollments?.map((enrollment, index)=>
                (
                    <TableRow className='text-center' key={enrollment._id}>
                        <TableCell className='p-4 text-sm'>{index+1}</TableCell>                        
                        <TableCell className='p-4 text-sm'>{enrollment.user?.name}</TableCell>
                        <TableCell className='p-4 text-sm'>{enrollment.user?.country}</TableCell>
                    </TableRow>
                ))}  
                </TableBody>
            </Table>
            </div>
        </div>
    )
}

const Graduates= () =>
{
    return(
        <Suspense fallback={<Loading/>}>
            <Page/>
        </Suspense>
    )
}

export default Graduates