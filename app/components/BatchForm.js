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
import { CalendarIcon } from "lucide-react"
 
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
  
  courseId: z.string().min(7, {
    message: "Course is a mandatory field",
  }),
  mentor: z.string().min(3, {
    message: "Mentor is a mandatory field",
  }),
  title: z.string().min(7, {
    message: "Invalid title",
  })
})

const BatchForm = ({newBatch, setNewBatch, getBatches}) =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ courses, setCourses ] = useState(null);
    const [ mentors, setMentors ] = useState(null);
    const [ startDate, setStartDate ] = useState()
    const [ endDate, setEndDate ] = useState()

    useEffect(()=>
    {
        getCourses();
        getMentors();
    },[])

    const getCourses = async () =>
    {
        try
        {
            const url = `/api/course`
            const response = await axios.get(url);
            setCourses(response.data);
        }
        catch(error)
        {
            toast.error(error.message);
        }
        finally
        {
            setIsLoading(false);
        }
    }
    
    const getMentors = async () =>
        {
            try
            {
                const url = `/api/mentor`
                const response = await axios.get(url);
                setMentors(response.data);
            }
            catch(error)
            {
                toast.error(error.message);
            }
            finally
            {
                setIsLoading(false);
            }
        }

    const form = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: 
            {
              courseId: "",
                mentor: "",
                title: ""
            },
        })

    async function onSubmit(data) 
    {
        if(!startDate || !endDate)
          return toast.error('Dates are mandatory')

        const batchDetails = {...data, startDate, endDate}

        try
        {
            const url = '/api/batch'
            const response = await axios.post(url, batchDetails);
            toast(response.data.message);
            setNewBatch(false)
            getBatches()
        }   
        catch(error)
        {
            console.log(error)
        }
    }

    if(isLoading)
        return <Loading/>

    return (
    <Dialog open={newBatch} onOpenChange={setNewBatch}>
        <DialogTrigger asChild>
            <Button className='h-10 text-xs md:text-sm'>New Batch</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create new batch</DialogTitle>
                <DialogDescription>
                    Announce your upcoming batch
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='md:h-12 h-10 text-sm'>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courses.map((course)=>
                  (
                    <SelectItem className='md:h-12 h-10 text-sm' value={course._id} key={course._id}>{course.title}</SelectItem>
                  ))}                  
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          )}
        />

<FormField
                control={form.control}
                name="mentor"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Mentor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='md:h-12 h-10 text-sm'>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mentor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mentors.map((mentor)=>
                  (
                    <SelectItem className='md:h-12 h-10 text-sm' value={mentor._id} key={mentor._id}>{mentor.name}</SelectItem>
                  ))}                  
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          )}
        />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                        <Input className='md:h-12 h-10 text-sm' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                
<Popover>
          <FormLabel>Start date</FormLabel>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full md:h-12 h-10 text-sm justify-start",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {startDate ? format(startDate, "PPP") : <span>Start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Popover>
          <FormLabel>End date</FormLabel>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full md:h-12 h-10 text-sm justify-start",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {endDate ? format(endDate, "PPP") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
          </PopoverContent>
        </Popover>
                
                       
                <Button type="submit" className='md:h-12 h-10 text-sm w-full'>Create</Button>
              </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default BatchForm

