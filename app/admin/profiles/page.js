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
import ProfileForm from "@/app/components/ProfileForm";
import EnrollmentForm from "@/app/components/EnrollmentForm";

const Users = () =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ users, setUsers ] = useState(null);   
    const [ newUser, setNewUser ] = useState(false);   
    const [ openUserId, setOpenUserId ] = useState(null);
    const [ filteredusers, setFilteredUsers ] = useState(null);
    const [ batches, setBatches ] = useState(null);
    const [ newEnrollment, setNewEnrollment ] = useState(false)

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
        getProfiles();
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

    const getProfiles = async ()=>
    {
        try
        {
            const url = '/api/user';
            const response = await axios.get(url);
            const users = [];
            response.data.forEach((user, index)=>
            {
                users.push({...user, position: index+1})
            })
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
        const filteredNames = users.filter((user)=> user.name.includes(name.toLowerCase()) || user.email.includes(name.toLowerCase()));
        setFilteredUsers(filteredNames)
    }

    if(isLoading)
        return <Loading/>

    return(
            
        <div className="space-y-4">
            {/* <div className='rounded-xl p-4 text-white space-y-2' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <h1 className="font-semibold">Fintsters</h1>
                <p className="text-xs">{users.length}</p>
            </div> */}

            <ProfileForm newUser={newUser} setNewUser={setNewUser}/>

            <div className="relative pb-4">
                <Input className='p-6 px-4 rounded-lg bg-neutral-50' onChange={(e)=> handleChange(e)} placeholder='Search'/>
                <span className="absolute right-4 top-6 translate-y-[-50%] font-semibold cursor-pointer" onClick={()=> {setFilteredUsers(users); set}}>x</span>
                <p className="text-muted-foreground md:text-sm text-xs pt-2">{filteredusers.length>0 ? filteredusers.length +' profiles' : 'Profile not found'}</p>
            </div>
            
             <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
            {filteredusers?.map((user, index) => 
            (
                <div key={user._id} className="p-4 flex items-start gap-4 rounded-xl bg-neutral-50 shadow-md relative">
                    <Image className='h-12 w-12 object-cover object-top rounded-full' src={user?.imageURL ? user?.imageURL : defaultDP} alt={user.name} width={100} height={100}/>
                    <div className="text-sm space-y-1 ">
                        <h1 className="font-semibold">{user.name}</h1>
                        <p className="pb-2">{user?.email}</p>
                        <p className="absolute right-2 bottom-2 text-lg font-semibold">{user.position}</p>
                        <Button className='h-6 text-xs' onClick={() => handleOpenDialog(user._id)}>Details</Button>
                       
                        <Dialog open={openUserId === user._id} onOpenChange={handleCloseDialog}>
                        <DialogContent className="sm:max-w-[425px] text-sm">
                            <DialogHeader>
                                <DialogTitle>{user.name}</DialogTitle>
                                <DialogDescription>{user.role}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2 items-center justify-center">
                                    <Image className='h-28 w-28 object-cover rounded-full object-top' src={user?.imageURL ? user?.imageURL : defaultDP} alt={user.name} width={100} height={100}/>
                                   
                                </div>
                                <h1 className="font-semibold border-b border-gray-300 pb-2">Profile details</h1>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Profile ID</span>
                                        <span>{user?._id}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Email</span>
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Contact</span>
                                        <span>{user?.contact}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Experience</span>
                                        <span>{user?.experience}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Domain</span>
                                        <span>{user?.domain}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Country</span>
                                        <span>{user?.country}</span>
                                    </div>
                                </div>
                                <h1 className="font-semibold border-b border-gray-300 pb-2">Enrollments</h1>
                                <div className="space-y-1">
                                    {user?.enrollments?.map((enrollment)=>
                                    (
                                        <div key={enrollment._id}>
                                            <h1>{enrollment?.batch?.title}</h1>
                                        </div>
                                    ))}
                                </div>

                                <EnrollmentForm newEnrollment={newEnrollment} setNewEnrollment={setNewEnrollment} batches={batches} user={user} getProfiles={getProfiles}/>
                                <p className="pt-2 text-gray-400">{user.role +' since ' +FormatDate(user.createdAt)}</p>
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