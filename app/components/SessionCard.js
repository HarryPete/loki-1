
import material from '@/assets/material.png'
import complete from '@/assets/success-icon.png'
import pending from '@/assets/pending.png'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"  
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import axios from 'axios'

    const formSchema = z.object({
      recording: z.string().min(7, {
        message: "Invalid title",
      })
    })

const SessionCard = ({session, index, updateSessionStatus, level}) =>
{

    const [ isLoading, setIsLoading ] = useState(false);
    
        const form = useForm({
                resolver: zodResolver(formSchema),
                defaultValues: 
                {
                    recording: ""
                },
            })

    async function onSubmit(data) 
    {
        try
        {
            setIsLoading(true)
            const url = '/api/course'
            const response = await axios.post(url, data);
            toast(response.data.message);
        }   
        catch(error)
        {
            console.log(error)
        }
        finally
        {
            setIsLoading(true)
        }
    }

    return(
        <Card className='flex justify-between items-center p-6 bg-blue-50'>
            <div className='flex items-center gap-2'>
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><Image className='h-6 w-fit' src={material} alt='agenda'/></TooltipTrigger>
                    <TooltipContent>
                        <p>{session.lecture.title}</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <Dialog>
                                <DialogTrigger asChild>
                                    <p className='cursor-pointer'>Session {index+1}</p>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Session {index+1}</DialogTitle>
                                    <DialogDescription>
                                        {session.lecture.title} 
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Recording Link</FormLabel>
                        <FormControl>
                        <Input className='md:h-12 h-10 text-sm' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                /></form></Form>
                                <DialogFooter>
                                    {isLoading ? 
                                    <Button>
                                        <Loader2 className='animate-spin'/>
                                    </Button>
                                    : <Button>Update</Button>}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>   
            </div>
            
            {level === "admin" ? 

            <div className='flex items-center gap-2'>
                 <Switch checked={session.status === "Completed"}  onCheckedChange={()=> updateSessionStatus(session._id, session.status)}/>
                <Label className='md:text-sm text-xs' >{session.status}</Label>
            </div> : 
            <div className='flex items-center'>
                <p>{session.status}</p>
                <Image className='h-6 w-fit' src={session.status === 'Upcoming' ? pending : complete} alt='img'/>
            </div>}
        </Card>
    )
}

export default SessionCard