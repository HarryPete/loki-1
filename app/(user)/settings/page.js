'use client'

import Image from 'next/image'
import logo from '../../../assets/logo.png'
import Loading from '@/app/components/Loading';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import ProfileDetails from '@/app/components/ProfileDetails';
import { toast } from 'sonner';
import Link from 'next/link';
import Feedback from '@/app/components/Feedback';
import UpdateDisplayPicture from '@/app/components/UpdateDisplayPicture'
import { useRouter } from 'next/navigation';

const Settings = () =>
{
    const { data, status } = useSession();
    const [ userData, setUserData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ editInfo, setEditInfo ] = useState(false);
    const [ feedbackForm, setFeedbackForm ] = useState(false);
    const [ editDP, setEditDP ] = useState(false);
    const router = useRouter()

    const getUserData = async () =>
    {
        try
        {
            const url = `/api/user/${data.user.id}`
            const response = await axios.get(url);
            setUserData(response.data);
        }
        catch(error)
        {
            toast(error);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    console.log(userData)

    useEffect(() => 
    {
        if(status === "authenticated")
            getUserData();
        else if(status === "unauthenticated")
            router.push('/')
        else
            setIsLoading(true);
    }, [status]);

    if(status === 'loading' || isLoading)
        return(
            <Loading/> 
        )

    return(
        <div className='space-y-8 text-sm'>
            
            <div className='h-[40vh] flex md:flex-row flex-col md:p-8 p-2 md:justify-start md:items-end justify-end items-center md:gap-8 gap-2 relative'>
                <div className='absolute md:p-0 pt-2 top-0 left-0 flex justify-center md:items-center items-start rounded-xl w-[100%] h-full' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                    <Image className='md:h-16 h-12 w-fit mt-8 md:mt-0' src={logo} width={100} height={100} alt='FINTS AML'/>
                </div>
                <div className='z-10 flex gap-2 md:flex-row flex-col md:items-end items-center relative'>
                    <UpdateDisplayPicture userData={userData} getUserData={getUserData} editDP={editDP} setEditDP={setEditDP}/>
                    <div className='flex flex-col gap-1 mt-1'>
                        <span className='md:text-xl text-lg font-semibold text-white'>{userData.name}</span>
                        <span className='text-md md:text-start text-center text-gray-500 font-semibold'>{userData.country}</span>
                    </div>    
                </div>
            </div>

            <ProfileDetails userData={userData} setEditInfo={setEditInfo} editInfo={editInfo} getUserData={getUserData}/>


            <div className='border-t flex lg:flex-row flex-col gap-4 items-start border-gray-300 pt-6'>
                <p className='lg:w-[30%] text-gray-500 font-semibold'>Personal Information</p>
                <div className='space-y-4 lg:w-[70%] w-full'>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='md:w-[20%] w-[40%] font-semibold'>Email</span>
                        <span>{userData.email}</span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='md:w-[20%] w-[40%] font-semibold'>Contact</span>
                        <span>{userData.contact}</span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='md:w-[20%] w-[40%] font-semibold'>Role</span>
                        <span>Learner</span>
                    </div>
                </div>
            </div>
            <div className='border-y flex lg:flex-row flex-col gap-4 items-start border-gray-300 py-6'>
                <p className='lg:w-[30%] text-gray-500 font-semibold'>Professional Information</p>
                <div className='space-y-4 lg:w-[70%] w-full'>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='md:w-[20%] w-[40%] font-semibold'>Organisation</span>
                        <span>{userData.organisation}</span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='md:w-[20%] w-[40%] font-semibold'>Domain</span>
                        <span>{userData.domain}</span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='md:w-[20%] w-[40%] font-semibold'>Experience</span>
                        <span>{userData.experience}</span>
                    </div>
                    <div className='flex md:flex-row flex-col gap-2'>
                        <span className='md:w-[20%] w-[40%] font-semibold'>Linked in</span>
                        <Link target='blank' href={userData?.linkedIn ?? ''} className='underline text-blue-600'>{userData?.linkedIn ? userData.name : ''}</Link>
                    </div>
                </div>
            </div>
            <Feedback feedbackForm={feedbackForm} setFeedbackForm={setFeedbackForm}/>
        </div>
    )
}

export default Settings