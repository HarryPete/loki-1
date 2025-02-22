'use client'

import BatchCard from "@/app/components/BatchCard";
import axios from "axios";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/app/components/Loading";
import ProfileDetails from "@/app/components/ProfileDetails";
import { User } from "lucide-react";

const Dashboard = () =>
{
    
    const { data, status } = useSession();
    const [ userData, setUserData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true)
    const router = useRouter();

    const getUserData = async () =>
    {
        try
        {
            const url = `/api/user/${data.user.id}`
            const response = await axios.get(url);
            setUserData(response.data);
            if(!response.data.isProfileComplete)
                router.push('/settings')
        }
        catch(error)
        {
            console.log(error);
        }
        finally
        {
            setIsLoading(false);
        }
    }

    useEffect(() => 
    {
        if(status === "authenticated")
            getUserData();
        else if(status === "unauthenticated")
            router.push('/')
        else
            setIsLoading(true);
    }, [status]);

    const getGreeting = () => 
    {
        const hour = new Date().getHours();
      
        if (hour < 12) {
          return "Good morning! ☀️";
        } else if (hour < 18) {
          return "Good afternoon! 🌤️";
        } else {
          return "Good evening! 🌙";
        }
    };

    if(status === 'loading' || isLoading)
        return(
            <Loading/> 
        )
        
    return(
        <div className="space-y-4">
            <h2 className="text-lg font-bold ">{getGreeting() +', ' +userData?.name}!</h2>
            <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
                {userData?.enrollments?.map((enrollment)=>
                (
                    <BatchCard batch={enrollment.batch} enrollment={enrollment} key={enrollment._id} level='user'/>
                ))}
            </div>
        </div>
    )
}

export default Dashboard