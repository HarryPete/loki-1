'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import ForumSearchbar from '@/app/components/ForumSearchbar'
import PopularCard from '@/app/components/PopularCard'
import Loading from '@/app/components/Loading'
import ForumPost from '@/app/components/ForumPost'
import Discussions from '@/app/components/Discussions'
import Link from 'next/link'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import Header from '../components/Header'
import { Card } from '@/components/ui/card'
import { FormatTime } from '@/utility/formatTime'

const Forum = () =>
{
    const [ discussions, setDiscussions ] = useState(null);
    // const [ topics, setTopics ] = useState(null)
    // const [ searchQuery, setSearchQuery ] = useState({search: '', order: ''})
    const [ newDiscussion, setNewDiscussion ] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const session = useSession();
    const user = session?.data?.user?.id

    useEffect(() =>
    {        
        getDiscussions();
    },[])
    
    const getDiscussions = async () =>
    {
        try
        {
            const url = `/api/forum`
            const response = await axios(url)
            setDiscussions(response.data)
        }
        catch(error)
        {
            toast.error(error.message);
        }
    }

    // const handleChange = (type, value) =>
    // {
    //     if(type === "topic" && !value)
    //     {
    //         router.push(pathname)
    //         getDiscussions()
    //         setSearchQuery({...searchQuery, [type] : ''})
    //         return;
    //     }

    //     if(type==="topic")
    //     {
    //         const path = `topic=${value}`
    //         router.push(`${pathname}?${path}`)
    //         getDiscussions(`/api/forum?${path}`)
    //     }
    //     setSearchQuery({...searchQuery, [type] : value})
    // }

    // const getTopics = async () =>
    // {
    //     const url = '/api/forum/topics';
    //     const response = await axios(url);
    //     setTopics(response.data);
    // }

    return(
        <div>
        <Header/>
        <div className='lg:px-[10vw] px-[5vw] py-12 flex flex-col gap-4 pt-24'>
            <div className='p-6 space-y-2 rounded-xl text-white' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <h1 className='text-base font-semibold'>Welcome to Fints AML Forum!</h1>
                <p className='text-xs text-muted pb-2'>Join the FinTS Forum to discuss financial crime trends, share insights, and connect with industry experts. Stay informed, collaborate, and enhance your knowledge in financial crime prevention!</p>
                {user && <ForumPost newDiscussion={newDiscussion} setNewDiscussion={setNewDiscussion} getDiscussions={getDiscussions}/>}
            </div>
            
                   
            {discussions ? 
            <div className='space-y-4 '>                 
                {discussions.length > 0 ?
                <div className='flex items-start gap-4'>
                    
                    {/* <div className='w-[30%] space-y-4 sticky top-40'>
                        <ForumSearchbar handleChange={handleChange} searchQuery={searchQuery} getDiscussions={getDiscussions}/>
                        <PopularCard handleChange={handleChange} getTopics={getTopics} topics={topics}/>
                    </div> */}
                    <div className='w-[100%] grid grid-cols-1 gap-2 text-sm'>
                
                    {discussions.map((discussion) =>
                    (
                        <Card className='space-y-3 p-6 bg-neutral-50' key={discussion._id}>
                            <Link className='font-semibold lg:text-base text-sm  hover:text-blue-600 cursor-pointer' href={`${pathname}/discussion?dId=${discussion._id}`}>{discussion.title}</Link>
                            <div className='flex flex-wrap gap-2'>
                            {discussion.keywords.map((key, index)=>
                            (
                                <p key={index} className='bg-gray-200 rounded p-1 px-2 w-fit relative text-xs'>{key}</p>
                            ))}
                            </div>
                            <div className='flex items-center gap-2 text-muted-foreground font-semibold'>
                                <p className='text-xs'>{discussion.comments.length} Comments</p>
                                <p>•</p>
                                <p className='text-xs'>{FormatTime(discussion.createdAt)}</p>
                            </div>
                        </Card>))}
                    </div> 
                </div> :
                <div className='text-center text-gray-300 md:text-3xl text-lg font-semibold'>
                    No Discussions Posted
                </div>}
            </div> : 
            <Loading/>}
        </div>
        </div>
    )
}

export default Forum