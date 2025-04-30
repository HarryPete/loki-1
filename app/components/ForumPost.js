'use client'

import ForumKey from './ForumKey'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormMessageeFormMessage} from "@/components/ui/form"
import { keywords } from '@/utility/keywords'

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title is too short",
  })
})

const ForumPost = ({getDiscussions, getTopics, newDiscussion, setNewDiscussion}) =>
{
    const session = useSession();
    const user = session?.data?.user?.id;
    const [ keyList, setKeyList ] = useState([])

    const form = 
        useForm({
            resolver: zodResolver(formSchema),
            defaultValues: 
            {
                title: "",
            },
    })
    
    async function onSubmit(data) 
    {
        if(!keyList.length)
            return toast.error('Missing keywords')

        try
        {
            const url = '/api/forum'
            const response = await axios.post(url, {title: data.title, author: user, keywords: keyList});
            toast.success(response.data.message);
            setNewDiscussion(false);
            getDiscussions();
            setKeyList([]);
        }
        catch(error)
        {
            toast.error(error.message);
        } 
    }

    const handleKeywords = (word) =>
    {
        let search = keyList.filter((key) => key === word);
        if(!search.length)
            setKeyList((prev) => [...prev, word])
    }

    const removeKeyWord = (word) =>
    {
        const newList = keyList.filter((key)=> key!==word );
        setKeyList(newList)
    }

    // async function onSubmit(data) 
    // {
    //     try
    //     {
    //         const url = `api/user/${userData._id}`
    //         const response = await axios.put(url, data);
    //         getUserData();
    //         toast(response.data.message);
    //         setEditInfo(false)
    //     }   
    //     catch(error)
    //     {
    //         console.log(error)
    //     }
    // }

    return(
        <Dialog open={newDiscussion} onOpenChange={setNewDiscussion}>
        <DialogTrigger asChild>
            <Button className='text-xs w-fit'>Start a Discussion</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Start a Discussion</DialogTitle>
                <DialogDescription>
                    
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-sm">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                        <Input className='h-12 text-sm' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />
            
                <div className='flex flex-wrap gap-2 text-sm'>
                {keywords.map((keyword)=>
                (
                    <ForumKey key={keyword.id} type="read" keyword={keyword.key} handleKeywords={handleKeywords}/>
                ))}
                </div>
                
                <Button className='h-10 w-full' type="submit">Post</Button>
                </form>
            </Form>
            {keyList.length>0 && <div className='flex flex-wrap gap-2'>
            {keyList?.map((key, index)=>
            (   
                <ForumKey key={index} type="edit" keyword={key} removeKeyWord={removeKeyWord}/>
            ))}
            </div>}
        </DialogContent>
    </Dialog> 
    )
}

export default ForumPost

// <div className='flex gap-2'>
//                     <FormField
//                     control={form.control}
//                     name="keyword"
//                     render={({ field }) => (
//                     <FormItem>
//                         {/* <FormLabel>Country</FormLabel> */}
//                         <FormControl>
//                         <Input className='h-9' {...field} />
//                         </FormControl>
//                         <FormDescription>
//                         </FormDescription>
//                         <FormMessage/>
//                     </FormItem>)}/>
//                     <Button className='text-xs w-fit' onClick={()=> handleKeywords()}>Add Keyword</Button>
//                 </div>