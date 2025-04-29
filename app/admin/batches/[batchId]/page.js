'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './styles.module.css'
import { useParams, usePathname, useRouter } from 'next/navigation'
import ProgressDetails from '@/app/components/Progress'
import SessionCard from '@/app/components/SessionCard'
import Enrollment from '@/app/components/Enrollment'
import { toast } from 'sonner'
import Loading from '@/app/components/Loading'
import defaultDP from '../../../../assets/defaultDP.png'
import duplicateIcon from '../../../../assets/duplicate.png'
import removeIcon from '../../../../assets/remove.png'
import closeIcon from '../../../../assets/close-lg.png'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import ProfileDetails from '@/app/components/ProfileDetails'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { FormatDate } from '@/utility/FormatDate'
import { FormControl, FormItem, FormLabel } from '@/components/ui/form'
import UpdateDisplayPicture from '@/app/components/UpdateDisplayPicture'
import MockReport from '@/app/components/MockReport'
import LoadingMini from '@/app/components/LoadingMini'
import mockIcon from '@/assets/mock.png'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Book, Calendar, GroupIcon, Loader2, User, Video } from "lucide-react";

import { motion } from "framer-motion";
import { Progress } from '@radix-ui/react-progress'

export const completedSessions = (sessions, type='') =>
{
    if(!sessions)
        return
    
    const completed = sessions.filter((session) => session.status === 'Completed').length 
    if(type === 'count')
        return completed
    
    const progress = (completed/sessions.length)*100
    return progress
}

export const completedProfiles = (enrollments) =>
{
    if(!enrollments)
        return

    const completed = enrollments.filter((enrollment) => enrollment.user.isProfileComplete).length 
    return completed
}

