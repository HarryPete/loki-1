
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Loading from '@/app/components/Loading';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormMessageeFormMessage} from "@/components/ui/form"
    import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip" 
import material from '@/assets/material.png'
import ModuleCard from './ModuleCard';


const formSchema = z.object({
    title: z.string().min(7, {
        message: "Invalid title",
    }),
    recording: z.string().min(7, {
      message: "Invalid link",
    }),
    modules: z.array(
        z.string().min(1, "Module is required"))
})

const LectureCard = ({lecture, index, course}) =>
{
    const [ isLoading, setIsLoading ] = useState(false);
    const { title, recording, modules } = lecture

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: 
        {
            title: title ?? "",
            recording: recording ?? "",
            modules: modules
        },
    })

    async function onSubmit(data) 
    {
        try
        {
            setIsLoading(true)
            const { title, recording } = data
            const url = `/api/lecture/${lecture._id}`
            const lectureDetails = {...lecture, title, recording }
            const response = await axios.put(url, {lectureDetails});
            toast.success(response.data.message);
        }   
        catch(error)
        {
            toast.error(error.message)
        }
        finally
        {
            setIsLoading(false)
        }
    }

    if(isLoading)
        return <Loading/>

    return(
        <Card className='flex justify-between items-center p-6 bg-blue-50'>
            <div className='flex items-center gap-2'>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><Image className='h-6 w-fit' src={material} alt='agenda'/></TooltipTrigger>
                    <TooltipContent>
                        <p>{lecture.title}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <p>Session {index+1}</p>
            </div>

            <div className='flex items-center gap-2'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='h-6'>Edit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Session {index+1}</DialogTitle>
                        <DialogDescription>
                            {course.id.toUpperCase()} 
                        </DialogDescription>
                    </DialogHeader>

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>Title</FormLabel>
                        <FormControl>
                        <Input className='md:h-12 h-10 text-sm' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />
                
                <FormField
                    control={form.control}
                    name="recording"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>Recording Link</FormLabel>
                        <FormControl>
                        <Input className='md:h-12 h-10 text-sm' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                {recording.length > 2 ?
                 <iframe className='w-[100%] h-16 rounded shadow-lg' width="10" height="10" src={recording} title={title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> 
                : <p className='text-center py-2 text-muted-foreground text-sm'>Recording unavailable</p>}

                {isLoading ? 
                    <Button>
                        <Loader2 className='animate-spin'/>
                    </Button>
                    : <Button type="submit">Update</Button>}
                </form>
                
                </Form>
                <DialogFooter>
                
                </DialogFooter>
                </DialogContent>
            </Dialog>   
            <ModuleCard lecture={lecture} index={index} course={course}/>
            </div>
        </Card>
    )
}

export default LectureCard
