import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Loading from './Loading';
import { Loader2 } from 'lucide-react';

const rating = 
[
    { 
        id: 1, 
        value: 1,
        description: "Min"
    },
    { 
        id: 2, 
        value: 2,
        description: ""
    },
    { 
        id: 3, 
        value: 3,
        description: ""
    },
    { 
        id: 4, 
        value: 4,
        description: ""
    },
    { 
        id: 5, 
        value: 5,
        description: "Max"
    },
]

const Feedback = ({ feedbackForm, setFeedbackForm }) =>
{
    const [ courses, setCourses ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ selectedCourse, setSelectedCourse ] = useState(null)
    const [ value, setValue ] = useState(-1);
    const [ feedback, setFeedbcak ] = useState('');
    const { data, status } = useSession();

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

    const submitFeedback = async (e) =>
    {
        e.preventDefault();

        if(status === 'unauthenticated')
            return 

        try
        {
            const url = '/api/feedback'
            const response = await axios.post(url, {user: data.user.id, course: selectedCourse, rating: value, comment: feedback }) 
            setValue(-1);
            setFeedbcak('');
            setFeedbackForm(false)
            toast(response.data.message)
        }
        catch(error)
        {
            toast(error.message)
        }
    }

    return(
        <Dialog open={feedbackForm} onOpenChange={setFeedbackForm}>
        <DialogTrigger asChild>
            <Button>Feedback</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] space-y-2">
            <DialogHeader>
                <DialogTitle>Course Feedback</DialogTitle>
                <DialogDescription>
                As we approach the end of our current sprint, 
                we value your feedback to help us improve our offerings 
                and provide the best possible experience for you.
                </DialogDescription>
            </DialogHeader>
            {!isLoading  && <Select onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Choose course" />
                </SelectTrigger>
                <SelectContent>
                {courses.map((course)=>
                (
                    <SelectItem className='h-12' value={course._id} key={course._id}>{course.title}</SelectItem>
                ))}
                </SelectContent>
            </Select>}
            <div className='flex gap-4 justify-center'>
            {rating.map((count)=>
            (
                <div className='flex flex-col gap-2 items-center text-xs' key={count.id}>
                    <Button className={`h-10 w-fit rounded-full ${count.value === value ? 'bg-yellow-400 text-white' : ''}`} variant='outline' onClick={()=> setValue(count.value)}>{count.value}</Button>
                    <span>{count.description}</span>
                </div>
            ))}
            </div>
            <Textarea placeholder='Feedback' value={feedback} onChange={(e)=> setFeedbcak(e.target.value)}/>
            {isLoading ? <Button className='lg:h-12 h-10 text-md'>
                <Loader2 className='animate-spin'/>
            </Button> :
            <Button onClick={submitFeedback}>Submit</Button>}
        </DialogContent>
        </Dialog>
    )
}

export default Feedback