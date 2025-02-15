'use client'

import { useSession } from "next-auth/react"
import Image from 'next/image';
import correctIcon from '../../../assets/correct.png'
import wrongIcon from '../../../assets/wrong.png'
import { useParams, usebatchId, useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from 'next/link';
import Loading from '@/app/components/Loading';
import axios from "axios"
import { toast } from "sonner"
import { useFieldArray, useForm } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addAnswerTemplate, flagQuestion, updateAnswer, updateOptions } from "@/store/slices/mockAnswerReducer";
import MockTestBar from "@/app/components/MockTestBar";
import { Card } from "@/components/ui/card";

const Page = () =>
{
    return(
        <Suspense fallback={<Loading/>}>
            <Mock/>
        </Suspense>
    )
}

const Mock = () =>
{
    const { data, status } = useSession();
    const dispatch = useDispatch();
    const [ mock, setMock ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true)
    const params = useSearchParams();
    const mockId = params.get('mockId');
    const router = useRouter();
    const pathname = usePathname();
    const [ active, setActive ] = useState(null);
    const [ correctAnswers, setCorrectAnswers ] = useState([]);
    const [ incorrectAnswers, setIncorrectAnswers ] = useState([]);
    const [ answers, setAnswers ] = useState([]);
    const [ flaggedAnswers, setFlaggedAnswers ] = useState([]);
    const [ partiallyCorrectAnswers, setPartiallyCorrectAnswers ] = useState([]);
    const [ message, setMessage ] = useState(null);

    const retakeTest = async () =>
    {
      try
      {
          setIsLoading(true);
          const mockDetails = { answers: [], status: 'Pending'}
          const url = `/api/assessment/${mock._id}`
          const response = await axios.put(url, mockDetails)
          toast.success(response.data.message);
          router.push(`/mock-test?mockId=${mock._id}`)
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

    const getMockTest = async () =>
    {             
        try
        {
            const url = `/api/assessment/${mockId}`
            const response = await axios.get(url);
            // if(!response.data.batch.access)
            // {
            //     router.push('/dashboard')
            //     toast('Access Denied')
            // }

            setMock(response.data);
            const numbers =  Array.from({ length: response.data.answers.length }, (_, index) => index)
            setAnswers(numbers)
            setActive(numbers)

            const flaggedAnswers = [];
            const correctAnswers = [];
            const incorrectAnswers = [];
            const partiallyCorrectAnswers = [];
            const mockAnswers = response.data.answers

            for (let index = 0; index < mockAnswers.length; index++) 
            {
                const isFlagged = mockAnswers[index].isFlagged;
                const referenceAnswers = response.data.quiz.reference[index].answers; 
                const userAnswers = mockAnswers[index].answers; 

                if (isFlagged) 
                    flaggedAnswers.push(index);
                else
                {
                    const allCorrect =
                    userAnswers.every((answer) => referenceAnswers.includes(answer)) &&
                    userAnswers.length === referenceAnswers.length;

                    const someCorrect = userAnswers.some((answer) => referenceAnswers.includes(answer));

                    if (allCorrect) 
                        correctAnswers.push(index);
                    else if (someCorrect) 
                        partiallyCorrectAnswers.push(index);
                    else 
                        incorrectAnswers.push(index);
                }
            }
            
            setFlaggedAnswers(flaggedAnswers);
            setCorrectAnswers(correctAnswers);
            setPartiallyCorrectAnswers(partiallyCorrectAnswers);
            setIncorrectAnswers(incorrectAnswers);

            const correctPercentage = (correctAnswers.length / mockAnswers.length) * 100;

            if (correctPercentage >= 90) {
                setMessage(`🌟 Excellent Performance! 🌟 
              You scored ${correctAnswers.length +' on ' +mockAnswers.length}. 
              Amazing work! You have a strong grasp of the concepts and answered almost everything correctly. Keep maintaining this high standard and challenge yourself with more advanced questions.`);
              } else if (correctPercentage >= 70) {
                setMessage(`✨ Good Job! ✨ 
              You scored ${correctAnswers.length +' on ' +mockAnswers.length}. 
              You have a solid understanding of the material, but there’s room for improvement. Take another look at the partially correct and incorrect answers to refine your knowledge. With a bit more effort, you’ll reach excellence!`);
              } else if (correctPercentage >= 50) {
                setMessage(`👍 Decent Attempt 👍 
              You scored ${correctAnswers.length +' on ' +mockAnswers.length}. 
              You’re on the right path, but there’s more to learn. Review the material for the incorrect answers and try to understand where you went wrong. Focus on the partially correct answers to identify gaps in your understanding.`);
              } else {
                setMessage(`🚀 Keep Trying! 🚀 
              You scored ${correctAnswers.length +' on ' +mockAnswers.length}. 
              It’s okay to struggle initially. Focus on reviewing the material thoroughly and revisit the questions where you made mistakes. Practice regularly, and you’ll see significant improvement.`);
              }
        }
        catch(error)
        {
            toast(error.message);
        }
        finally
        {
            setIsLoading(false)
        }
    }

    useEffect(() => 
    {
        if(status === "authenticated")
        {
            getMockTest();
        }
        else if(status === "unauthenticated")
            router.push('/')
        else
            setIsLoading(true);
            
    }, [status]);

    if(status === 'loading' || isLoading)
    return(
        <Loading/>   
    )

    return(
        <div className="flex lg:flex-row flex-col gap-4 items-start md:text-sm text-xs relative">
            <div className="flex flex-col gap-4 lg:w-[40%] w-full lg:sticky lg:top-28 top-0">
                <MockTestBar mockData={mock}/>
                <Card className="p-4 space-y-2 text-xs">
                    <p className="font-semibold">Feedback </p>
                    <p className="leading-relaxed ">{message}</p>
                    {/* <div className="text-center flex gap-1 justify-center bg-gray-100 p-2 rounded">
                        Do you wish to retake this test ? 
                        <p className="hover:underline cursor-pointer text-blue-500" onClick={retakeTest}>Click here</p>
                    </div> */}
                </Card>
                <Card className="grid grid-cols-5 text-xs font-semibold">
                    <div className={`${active.length === answers.length && 'bg-gray-50'} hover:bg-gray-50 items-center flex flex-col gap-1 lg:p-4 px-2 p-4 cursor-pointer`} onClick={()=> setActive(answers)}>Questions<span className="ml-1 text-xs font-normal bg-blue-500 text-white w-fit p-0.5 px-2  rounded-full">{answers.length}</span></div>
                    <div className={`${active.length === correctAnswers.length && 'bg-gray-50'} hover:bg-gray-50 items-center flex flex-col gap-1 lg:p-4 px-2 p-4 cursor-pointer`} onClick={()=> setActive(correctAnswers)}>Correct<span className="ml-1 text-xs font-normal bg-green-500 text-white w-fit p-0.5 px-2  rounded-full">{correctAnswers.length}</span></div>
                    <div className={`${active.length === partiallyCorrectAnswers.length && 'bg-gray-50'} hover:bg-gray-50 items-center flex flex-col gap-1 lg:p-4 px-2 p-4 cursor-pointer`} onClick={()=> setActive(partiallyCorrectAnswers)}>Partial<span className="ml-1 text-xs font-normal bg-orange-500 text-white w-fit p-0.5 px-2  rounded-full">{partiallyCorrectAnswers.length}</span></div>
                    <div className={`${active.length === incorrectAnswers.length && 'bg-gray-50'} hover:bg-gray-50 items-center flex flex-col gap-1 lg:p-4 px-2 p-4 cursor-pointer`} onClick={()=> setActive(incorrectAnswers)}>Incorrect<span className="ml-1 text-xs font-normal bg-red-500 text-white w-fit p-0.5 px-2  rounded-full">{incorrectAnswers.length}</span></div>
                    <div className={`${active.length === flaggedAnswers.length && 'bg-gray-50'} hover:bg-gray-50 items-center flex flex-col gap-1 lg:p-4 px-2 p-4 cursor-pointer`} onClick={()=> setActive(flaggedAnswers)}>Flagged<span className="ml-1 text-xs font-normal bg-yellow-400 text-white w-fit p-0.5 px-2  rounded-full">{flaggedAnswers.length}</span></div>    
                </Card>
            </div>
            <div className="w-full lg:w-[60%] space-y-4 leading-relaxed">
            {active.map((que, index)=>
            (
                <Card className="p-6 space-y-4 bg-neutral-50" key={index}>
                    <h1 className="font-semibold">{que+1 +'. ' +mock.quiz.reference[que].question}</h1>
                    <div className="space-y-2">
                    {mock.quiz.reference[que].options.map((data, ind)=>
                    (
                        <div className="bg-neutral-200 p-4 rounded flex items-start justify-between gap-4" key={ind}>
                            <p>{ind+1 +'. ' +data.option}</p>
                            {(mock.quiz.reference[que].answers.includes(ind+1) || mock.answers[que].answers.includes(ind+1)) && 
                                <Image className='h-5 w-fit' 
                                src={(mock.quiz.reference[que].answers.includes(ind+1) || mock.answers[que].isFlagged) ? correctIcon : wrongIcon} alt='correct'/>}
                        </div>
                    ))}
                    </div>
                </Card>
            ))}
            </div>
        </div>
    )
}

export default Page