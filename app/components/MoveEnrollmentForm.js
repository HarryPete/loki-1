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
  updatedBatchId: z.string().min(6, {
    message: "Batch is required",
  })
})

const MoveEnrollmentForm = ({ moveEnrollment, setMoveEnrollment, batches, enrollment, getEnrollments}) =>
{

  const [ isLoading, setIsLoading ] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
      defaultValues: 
      {
        updatedBatchId: ""
      },
    })

    async function onSubmit(data) 
    {
      const details = { ...data, batchId: enrollment.batch._id, enrollmentId : enrollment._id, type: "update"}

        try
        {
            setIsLoading(true)
            const url = `/api/enrollment/${enrollment.user._id}`
            const response = await axios.put(url, details);
            toast.success(response.data.message);
            getEnrollments()
        }   
        catch(error)
        {
            toast.error(error.messsage)
        }
        finally
        {
          setIsLoading(false)
        }
    }

    return (
    <Dialog open={moveEnrollment} onOpenChange={setMoveEnrollment}>
        <DialogTrigger asChild>
            <Button className='h-8 text-xs'>Change batch</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Change batch</DialogTitle>
                <DialogDescription>
                    {enrollment.user.name +' - ' +enrollment.batch.title}
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            
              <FormField
                control={form.control}
                name="updatedBatchId"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Updated batch</FormLabel>
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
                  Updating...
                </Button> :
                <Button type="submit" className='md:h-12 h-10 text-sm w-full'>Update</Button>}
              </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default MoveEnrollmentForm

