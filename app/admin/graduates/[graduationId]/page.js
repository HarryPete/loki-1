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
        if(divRef.current === null) 
            return

        toPng(divRef.current, { cacheBust: true, })
        .then((dataUrl) => {
            const link = document.createElement('a')
            link.download = `${graduates[0]._id}.png`
            link.href = dataUrl
            link.click()
        })
        .catch((err) => 
        {
            console.log(err)
        })
    }

    console.log(graduates);

    if(isLoading)
        return <Loading/>

    return(
            
        <div className="space-y-2">
            <div ref={divRef} className="bg-white p-12 space-y-4 flex flex-col items-center" style={{backgroundColor: 'var(--primary-bg)'}}>
            

            <div className="w-full flex justify-between items-center p-4 text-white">
                <div className="flex items-center gap-4">
                <Image className="h-12 w-fit" src={logo} alt='FINTS AML'/>
                <p>www.fintsaml.com</p>
                </div>
                <Image className="h-16 w-fit" src={trophy} alt='trophy'/>
                <div className="space-y-2">
                
                <p className="text-base font-semibold">CAMS Result - {graduates.month +', ' +graduates.year}</p>
                </div>
            </div>
            <Table className='bg-white rounded'>
                <TableHeader className='rounded'>
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
            <Button onClick={downloadScores}>Download</Button>
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