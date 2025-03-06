import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import defaultDP from '@/assets/defaultDP.png'
import trophy from '@/assets/trophy.png'
import { toPng } from "html-to-image";

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
    const [ showLeaderBoard, setShowLeaderBoard ] = useState(false);
    const [ userScores, setUserScores ] = useState(null);
    const [ questions, setQuestions ] = useState(null);
    const divRef = useRef(null);

    const downloadReport = 
        useCallback(() => 
        {   
            if(divRef.current === null) 
                return
    
            toPng(divRef.current, { cacheBust: true, })
            .then((dataUrl) => 
            {
                const link = document.createElement('a')
                link.download = 'fintAML.png'
                link.href = dataUrl
                link.click()
            })
            .catch((err) => 
            {
                toast.error(err)
            })
    
    }, [divRef])

    useEffect(()=>
    {
        const users = []
        batchData.enrollments.map((enrollment)=>
        {
            const scores = enrollment.mocks.reduce((acc, mock)=> acc + (mock?.score ? mock.score : 0),0)
            const updatedData = {...enrollment, scores}
            users.push(updatedData)
        })

        const totalQuestions = batchData.mocks.reduce((acc, mock)=> acc + mock.quiz.reference.length,0);
        setQuestions(totalQuestions);
        const sortedData = users.sort((a,b)=> b.scores - a.scores)
        setUserScores(sortedData);

    },[])

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
                <Dialog open={showLeaderBoard} onOpenChange={setShowLeaderBoard} r>
                <DialogTrigger asChild>
                    <Button className='h-8 text-xs absolute bottom-6 right-4'>Leaderboard</Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-[600px] max-w-[375px]" ref={divRef}>
                    <DialogHeader>
                        <DialogTitle>Leaderboard • {batchData.title}</DialogTitle>
                        <DialogDescription>
                        {batchData.mocks.length} Mocks - {questions} Questions
                        </DialogDescription>
                    </DialogHeader>
                    {/* <Button className='w-fit absolute top-6 right-8 h-6 text-xs' variant='outline' onClick={downloadReport}>Download</Button> */}
                    {userScores && 
                    <div className='max-h-[80vh] overflow-y-scroll space-y-3 pr-4'>
                    
                    {userScores.map((enrollment, index)=>
                    (
                        <div key={enrollment._id} className='flex items-center gap-4'>
                             {(index === 0 || index === 1 || index === 2) ? <Image className='h-6 w-6' src={trophy} alt='Trophy'/> : <p className='text-base text-center w-6'>{index+1}</p>}
                            <Card className={`w-full ${(index === 0 || index === 1 || index === 2) ? `bg-yellow-400` : enrollment.scores === 0 ? 'bg-red-500 text-white' : 'bg-neutral-50'} p-3 space-y-2 md:text-sm text-xs gap-4 `}>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    
                                    <Image className={`h-10 w-10 bg-white rounded-full object-cover object-top p-2`} src={enrollment?.user?.imageURL ? enrollment?.user?.imageURL : defaultDP} alt={enrollment.user.name} width={100} height={100}/>
                                    <p>{enrollment.user.name}</p>
                                </div>
                                <p>{enrollment.scores}</p>
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className={`${enrollment.scores === 0 ? 'text-muted' : 'text-muted-foreground'} flex items-center justify-end text-xs gap-2`}>
                                    <p>{enrollment.mocks.length} Mocks</p> 
                                    <p>|</p>   
                                    <p className='font-semibold'>{(enrollment.scores*100/questions).toFixed(2)}%</p>
                                </div>
                                <div className='flex space-x-2'>
                                    {enrollment.mocks.map((mock)=>
                                    (
                                        <p className='' key={mock._id}>{mock?.score ?? 0}</p>
                                    ))}
                                </div>
                            </div>
                            </Card>
                        </div>
                    ))}
                    </div>}
                </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default Progress