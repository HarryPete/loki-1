'use client'

import axios from "axios";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import Loading from "../components/Loading";
import Header from "../components/Header";
import Image from "next/image";

const Testimonials = () =>
{
    const [ feedbacks, setFeedbacks ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(()=>
    {
        getFeedbacks()
    },[])

    const getFeedbacks = async () =>
    {
        try
        {
            const url = '/api/feedback'
            const response = await axios.get(url);
            setFeedbacks(response.data);
        }
        catch(error)
        {
            toast.error(error.message);
        }
        finally
        {
            setIsLoading(false)
        }
    }

    console.log(feedbacks)

    if(isLoading)
        return <Loading/>

    return(
        <div>
            <Header/>
            <div className="grid grid-cols-3 gap-4 px-[5vw] py-24">
                {feedbacks.map((feedback)=>
                (
                    <div key={feedback._id} className="bg-gray-100 p-8 text-sm space-y-2 rounded-lg">
                        <Image className="h-40 w-40 object-top object-cover rounded-full" src={feedback.user?.imageURL} alt={feedback.user.name} width={100} height={100}/>
                        <p className="font-semibold">{feedback.user.name}</p>
                        <p>{feedback.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonials