'use client'

import axios from 'axios';
import { useState } from 'react';
import Image from 'next/image';
import upArrow from '@/assets/show.png'
import downArrow from '@/assets/drop.png'
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import ReplyCard from './ReplyCard';
import { Button } from '@/components/ui/button';

const Comment = ({comment, getDiscussions, user}) =>
{
    const [ reply, setReply ] = useState('')
    const [ viewReply, setViewReply ] = useState(null)
    const [ showReply, setShowReply ] = useState(null);

    const handleReply = async (id) =>
    {
        try
        {
            if(!reply)
                return toast.error('Reply cannot be empty')

            if(user)
            {
                const url = `/api/reply/${id}`
                const response = await axios.post(url, {reply, author: user})
                toast.success(response.data.message)
                getDiscussions();
                setReply('');
                setViewReply(id)
            }
            
        }
        catch(error)
        {
            toast.error(error.message);
        }
    }

    return(
        <div className='space-y-4'>
            <ReplyCard key={comment._id} data={comment} 
                type="comment" setShowReply={setShowReply} 
                replyId={comment._id}
            />

            {(comment.replies?.length > 0 ? 
            <div className='ml-12 flex items-center gap-2 bg-neutral-200 rounded-full w-fit px-2 p-1 cursor-pointer '
                onClick={()=>
                { 
                    setViewReply((prev)=> prev === comment._id ? null : comment._id); 
                    setShowReply((prev)=> prev === comment._id ? null : comment._id)
                }}>
                <Image className='h-4 w-fit text-sm' src={viewReply === comment._id ? upArrow : downArrow} alt='comments'/>{comment.replies?.length} {comment.replies?.length > 1 ? 'replies' : 'reply'}</div> : <></>)}

            {viewReply === comment._id &&
            <div className='ml-12 space-y-2'>
                {comment.replies.map((reply) =>
                (
                    <ReplyCard key={reply._id} data={reply} type="reply"/>
                ))}
            </div> }
            
            
            {showReply === comment._id && user && 
            <div className='lg:w-[60%] w-fit flex gap-2 ml-12 text-xs'> 
                <Input className='lg:text-sm text-xs' placeholder='Reply' value={reply} onChange={(e)=> setReply(e.target.value)}/>
                <Button className='lg:text-sm text-xs' onClick={()=> handleReply(comment._id)}>Send</Button>
            </div>}
        </div>   
    )
}

export default Comment