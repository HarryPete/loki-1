'use client'

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
import deleteIcon from '../../../../assets/delete.png'
 
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

import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Loading from "@/app/components/Loading"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { addNewQuestion, feedMock, removeQuestion, updateQuestion } from "@/store/slices/mockReducer"

const formSchema = z.object({
  question: z.string().min(10, {
    message: "Question is required",
  }),
  options: z.array(
    z.object({
      option: z.string().min(1, "Option is required"),
      isCorrect: z.boolean(),
   })
 )
 .min(2, "At least 2 options are required"),
  note: z.string()
})

const Page = () =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ courses, setCourses ] = useState(null);
    const [ index, setIndex ] = useState(0);
    const mock = useSelector((state)=> state.mock.questions)
    const dispatch = useDispatch();
    const [ openDialogue, setOpenDialogue ] = useState(false)
    const [ mockTitle, setMockTitle ] = useState('')
    const [ course, setSelectCourse ] = useState('');

    useEffect(()=>
    {
        getCourses();
        dispatch(feedMock([]))
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
    
    useEffect(()=> 
    {
      form.reset(mock[index])
    },[index])

    const form = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: mock[index],
        })

    function onSubmit(data) 
    {
      let isAnswerEntered = data.options.find((option)=> option.isCorrect)
      if(!isAnswerEntered)
        return toast('Choose atleast one answer')

      const answers = []; 
      data.options.forEach((option,index)=>
      {
        if(option.isCorrect)
        {
          answers.push(index+1)
        }
      })
      const updatedData = {...data, answers, index}

      dispatch(updateQuestion(updatedData))
      toast.success(`Question ${index+1} updated`)
    }

    const deleteQuestion = () =>
    {
      dispatch(removeQuestion(index)); 
      setIndex((prev)=> prev === 0 ? index + 1 : index - 1)
    }

    const handleSubmit = async () =>
    {
      if(!mockTitle)
        return toast.error('Mock title is required')

      if(!course)
        return toast.error('Course is required')

      try
      {
        const url = '/api/quiz'
        const response = await axios.post(url, {title: mockTitle, course: course, reference: mock })
        toast.success(response.data.message);
      }
      catch(error)
      {
        toast.error(error.message)
      }
    }

    const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "options",
    });

    if(isLoading)
        return <Loading/>

    return (
        <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='text-xs'>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                {courses.map((course)=>
                (
                    <SelectItem className='text-xs' value={course._id} key={course._id}>{course.title}</SelectItem>
                ))}                  
                </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>)}
            /> */}
            <div className="bg-white p-6 shadow-lg rounded-xl space-y-4">
                <div className="flex justify-between gap-2">
                  <h1 className="text-base font-semibold">Question {index+1}</h1>
                  {/* <Image className="h-7 w-fit cursor-pointer bg-gray-100 shadow-lg rounded-full p-1.5" src={deleteIcon} alt='delete' onClick={deleteQuestion}/> */}
                </div>
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                    <FormItem>
                        {/* <FormLabel>Question</FormLabel> */}
                        <FormControl>
                        <Textarea className='text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                <h1 className="text-base font-semibold">Options</h1>
                <Button className='text-xs' onClick={() => append({ option: "", isCorrect: false })}>Add Option</Button>

          {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`options.${index}.option`}
            render={({ field }) => (
              <FormItem>
                {/* Remove Option Button */}
                
                {/* <FormLabel>Option {index + 1}</FormLabel> */}
                <div className="flex items-center space-x-4">
                
                {fields.length > 2 && (
                      <Image className="h-7 w-fit cursor-pointer bg-gray-100 shadow-lg rounded-full p-1.5" src={deleteIcon} alt='delete'
                        onClick={() => remove(index)}
                      />
                    )}

                  <FormControl>
                    <input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      {...field}
                      className="flex-1 border p-2 text-sm rounded h-12"
                    />
                  </FormControl>

                  {/* Option Input */}
                  

                  {/* Correct Checkbox */}

                  <FormField
                    control={form.control}
                    name={`options.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem className="flex items-center text-sm space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
        ))}
          <h1 className="text-base font-semibold">Note</h1>
            <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem className="flex items-center text-sm space-x-2">
                        <FormControl>
                        <Textarea className='text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />

        </div>
        
        
        <div className="w-full flex justify-between">
          <div className="space-x-2 h-fit">
            <Button className='text-xs' type="submit">Update</Button>
            <Button className='text-xs' onClick={()=> {form.reset(); dispatch(addNewQuestion()); setIndex((prev)=> prev+1)}}>Add question</Button>
          </div>
          
          <Dialog open={openDialogue} onOpenChange={()=> setOpenDialogue(false)}>
                  <Button className='text-xs' onClick={()=> setOpenDialogue(true)}>Finish</Button>
                  <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                          <DialogTitle>Fints AML Mock</DialogTitle>
                          <DialogDescription>
                            {/* Account created on {FormatDate(user.createdAt)} */}
                          </DialogDescription>
                      </DialogHeader>

                      <Input className="w-full h-12" value={mockTitle} placeholder='Mock title' onChange={(e)=> setMockTitle(e.target.value)}/>
          
                      <Select onValueChange={setSelectCourse}>
                         <SelectTrigger className="w-full h-12">
                            <SelectValue placeholder="Choose Batch" />
                            </SelectTrigger>
                              <SelectContent>
                              {courses.map((course)=>
                              (
                                <SelectItem className='h-12' value={course._id} key={course._id}>{course.title}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                      <Button className='text-xs' onClick={handleSubmit}>Post Mock</Button>
                  </DialogContent>
              </Dialog>
          
        </div>
        
        
              </form>
              <div className="pt-8 flex flex-wrap justify-center gap-2">
              {Array(mock.length).fill(0).map((_, ind)=>
              (
                <div className={`${( ind === index) && 'bg-yellow-400'} cursor-pointer rounded-full border w-10 text-center p-2`} onClick={()=> setIndex(ind)} key={ind}>{ind+1}</div>
              ))}
              </div>
              </Form>
  )
}

export default Page


