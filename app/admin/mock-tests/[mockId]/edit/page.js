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
import deleteIcon from '../../../../../assets/delete.png'
 
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
import back from '../../../../../assets/back.png'
import next from '../../../../../assets/next.png'
import { Suspense, useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Loading from "@/app/components/Loading"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { addNewQuestion, feedMock, removeQuestion, updateQuestion } from "@/store/slices/mockReducer"
import { useSearchParams } from "next/navigation"

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
    return(
      <Suspense fallback={<Loading/>}>
        <EditMock/>
      </Suspense>
    )
  }
  export default Page

const EditMock = () =>
{
    const [ isLoading, setIsLoading ] = useState(true);
    const [ mockEdit, setMockEdit ] = useState(null);
    const [ index, setIndex ] = useState(0);
    const params = useSearchParams();
    const mockId = params.get('mockId')
    const mock = useSelector((state)=> state.mock.questions)
    const dispatch = useDispatch();
    // const question = { question: "",
    //   options: [
    //     { option: "", isCorrect: false },
    //     { option: "", isCorrect: false },
    //   ]}
    
    useEffect(()=>
    {
        getCourses();
    },[])

    const getCourses = async () =>
    {
        try
        {
            const url = `/api/quiz/${mockId}`
            const response = await axios.get(url);
            setMockEdit(response.data);
            dispatch(feedMock(response.data.reference))
            form.reset(response.data.reference[index])
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

    const handleSubmit = async (e) =>
    {
      e.preventDefault();

      try
      {
        const url = `/api/quiz/${mockId}`
        const response = await axios.put(url, {reference: mock })
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

    console.log(mock)

    if(isLoading)
        return <Loading/>

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-neutral-50 p-6 shadow-lg rounded-xl space-y-4 relative">
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
                      className="flex-1 border p-2 md:text-sm text-xs rounded h-12"
                    />
                  </FormControl>

                  {/* Option Input */}
                  

                  {/* Correct Checkbox */}

                  <FormField
                    control={form.control}
                    name={`options.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem className="flex items-center text-xs space-x-2">
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
                        
                      </FormItem>
                    )}
                  />
                  <Image className={`${index > 0 ? 'bg-yellow-400 cursor-pointer' : 'bg-gray-200' } absolute left-[-5%] top-[50%]  rounded-full p-2 h-8 w-fit`} src={back} alt='previous' 
                    onClick={()=> 
                    {   
                      if(index < 1)
                        return; 
                      setIndex((prev)=> prev-1)
                     }}
                  />
                   
                  <Image className={`${index+1 !== mockEdit.length ? 'bg-yellow-400 cursor-pointer' : 'bg-gray-200' } absolute right-[-5%] top-[50%]  rounded-full p-2 h-8 w-fit`} src={next} alt='previous' 
                    onClick={()=> 
                    {
                      if(index+1 === mockEdit.length)
                        return
                      setIndex((prev)=> prev+1)
                    }}
                  />

        </div>
        
        
        <div className="w-full flex justify-between">
          <div className="space-x-2 h-fit">
            <Button className='text-xs' type="submit">Update Question</Button>
          </div>
          
          <Button  className='text-xs' onClick={handleSubmit}>Update Quiz</Button>
        </div>  
        </form>
      </Form>
  )
}




