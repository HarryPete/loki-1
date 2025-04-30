'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FormatTime } from '@/utility/formatTime'
import Loading from '@/app/components/Loading'
import Header from '@/app/components/Header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Comment from '@/app/components/Comment'
import Image from 'next/image';
import upArrow from '@/assets/show.png'
import downArrow from '@/assets/drop.png'

const Discussion = () =>
{
    const [ discussion, setDiscussion ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ comment, setComment ] = useState('');
    const params = useSearchParams();
    const id = params.get('dId');
    const router = useRouter();
    const session = useSession();
    const user = session?.data?.user?.id

    console.log(params)

    useEffect(() =>
    {        
        if(params.size === 0)
            return router.push('/')
        getDiscussion();
    },[])
    
    const getDiscussion = async () =>
    {
        try
        {
            const url = `/api/forum/${id}`
            const response = await axios.get(url)
            setDiscussion(response.data)
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

    const handleComment = async (id) =>
    {
        try
        {
            if(!comment)
                return toast.error('Comment cannot be empty')

            const url = `/api/comment/${id}`
            if(user)
            {
                const response = await axios.post(url, {comment, author: user});
                toast.success(response.data.message)
                getDiscussion();
                setComment('');
            }
            return
        }
        catch(error)
        {
            toast.error(error.message);
        }
    }

    if(isLoading)
        return <Loading/>

    return(
        <div>
            <Header/>
            <div className='md:px-[10vw] px-[5vw] py-12 flex flex-col gap-4 pt-24 md:text-sm text-xs'>
                <div className=' bg-gray-100 lg:p-8 p-6 space-y-6 rounded-lg'>
                    <div className='space-y-3'>
                        <div>
                            <p className='font-semibold lg:text-base text-sm'>{discussion.title}</p>
                            {/* {data?.user?.role === 'admin' && <Image src={deleteIcon} alt='delete' onClick={()=> handleDelete(id)}/>} */}
                        </div>
                
                        <div className='flex flex-wrap gap-2'>
                        {discussion.keywords.map((key, index)=>
                        (
                            <p key={index} className='bg-yellow-400 rounded p-1 px-2 w-fit relative text-xs'>{key}</p>
                        ))}
                        </div>

                        <div className='flex gap-2 text-xs'>
                            <p>Posted by {discussion.author?.name}</p>
                            <p>•</p>
                            <p>{FormatTime(discussion.createdAt)}</p>
                        </div>
                    </div>

                {user && 
                <div className='flex gap-2'>
                    <Input className='lg:text-sm text-xs' value={comment} onChange={(e)=> setComment(e.target.value)} placeholder='Reply'/>
                    <Button className='lg:text-sm text-xs' onClick={()=> handleComment(discussion._id)}>Send</Button>
                </div>}

                { !discussion.comments.length > 0 && user && <p className='text-muted-foreground'>Be the first one to respond</p> }
                    
                <div className='space-y-6'>
                {discussion.comments.map((comment) =>
                (
                    <Comment key={comment._id} comment={comment} user={user} getDiscussion={getDiscussion}/>
                ))}
                </div>
                </div>
            </div>
        </div>
    )
}

export default Discussion