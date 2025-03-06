'use client'

import { useSession } from "next-auth/react"
import Image from 'next/image';
import back from '../../../assets/back.png'
import next from '../../../assets/next.png'
import flag from '../../../assets/flag-dark.png'
import flagged from '../../../assets/flag.png'
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
import { addAnswerTemplate, flagQuestion, updateAnswer, updateOptions, updateVerdict } from "@/store/slices/mockAnswerReducer";

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
    const [ index, setIndex ] = useState(0);
    const [ active, setActive ] = useState(null);
    const mockAnswers = useSelector((state)=> state.mockAnswers.responses);
    const [ reviewQuestions, setReviewQuestions ] = useState([]);
    const [ showReview, setShowReview ] = useState(false);

    const onSubmit = async () =>
    {
        let score = 0;
        for(let i=0;i<mockAnswers.length;i++)
        {
            mock.quiz.reference[i].answers.every((answer)=> 
            {
                if(mockAnswers[i].answers.includes(answer) && mock.quiz.reference[i].answers.length === mockAnswers[i].answers.length)
                {
                    score++;
                    dispatch(updateVerdict({index: i, verdict: 'Correct'}))
                }
                else if(mockAnswers[i].answers.includes(answer) && mock.quiz.reference[i].answers.length !== mockAnswers[i].answers.length)
                    dispatch(updateVerdict({index: i, verdict: 'Partial'}))
                else if(!mockAnswers[i].answers.includes(answer))
                    dispatch(updateVerdict({index: i, verdict: 'Incorrect'}))
                else
                    dispatch(updateVerdict({index: i, verdict: 'Flagged'}))
            })
        }

        const mockDetails = { answers: mockAnswers, score, status: 'Completed'}

        try
        {
            setIsLoading(true);
            const url = `/api/assessment/${mockId}`;
            const response = await axios.put(url, mockDetails);
            toast.success(response.data.message);
            router.back()
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

    const getMockTest = async () =>
    {
        try
        {
            const url = `/api/assessment/${mockId}`
            const response = await axios.get(url);
            if(!response.data.batch.access)
            {
                router.push('/dashboard')
                toast.error('Access Denied')
            }
            setActive(response.data.quiz.reference)
            setMock(response.data);
            if(mockAnswers.length === response.data.quiz.reference.length)
                return
            dispatch(addAnswerTemplate({length: response.data.quiz.reference.length}))
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
        <div className="space-y-2">
            <div className='rounded-xl p-4 text-white space-y-3' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                <h1 className="font-semibold">All the best, {mock.enrollment.user.name}</h1>
                <div className="flex items-center gap-1 text-muted text-xs">
                    <p>{mock.enrollment.batch.title.split('-')[0]}</p>
                    <span className='hidden sm:inline'>•</span>
                    <p>{mock.quiz.reference.length} questions</p>
                </div>
            </div>

            {active.length===mockAnswers.length && reviewQuestions.length>0 &&
            <div className="flex flex-wrap text-sm items-center gap-2 mt-4 py-4">
            <p className="font-semibold">Review flagged questions</p>
            {reviewQuestions.map((question)=>
            (
                <div className={`${question === index && 'bg-yellow-400 border-yellow-400'} border-2 text-xs p-2 aspect-square rounded-full cursor-pointer`} key={question} onClick={()=> setIndex(question)}>{question+1}</div>
            ))}
            </div>}

            <div className='grid grid-cols-1 gap-4 relative text-sm bg-neutral-50 p-8 rounded-xl shadow-lg'>
            <span className="font-semibold">Question {index+1}</span>
                    
            <div>
            <p className="font-semibold leading-relaxed">{active[index].question}</p>
            {active[index]?.extendedQuestion?.length>0 && 
                <div className="font-semibold leading-loose pt-1">
                {active[index]?.extendedQuestion.map((sentence,index)=>
                (
                    <p className='font-medium' key={index}>{index+1 +'. '  +sentence}</p>
                ))}
                </div>}
            </div>
                {active[index].options.map((data,ind)=>
                (
                    <div key={ind} className="flex items-start gap-4 bg-neutral-200 p-4 rounded">
                        <Checkbox
                            id={ind + 1}
                            checked={mockAnswers[index]?.answers?.includes(ind + 1)}
                            onCheckedChange={(checked) => {
                            if (checked) 
                                dispatch(updateAnswer({ index, answer: ind + 1, isFlagged: false }));
                            else
                                dispatch(updateOptions({ index, option: ind + 1, isFlagged: false }));
    
                            }}
                        />
                    <p>{data.option}</p>
                </div>
                ))}


                <div className="flex gap-2 justify-center mt-4 w-full relative">
                    
                    <Image className={`${index > 0 ? 'bg-yellow-400 cursor-pointer' : 'bg-gray-200' }  rounded-full p-2 h-8 w-fit`} src={back} alt='previous' 
                        onClick={()=> 
                        {   
                            if(index < 1)
                                return; 
                            setIndex((prev)=> prev-1)
                        }}
                    />
                    <Image className={`${(mockAnswers[index].isFlagged || mockAnswers[index].answers.length > 0) && index+1 !== mockAnswers.length ? 'bg-yellow-400 cursor-pointer' : 'bg-gray-200' }  rounded-full p-2 h-8 w-fit`} src={next} alt='previous' 
                        onClick={()=> 
                        {
                            if(!(mockAnswers[index].isFlagged || mockAnswers[index].answers.length > 0))
                                return
                            if(index+1 === mockAnswers.length)
                                return
                            setIndex((prev)=> prev+1)
                        }}/>
                    <Image className="h-8 w-fit cursor-pointer absolute b-0 left-0" src={mockAnswers[index].isFlagged ? flagged : flag} alt='previous' 
                        onClick={()=> 
                        {
                            if(!mockAnswers[index].isFlagged)
                                setReviewQuestions((prev)=> [...prev, index])
                            else
                            {
                                const updatedReviewQuestions = reviewQuestions.filter((question)=> question !== index)
                                setReviewQuestions(updatedReviewQuestions)
                            }
                            dispatch(flagQuestion({ index, isFlagged: !mockAnswers[index].isFlagged}))
                        }
                    }/>
                </div>
                {index+1 === mockAnswers.length &&
                <div className="absolute right-8 bottom-8">
                    <Button className='text-xs' onClick={onSubmit}>Finish</Button>
                </div>}
        </div>
        
        
        </div>
    )
}

export default Page