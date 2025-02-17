'use client'

import axios from "axios"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import Loading from "@/app/components/Loading"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import mockIcon from '../../../assets/mock.png'
import deleteIcon from '../../../assets/delete.png'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

const Page = () =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ mocks, setMocks ] = useState(null);

    const router = useRouter();
 
    useEffect(()=>
    {
      getMocks();
    },[])

    const getMocks = async () =>
    {
        try
        {
            const url = `/api/quiz`
            const response = await axios.get(url);
            setMocks(response.data);
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

    const deleteMock = async (e, quizId) =>
    {
      e.preventDefault();

      try
      {
        const url = `/api/quiz/${quizId}`
        const response = await axios.delete(url);
        toast.success(response.data.message);
        getMocks();
      }
      catch(error)
      {
        toast.error(error.message)
      }
    } 
    
    if(isLoading)
        return <Loading/>

    return (
      <div className="space-y-4">
        <Button className='text-xs' onClick={()=> router.push(`/admin/mock-tests/create`)}>Create Mock</Button>
        <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-4">
        {mocks.map((mock)=>
        (
          <Link key={mock._id} href={`/admin/mock-tests/${mock.title}?mockId=${mock._id}`}>
            <Card className='p-4 space-y-4 bg-neutral-50 flex flex-col items-center relative'>
              <h1 className="font-semibold text-sm">{mock.title.split('-')[1]}</h1>
              <Image className="h-10 w-fit" src={mockIcon} alt='icon'/>
              <span className="text-sm">Set {mock.title.split('-')[0][0]}</span>
              {/* <Image onClick={(e)=> deleteMock(e, mock._id)} className="h-6 w-fit absolute top-2 p-1 bg-gray-100 rounded-full shadow-md right-4" src={deleteIcon} alt="icon"/> */}
            </Card>
          </Link>
        ))}
      </div>
      </div>
  )
}

export default Page


