import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'sonner';

const options = { year: 'numeric', month: 'long', day: 'numeric' };
export const pendingSessions = (sessions) =>
{
    return sessions.filter((session) => session.status === 'Upcoming').length
}

export const sprintProgress = (sessions, mocks) =>
{
    const sessionCompleted = sessions.filter((session) => session.status === 'Completed').length 
    const sessionProgress = (sessionCompleted/sessions.length)*70
    const mockProgress = (mocks.length/6)*30
    const totalProgress = sessionProgress + mockProgress
    return totalProgress
}

const Progress = ({batchData, getBatch}) =>
{
    console.log(batchData)

    const updateBatch = async (enrollmentStatus, access, type)=>
    {
        try
        {
            const batchDetails = type === "access" ? { access, type } : { enrollmentStatus, type, courseId: batchData.course._id }
            const url = `/api/batch/${batchData._id}`
            const response = await axios.put(url, batchDetails)
            toast.success(response.data.message)
            getBatch()
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }
    
    return(
        <div className='space-y-4'>
            <div className='flex flex-col text-sm md:text-base h-[50vh] rounded-xl text-white justify-center items-center relative' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <Image className='object-cover rounded-xl h-48 w-fit' src={batchData.course.imageURL} alt={batchData.course.title} height={100} width={100}/>
                <div className='text-3xl absolute bottom-2 left-4 space-y-2 mb-2 z-50'>
                    <p className='font-semibold'>{batchData.title.split('-')[1]}</p>
                    {/* <p className='bg-gray-700 p-2 rounded z-50 text-xs'>{new Date(batchData.startDate).toLocaleDateString('en-US', options)} - {new Date(batchData.endDate).toLocaleDateString('en-US', options)}</p> */}
                </div>
                <div className="flex justify-between gap-4 absolute top-6 right-4">
                    <div className="flex items-center gap-2 justify-between">
                        <Label>Batch access</Label>
                        <Switch checked={batchData.access} onCheckedChange={()=> updateBatch(batchData.enrollmentStatus, !batchData.access, "access")}/>
                    </div>
                    <div className="flex items-center gap-2 justify-between">
                        <Label>Enrollment status</Label>
                        <Switch checked={batchData.enrollmentStatus}  onCheckedChange={()=> updateBatch(!batchData.enrollmentStatus, batchData.access, "enrollmentStatus")}/>
                    </div>
                </div>
            </div>
            
            {/* <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4'>
                <div className='p-4 text-center text-sm space-y-1'>
                    <p>Completion</p>
                    <h1 className='text-xl font-semibold'>{sprintProgress(batchData.sessions, batchData.mocks).toFixed(2)}%</h1>
                </div>
                <div className='p-4 text-center text-sm space-y-1'>
                    <p>Sessions pending</p>
                    <h1 className='text-xl font-semibold'>{pendingSessions(batchData.sessions)}</h1>          
                </div>
                <div className='p-4 text-center text-sm space-y-1'>
                    <p>Enrollments</p>
                    <h1 className='text-xl font-semibold'>{batchData.enrollments.length}</h1>
                </div>
                <div className='p-4 text-center text-sm space-y-1'>
                    <h1 className='text-xl font-semibold'>{batchData.mocks.length}</h1>
                    <p>Mocks</p>
                </div>
            </div> */}
        </div>
    )
}

export default Progress