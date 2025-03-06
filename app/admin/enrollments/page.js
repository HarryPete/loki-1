'use client'

import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormatDate } from "@/utility/FormatDate"
import axios from "axios";
import { useEffect, useState } from "react";
import defaultDP  from '../../../assets/defaultDP.png'
import { toast } from "sonner";
import Image from "next/image";
import UserHistory from "@/app/components/UserHistory";
import { Input } from "@/components/ui/input";
import MoveEnrollmentForm from "@/app/components/MoveEnrollmentForm";

const Users = () =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ users, setUsers ] = useState(null);   
    const [ openUserId, setOpenUserId ] = useState(null);
    const [ filteredusers, setFilteredUsers ] = useState(null);
    const [ moveEnrollment, setMoveEnrollment ] = useState(false);
    const [ batches, setBatches ] = useState(null);

    const handleOpenDialog = (userId) => 
    {
        setOpenUserId(userId);
    };

    const handleCloseDialog = () => 
    {
        setOpenUserId(null);
    };

    useEffect(()=>
    {
        getEnrollments();
        getBatches();
    },[])

    const getBatches = async () =>
    {
        try
        {
            const url = `/api/batch`
            const response = await axios.get(url);
            setBatches(response.data)
        }
        catch(error)
        {
            toast.error(error.message);     
        } 
    }

    const getEnrollments = async ()=>
    {
        try
        {
            const url = '/api/enrollments';
            const response = await axios.get(url);
            const users = response.data.map((user, index)=> {return {...user, position: index+1 }})
            setUsers(users)
            setFilteredUsers(users)
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

    const handleChange = (e) =>
    {
        let name = e.target.value
        const filteredNames = users.filter((user)=> user?.user.name.toLowerCase().includes(name.toLowerCase()) || user?.user.email.toLowerCase().includes(name.toLowerCase()));
        setFilteredUsers(filteredNames)
    }

    console.log(users)

    if(isLoading)
        return <Loading/>

    return(
            
        <div className="space-y-4">
            {/* <div className='rounded-xl p-4 text-white space-y-2' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <h1 className="font-semibold">Fintsters</h1>
                <p className="text-xs">{users.length}</p>
            </div> */}
            <div className="relative pb-4">
                <Input className='p-6 px-4 rounded-lg bg-neutral-50' onChange={(e)=> handleChange(e)} placeholder='Search'/>
                <span className="absolute right-4 top-6 translate-y-[-50%] font-semibold cursor-pointer" onClick={()=> setFilteredUsers(users)}>x</span>
                <p className="text-muted-foreground md:text-sm text-xs pt-2">{filteredusers.length>0 ? filteredusers.length +' profiles' : 'Profile not found'}</p>
            </div>
            
             <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {filteredusers?.map((user, index) => 
            (
                <div key={user._id} className="p-4 flex items-start gap-4 rounded-xl bg-neutral-50 shadow-md relative">
                    <Image className='h-12 w-12 object-cover object-top rounded-full' src={user?.user?.imageURL ? user?.user?.imageURL : defaultDP} alt={user.user.name} width={100} height={100}/>
                    <div className="text-sm space-y-1 ">
                        <h1 className="font-semibold">{user.user.name}</h1>
                        <p className="pb-2">{user.user?.email}</p>
                        <p className="absolute right-2 bottom-2 text-base font-semibold">{user.position}</p>
                        <Button className='h-6 text-xs' onClick={() => handleOpenDialog(user._id)}>Details</Button>
                       
                        <Dialog open={openUserId === user._id} onOpenChange={handleCloseDialog}>
                        <DialogContent className="sm:max-w-[425px] text-sm">
                            <DialogHeader>
                                <DialogTitle>{user?.user.name}</DialogTitle>
                                <DialogDescription>{user?.batch.title}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2 items-center justify-center">
                                    <Image className='h-20 w-20 object-cover rounded-full object-top' src={user?.user?.imageURL ? user?.user?.imageURL : defaultDP} alt={user.user.name} width={100} height={100}/>
                                   
                                </div>
                               
                                <h1 className="font-semibold border-b border-gray-300 pb-2">Profile details</h1>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Enrollment ID</span>
                                        <span>{user?._id}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Email</span>
                                        <span>{user?.user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Contact</span>
                                        <span>{user?.user?.contact}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Experience</span>
                                        <span>{user?.user?.experience}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Domain</span>
                                        <span>{user?.user?.domain}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Country</span>
                                        <span>{user?.user?.country}</span>
                                    </div>
                                </div>
                                <h1 className="font-semibold pt-4">Mocks</h1>
                                {user.mocks.length > 0 ? 
                                <div className="pt-2 border-t space-y-2">
                                    {user.mocks.map((mock)=>
                                    (
                                        <p key={mock}>{mock}</p>
                                    ))}
                                </div>
                                : <p className="text-muted-foreground pt-2 border-t">No mocks assigned</p>}
                                <div className="pt-4 space-y-2">
                                    <MoveEnrollmentForm moveEnrollment={moveEnrollment} setMoveEnrollment={setMoveEnrollment} batches={batches} enrollment={user} getEnrollments={getEnrollments}/>
                                    <p className=" text-gray-400">{user?.user.role +' since ' +FormatDate(user?.user.createdAt)}</p>
                                </div>
                            </div>
                        </DialogContent>
                        </Dialog>    
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default Users