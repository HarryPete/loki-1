'use client'

import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toPng } from "html-to-image";
import React, { Suspense, useEffect, useRef, useState } from "react";
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

function normalizeCountry(str) {
  if (!str) return "";
  return str
    .trim()                // removes leading & trailing spaces
    .toLowerCase()         // normalize case
    .replace(/\s+/g, " ")  // remove extra spaces between words
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalize each word
}


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
            const graduationData = response.data
            const groupedByCountry = graduationData.enrollments.reduce(
            (acc, enrollment) => {
                const country = normalizeCountry(enrollment.user?.country);

                if (!acc[country]) acc[country] = [];
                acc[country].push(enrollment);

                return acc;
            },
            {}
            );

            // 2️⃣ Order by country name and flatten
            const orderedEnrollments = Object.entries(groupedByCountry)
            .sort(([a], [b]) => a.localeCompare(b)) // ✅ sort by country
            .flatMap(([, enrollments]) => enrollments);

            // 3️⃣ Keep original data shape
            graduationData.enrollments = orderedEnrollments;
            console.log(graduationData)

            setGraduates(graduationData);
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
            

            <div className="w-full grid grid-cols-2 p-3 text-white">
                <div className="flex justify-start items-center gap-3">
                    <Image className="h-10 w-fit" src={logo} alt='FINTS AML'/>
                </div>
                
                <div className="flex justify-end items-center gap-2">
                    <p className="text-sm text-end">{graduates.course.id.toUpperCase()} Results - {graduates.month +', ' +graduates.year}</p>
                    <Image className="h-12 w-fit" src={trophy} alt='trophy'/>
                </div>
                
                
            </div>
            <Table className='bg-white'>
                <TableHeader className=''>
                <TableRow className='text-bas font-bold bg-yellow-400 ' >
                    <TableHead className='text-center p-4 font-semibold' style={{color: 'var(--primary-bg)'}}>Sr. No.</TableHead>
                    <TableHead className='text-center p-4 font-semibold' style={{color: 'var(--primary-bg)'}}>Graduates</TableHead>
                    <TableHead className='text-center p-4 font-semibold' style={{color: 'var(--primary-bg)'}}>Country</TableHead>
                    <TableHead className='text-center p-4 font-semibold' style={{color: 'var(--primary-bg)'}}>Sr. No.</TableHead>
                    <TableHead className='text-center p-4 font-semibold' style={{color: 'var(--primary-bg)'}}>Graduates</TableHead>
                    <TableHead className='text-center p-4 font-semibold' style={{color: 'var(--primary-bg)'}}>Country</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {graduates?.enrollments?.map((_, index) => {
                    if (index % 2 !== 0) return null;

                    const left = graduates.enrollments[index];
                    const right = graduates.enrollments[index + 1];

                    return (
                    <TableRow key={left._id} className="text-center">
                        {/* LEFT */}
                        <TableCell className="p-3">{index + 1}</TableCell>
                        <TableCell className="p-3">{normalizeCountry(left?.user?.name)}</TableCell>
                        <TableCell className="p-3">{normalizeCountry(left?.user?.country)}</TableCell>

                        {/* RIGHT */}
                        <TableCell className="p-3">{right ? index + 2 : "-"}</TableCell>
                        <TableCell className="p-3">{normalizeCountry(right?.user?.name) ?? "-"}</TableCell>
                        <TableCell className="p-3">{normalizeCountry(right?.user?.country )?? "-"}</TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            <p className="text-sm text-center text-gray-400 pt-4">www.fintsaml.com</p>
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