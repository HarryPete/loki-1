
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FormatDate } from '@/utility/FormatDate';
import deleteIcon from '@/assets/delete.png'
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

const BatchCard = ({type, level, enrollment, batch, participants, removeBatch, batchId}) =>
{
    const router = useRouter();
    const pathname = usePathname();

    const deleteBatch = async () =>
    {
        try
        {
            const url = `/api/batch/${batch._id}`
            await axios.delete(url)
        }
        catch(error)
        {
            toast(error)
        }
    }

    const checkAccess = () =>
    {
        if(batch.access)
            return router.push(`/course/${batch.course.id}?eId=${enrollment._id}`)
        else
            toast('Access Denied')
    }

    return(
        <div className='space-y-2 relative cursor-pointer ' onClick={()=>  {level === 'admin' ? (type === 'batch' ? router.push(`/admin/batches/${batch.title}`) : `${pathname}/${batchId}`) : checkAccess()}}>
            <div className='rounded-xl h-56 p-4 flex flex-col justify-center items-center shadow-md gap-1' style={{backgroundImage:"radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <Image className='rounded-full object-cover h-28' src={batch.course.imageURL} alt={batch.title} height={100} width={100}/>
                {level === 'admin' ? <h1  className='text-neutral-100 font-semibold'>{batch.title.split('-')[1]}</h1> : <p className='bg-gray-300 p-1 rounded text-xs '>{FormatDate(batch.startDate) +' - ' +FormatDate(batch.endDate)}</p>}
            </div>
        </div>
    )
}

export default BatchCard