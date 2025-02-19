'use client'

import Loading from "@/app/components/Loading"
import { Card } from "@/components/ui/card"
import axios from "axios"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { toast } from "sonner"
import correct from '../../../../assets/correct.png'
import editIcon from '../../../../assets/edit-dark.png'
import deleteIcon from '../../../../assets/delete-dark.png'
import Image from "next/image"
import { Button } from "@/components/ui/button"

const Page = () =>
{
    const [ mock, setMock ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true)
    const params = useSearchParams();
    const mockId = params.get('mockId');
    const pathname = usePathname();
    const router = useRouter();

    useEffect(()=>
    {
        getMock();
    },[])

    const getMock = async () =>
    {
        try
        {
            const url = `/api/quiz/${mockId}`
            const response = await axios.get(url);
            setMock(response.data);
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
        <div className="space-y-4">
            <div className="flex justify-between items-start text-white p-6 rounded-xl" style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <div className="space-y-2">
                    <h1 className="font-semibold">Mock Test Preview</h1>
                    <p className="text-xs">Set {mock.title.split('-')[0][0]} • {mock.title.split('-')[1]} • {mock.reference.length} Questions</p>
                </div>
                <Button className='h-6 text-sm' onClick={()=> router.push(`${pathname}/edit?mockId=${mock._id}`)}>Edit</Button>
            </div>
            <div className="space-y-6">
            {mock.reference.map((data, index)=>
            (
                <Card key={index} className='p-4 text-sm space-y-2 bg-neutral-50'>
                    <h1 className="font-semibold leading-relaxed p-2">Question {index+1}</h1>
                    <h1 className="font-semibold leading-relaxed px-2">{data.question}</h1>
                    {mock.reference[index]?.extendedQuestion?.length>0 && 
                    <div className="font-semibold leading-loose pt-1">
                    {mock.reference[index]?.extendedQuestion.map((sentence,index)=>
                    (
                        <p className='font-medium px-2' key={index}>{index+1 +'. '  +sentence}</p>
                    ))}
                    </div>}
                    <div className="space-y-2 pt-2">
                        {data.options.map((opt, ind)=>
                        (
                            <div key={ind} className={`flex items-center gap-1 px-3`}>
                                <p className="font-semibold w-4">{ind+1}.</p>
                                <div className={`mx-3 ${opt.isCorrect && 'bg-neutral-200 rounded mx-0 p-3'} leading-loose w-full py-3 rounded flex items-start justify-between gap-4`}>
                                    <p>{opt.option}</p>
                                    {opt.isCorrect && <Image className="h-5 w-5" src={correct} alt='correct'/>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <div className="flex gap-4 p-2 border-t pt-5 text-gray-400">
                        <div className="flex items-center gap-1 cursor-pointer hover:scale-105">
                            <Image className="h-4 w-fit" src={editIcon} alt='edit'/>
                            <span>Edit</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:scale-105">
                            <Image className="h-4 w-fit" src={deleteIcon} alt='delete'/>
                            <span>Delete</span>
                        </div>
                    </div> */}
                </Card>
            ))}
            </div>
        </div>
    )
}

const Mock = () =>
{
    return(
        <Suspense fallback={<Loading/>}>
            <Page/>
        </Suspense>
    )
}

export default Mock