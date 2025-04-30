
import user from '@//assets/user.png'
import Image from 'next/image'
import { FormatTime } from '@/utility/formatTime'
import defaultDP from '@/assets/defaultDP.png'

const ReplyCard = ({data, type, setShowReply, replyId}) =>
{

    return(
        <div className='flex items-start lg:gap-3 gap-2'>
            <Image className='h-8 w-8 bg-gray-100 rounded-full object-cover object-top p-1' src={data?.author?.imageURL ? data?.author?.imageURL : defaultDP} alt='img' width={100} height={100}/>
            <div className='space-y-1'>
                <p className='font-semibold'>{data?.author?.name}</p>
                <p >{type === "comment" ? data.comment : data.reply}</p>
                <div className='flex gap-2 text-xs text-gray-400'>
                    {type === "comment" && <p className='cursor-pointer' onClick={()=> setShowReply(replyId)}>reply</p>}
                    {type === "comment" && <p>•</p>}
                    <p>{FormatTime(data.createdAt)}</p>
                </div>
            </div>
            {/* <p className={.like}>{data.like}</p> */}
        </div>
    )
}

export default ReplyCard