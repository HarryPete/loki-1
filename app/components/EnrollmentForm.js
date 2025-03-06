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
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
 
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormMessageeFormMessage} from "@/components/ui/form"
import axios from "axios"
import { toast } from "sonner"

import Loading from "./Loading"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  
  batch: z.string().min(2, {
    message: "Batch is required",
  })
})

const EnrollmentForm = ({newEnrollment, setNewEnrollment, batches, user, getProfiles}) =>
{

  const [ isLoading, setIsLoading ] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
      defaultValues: 
      {
        batch: "",
      },
    })

    async function onSubmit(data) 
    {
        console.log(data)

        if(!user)
          return toast.error('Invalid user ID')

        try
        {
            setIsLoading(true)
            const url = `/api/enrollment/${user._id}`
            const response = await axios.post(url, { batchId: data.batch });
            toast.success(response.data.message);
            getProfiles()
        }   
        catch(error)
        {
            toast.error(error)
        }
        finally
        {
          setIsLoading(false)
        }
    }

    return (
    <Dialog open={newEnrollment} onOpenChange={setNewEnrollment}>
        <DialogTrigger asChild>
            <Button className='h-6 text-xs md:text-sm'>Add</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Enroll user</DialogTitle>
                <DialogDescription>
                    {user.name}
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Batch</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='md:h-12 h-10 text-sm'>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a batch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {batches.map((batch)=>
                  (
                    <SelectItem className='md:h-12 h-10 text-sm' value={batch._id} key={batch._id}>{batch.title}</SelectItem>
                  ))}                  
                </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
              )}
            />
    
                {isLoading ? 
                <Button className='md:h-12 h-10 text-sm w-full'>
                  <Loader2 className='animate-spin'/>
                  Enrolling...</Button>
                : <Button type="submit" className='md:h-12 h-10 text-sm w-full'>Enroll</Button>}
              </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default EnrollmentForm

