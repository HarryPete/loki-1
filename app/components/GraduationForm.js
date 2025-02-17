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
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  
  courseId: z.string().min(7, {
    message: "Course is required",
  }),
  month: z.string().min(3, {
    message: "Month is required",
  }),
  year: z.string().min(4, {
    message: "Year is required",
  })
})

const GraduationForm = ({newGrad, setNewGrad, getGrads}) =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ courses, setCourses ] = useState(null);

    useEffect(()=>
    {
      getCourses();
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

    const form = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: 
            {
                courseId: "",
                month: "",
                year: ""
            },
        })

    async function onSubmit(data) 
    {
        try
        {
            const url = '/api/graduates'
            const response = await axios.post(url, data);
            toast(response.data.message);
            getGrads()
            setNewGrad(false)
        }   
        catch(error)
        {
            console.log(error)
        }
    }

    if(isLoading)
        return <Loading/>

    return (
    <Dialog open={newGrad} onOpenChange={setNewGrad}>
        <DialogTrigger asChild>
            <Button className='h-10 text-xs'>New Grad Batch</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create Graduation Batch</DialogTitle>
                <DialogDescription>
                    Announce your newly graduated students
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
                    name="month"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Month</FormLabel>
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
                    name="year"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                        <Input className='md:h-12 h-10 text-sm' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />                
                       
                <Button type="submit" className='md:h-12 h-10 text-sm w-full'>Create</Button>
              </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default GraduationForm