const Batch = () =>
{
    const [ batch, setBatch ] = useState(null);
    const [ graduationBatches, setGraduationBatches ] = useState(null);
    const [ graduationBatch, setGraduationBatch ] = useState('')
    const [ activeAgenda, setActiveAgenda ] = useState(-1);
    const [ isLoading, setIsLoading ] = useState(true);
    const { batchId } = useParams();
    const [ editInfo, setEditInfo ] = useState(false)
    const [ editDP, setEditDP ] = useState(false)
    const [ duplicates, setDuplicates ] = useState([]);
    const [ removeDuplicates, setRemoveDuplicates ] = useState(false);
    const [ isButtonLoading, setIsButtonLoading ] = useState(false);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("sessions");
    const pathname = usePathname();
    const [ assignedMocks, setAssignedMocks ] = useState([]);

    const tabs = 
    [
        { id: "sessions", label: "Sessions", bg: 'bg-blue-400', completed: completedSessions(batch?.sessions, 'count'), total: batch?.sessions?.length, progress: completedSessions(batch?.sessions) },
        { id: "enrollments", label: "Enrollments", bg: 'bg-gray-400', completed: completedProfiles(batch?.enrollments), total: batch?.enrollments?.length, progress: completedProfiles(batch?.enrollments)*100/batch?.enrollments?.length },
        { id: "mocks", label: "Mocks", bg: 'bg-green-400', completed: batch?.mocks?.length, total: batch?.course?.mocks?.length, progress: batch?.mocks?.length*100/batch?.course?.mocks?.length}
    ];

    const findDuplicates = () => 
    {
        const userCounts = {};
    
        batch.enrollments.forEach(enrollment => {
          const userId = enrollment.user._id; 
          if (userCounts[userId]) {
            userCounts[userId] += 1;
          } else {
            userCounts[userId] = 1;
          }
        });
    
        const duplicateUserIds = Object.keys(userCounts).filter(userid => userCounts[userid] > 1);
        setDuplicates(duplicateUserIds); 
    };
   
    const getBatch = async () =>
    {
        try
        {
            const url = `/api/batch/${batchId}`
            const response = await axios.get(url);
            setBatch(response.data);

            if(assignedMocks.length > 0)
                return

            response.data.mocks.forEach((mock)=>
            {
                setAssignedMocks((prev)=> [...prev, mock.id])
            })
            getGraduationBatches();
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

    const getGraduationBatches = async () =>
    {
        try
        {
            const url = `/api/graduates`
            const response = await axios.get(url);
            setGraduationBatches(response.data);
        }
        catch(error)
        {
            toast.error(error.message);
        }
    }

    const updateGraduation = async (enrollmentId) =>
    {
        if(!graduationBatch)
            return toast.error('Graduation batch is required')

        try
        {
            setIsButtonLoading(true)
            const url = `/api/graduates/${graduationBatch}`
            const graduationDetails = { enrollmentId }
            const response = await axios.put(url, graduationDetails);
            toast.success(response.data.message);
            setOpenUserId(null);
            getBatch();
        }
        catch(error)
        {
            toast.error(error.message);
        }
        finally
        {
            setIsButtonLoading(false);
        }
    }

    useEffect(()=>
    {
       getBatch();
    },[])

     const updateSessionStatus = async (sessionId, status) =>
    {
        try
        {
            const updatedStatus = status === 'Upcoming' ? 'Completed' : 'Upcoming'
            const url = `/api/session/${sessionId}`
            await axios.put(url, {status : updatedStatus});
            toast(`Session updated to ${updatedStatus}`)
            getBatch();
        }
        catch(error)
        {
            toast(error.message)
        }
    }

    const [ openUserId, setOpenUserId ] = useState(null);

    const handleOpenDialog = (userId) => 
    {
        setOpenUserId(userId);
    };

    const handleCloseDialog = () => 
    {
        setOpenUserId(null);
    };

    const updateProfileStatus = async (userId, status) =>
    {
        try
        {
            const updates = { isProfileComplete : status }
            const url= `/api/user/${userId}`
            const response = await axios.put(url, updates)
            toast(response.data.message);
            getBatch()
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    const updateAccessStatus = async (enrollmentId, status) =>
    {
        try
        {
            const updates = { access : status }
            const url= `/api/enrollment/access/${enrollmentId}`
            const response = await axios.put(url, updates)
            toast(response.data.message);
            getBatch()
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    const handleDuplicates = async (enrollment) =>
    {
        try
        {
            const url = `/api/enrollment/${enrollment.user._id}`
            const response = await axios.put(url, {batchId: batch._id, enrollmentId:enrollment._id, type: "duplicates"});
            toast.success(response.data.message)
            getBatch();
            setRemoveDuplicates(false)
        }
        catch(error)
        {
            toast.error(error.message)
        }
    }

    const updateMock = async (mock, id, status="", type) =>
    {
      try
      {
          setIsLoading(true)
          const url = `/api/batch/${batch._id}`
          const batchDetails = { mock: {quiz:mock._id, id}, id, status, type }
          const response = await axios.put(url, batchDetails);
          toast.success(response.data.message);
          getBatch()
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

    const checkBatchIndex = (id) =>
    {
        const position = assignedMocks.findIndex(num => num === id);
        return position
    }

    console.log(batch)

    if(isLoading)
        return <Loading/>

    return(
        <div className='space-y-4 md:text-sm text-xs'>
            <div className='relative'>
            <ProgressDetails batchData={batch} level='admin' getBatch={getBatch}/>
            <Image className='fixed cursor-pointer text-xs bottom-4 right-4 h-10 w-fit p-2.5 bg-yellow-500 rounded-full'
                src={removeDuplicates ? closeIcon : duplicateIcon} alt='icon' onClick={()=>
                {
                    if(!removeDuplicates)
                    {
                        setRemoveDuplicates(true);
                        findDuplicates();
                    }
                    else
                    setRemoveDuplicates(false);
                }
            }/>
            </div>

            <div className="flex flex-col md:flex-row gap-4 text-sm ">
                <div className="w-full md:w-1/3 rounded-xl shadow-md p-8 h-fit space-y-6 md:sticky md:top-28 overflow-y-auto text-black bg-neutral-50">
                {tabs.map((tab) => 
                (
                    <div key={tab.id} className="flex gap-2 relative">
                    
                    {/* Animated Indicator */}
                    {activeTab === tab.id && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-[-2] w-2 h-full rounded-lg"
                        style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />)}

                    <button className={`w-full text-left space-y-2 relative p-2 pl-6 rounded-lg transition-all duration-300 ${activeTab === tab.id ? "" : "hover:bg-gray-200"}`} onClick={() => setActiveTab(tab.id)}>
                    <p className="font-medium">{tab.label}</p>
                    <Progress value={tab.progress} className="h-4 w-full bg-gray-300 rounded-full">
                        <motion.div
                        className={`${tab.bg} h-full rounded-full`}
                        initial={{ width: "0%" }}
                        animate={{ width: `${tab.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}/>
                    </Progress>

                    <div className="flex items-center justify-between text-xs">
                        <p>{tab.completed}/{tab.total}</p>
    
                        <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}>
                        {tab.progress.toFixed(2)}%
                    </motion.p>
                    </div>
                    </button>
                </div>))}

                <div className="text-xs flex justify-around gap-2">
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <Book size={16} />
                            <p>Course</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{batch.course.id.toUpperCase()}</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <GroupIcon size={16} />
                         <p>Batch</p>
                     </TooltipTrigger>
                        <TooltipContent>
                            <p>{batch.title}</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <Calendar size={16} />
                        <p>Duration</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{FormatDate(batch.startDate) +' - ' +FormatDate(batch.endDate)}</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger className="flex space-y-1 flex-col items-center">
                            <User size={16} />
                            <p>Mentor</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{batch.mentor.name}</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {activeTab === "sessions" && (
                <div className="space-y-3 w-full md:w-2/3">
                {batch.sessions.map((session, index) => 
                (
                    <SessionCard key={session._id} level="admin" session={session} index={index} updateSessionStatus={updateSessionStatus}/>
                ))}
            </div>)}

            {activeTab === "enrollments" && (
                <div className='grid grid-cols-1 gap-3 pb-8 w-full md:w-2/3 h-fit'>
            
                {batch.enrollments.length ? 
                batch.enrollments.map((enrollment)=>
                {                       
                    return(
                    <Card key={enrollment._id} className={`${removeDuplicates && duplicates.includes(enrollment.user._id) ? 'bg-red-500 text-white' : (enrollment.user.isProfileComplete ? 'bg-gray-100' : 'bg-red-100')} p-6 flex items-center gap-4 h-fit`}>
                    <Image className='h-6 w-6 object-cover object-top rounded-full' src={enrollment?.user?.imageURL ? enrollment?.user?.imageURL : defaultDP} alt={enrollment.user.name} width={100} height={100}/>
                    <div className="text-sm flex justify-between items-center w-full">
                        <h1>{enrollment.user.name}</h1>
                        {removeDuplicates ? <Image className='cursor-pointer h-5 w-fit' onClick={()=> handleDuplicates(enrollment)} src={removeIcon} alt='remove'/> : <Button className='h-6 text-xs' onClick={() => handleOpenDialog(enrollment.user._id)}>Details</Button>
                       }
                        <Dialog open={openUserId === enrollment.user._id} onOpenChange={handleCloseDialog}>
                        <DialogContent className='sm:max-w-[425px] text-sm'>
                            <DialogHeader>
                                <DialogTitle>{enrollment.user.name}</DialogTitle>
                                <DialogDescription>{enrollment.user.role}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2 items-center justify-center">
                                    <UpdateDisplayPicture level="admin" userData={enrollment.user} getBatch={getBatch} editDP={editDP} setEditDP={setEditDP}/> 
                                    <ProfileDetails level="admin" userData={enrollment.user} getBatch={getBatch} editInfo={editInfo} setEditInfo={setEditInfo}/> 
                                </div>
                                <h1 className="font-semibold border-b border-gray-300 pb-2">Profile details</h1>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Enrollment Id</span>
                                        <span>{enrollment._id}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Email</span>
                                        <span>{enrollment.user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Contact</span>
                                        <span>{enrollment.user?.contact}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Experience</span>
                                        <span>{enrollment.user?.experience}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Domain</span>
                                        <span>{enrollment.user?.domain}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Country</span>
                                        <span>{enrollment.user?.country}</span>
                                    </div>
                                    {enrollment.graduationBatch && 
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Graduation</span>
                                        <span>{enrollment.graduationBatch.month +' ' +enrollment.graduationBatch.year}</span>
                                    </div>}
                                </div>
                            </div>
                            <div className='flex justify-between border-t space-y-2 pt-4'>
                            
                            
                                
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="airplane-mode">Profile status</Label>
                                <Switch checked={enrollment.user.isProfileComplete} onCheckedChange={()=> updateProfileStatus(enrollment.user._id, !enrollment.user.isProfileComplete)}/>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Label htmlFor="airplane-mode">Access status</Label>
                                <Switch checked={enrollment.access} onCheckedChange={()=> updateAccessStatus(enrollment._id, !enrollment.access)}/>
                            </div>
                            </div>  
                            
                            <Dialog>
                                <DialogTrigger asChild>
                                    {!enrollment.graduationBatch && <Button>Graduation</Button>}
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Graduation</DialogTitle>
                                    <DialogDescription>
                                        Graduate {enrollment.user.name} 
                                    </DialogDescription>
                                </DialogHeader>
                                {graduationBatches && <div className="grid gap-4 py-4">
                                    <Select onValueChange={setGraduationBatch}>
                                        <SelectTrigger className="w-full h-12">
                                            <SelectValue placeholder="Choose Graduation Batch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {graduationBatches.map((batch)=>
                                        (
                                            <SelectItem className='h-12' value={batch._id} key={batch._id}>{batch.month +' ' +batch.year}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                </div>}
                                <DialogFooter>
                                    {isButtonLoading ? 
                                    <Button onClick={()=>updateGraduation(enrollment._id)}>
                                        <Loader2 className='animate-spin'/>
                                    </Button>
                                    : <Button onClick={()=>updateGraduation(enrollment._id)}>Update</Button>}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>                        
                        </DialogContent>
                        </Dialog>    
                    </div>
                    
                    </Card>)
                }) : 
                <p className='text-center text-xl mt-4 font-semibold'>No Enrollments</p>
            }
            </div>)}


            {activeTab === "mocks" && (
                <div className='grid grid-cols-1 gap-3 pb-8 w-full md:w-2/3 h-fit'>

                {assignedMocks.length > 0 && 
                <div className='pb-4 flex items-center justify-end'>
                    
                    <div className='flex items-center space-x-4'>
                    {assignedMocks.map((index)=> 
                    (
                        <Card key={index} className='bg-orange-50 p-2 px-4 rounded-full aspect-square flex items-center'>{index}</Card>
                    ))}
                    </div>
                </div>
                }
            
                {batch.course.mocks.map((mock, index)=>
                (
                    <Card className={`${assignedMocks.includes(mock.id) ? 'bg-green-50' : 'bg-red-50' } p-6 text-sm`} key={mock.id}>
                        {isLoading ? <LoadingMini/> :
                        <div className="space-y-3">
                            <div className='gap-2 flex justify-between rounded relative'>
                                <div className='flex items-center gap-2'>
                                    <Image className='h-6 w-fit' src={mockIcon} alt='mock'/>
                                    <p>Set {mock.id}</p>
                                </div>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className='h-6 text-xs'>Settings</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] space-y-0.5">
                                        <DialogHeader>
                                            <DialogTitle>Mock {mock.id}</DialogTitle>
                                            <DialogDescription>{assignedMocks.includes(mock.id) ? 'Assigned' : 'Unassigned'}</DialogDescription>
                                        </DialogHeader>
                                        <div className='space-y-6 md:text-sm text-xs'>
                                        {assignedMocks.includes(mock.id) && 
                                        <div className='flex justify-between items-center'>
                                            <p>Retake</p>
                                            <Switch checked={batch.mocks[checkBatchIndex(mock.id)]?.status === 'Unlocked'} onCheckedChange={()=> updateMock(mock, mock.id, batch.mocks[checkBatchIndex(mock.id)].status === 'Locked' ? 'Unlocked' : 'Locked', "retake")}/>
                                        </div>}

                                        {assignedMocks.includes(mock.id) && 
                                        <div className='flex justify-between items-center'>
                                            <p>Hide</p>
                                            <Switch checked={batch.mocks[checkBatchIndex(mock.id)]?.status === 'Unlocked'} onCheckedChange={()=> updateMock(mock, mock.id, batch.mocks[checkBatchIndex(mock.id)].status === 'Locked' ? 'Unlocked' : 'Locked', "retake")}/>
                                        </div>}

                                        {assignedMocks.includes(mock.id) ? 
                                        <Button className='text-xs w-full' onClick={()=> router.push(`${pathname}/mock-report?mock=${checkBatchIndex(mock.id)+1}`)}>Discuss</Button> :
                                        <Button className='text-xs w-full' onClick={()=> updateMock(mock, mock.id, "Locked" ,"assign")}>Assign</Button>}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                
                            </div>
                        </div>}
                  </Card>                
                ))}
            </div>)}
        </div>
              
        </div>
    )
}

export default Batch






