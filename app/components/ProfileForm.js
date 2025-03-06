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
  
  name: z.string().min(7, {
    message: "Name is required",
  }),
  email: z.string().min(3, {
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password is too short",
  })
})

const ProfileForm = ({newUser, setNewUser}) =>
{

  const [ isLoading, setIsLoading ] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
      defaultValues: 
      {
        name: "",
        email: "",
        password: ""
      },
    })

    async function onSubmit(data) 
    {
        try
        {   
            setIsLoading(true);
            const url = '/api/user/signup'
            const response = await axios.post(url, data);
            if(response.data.status === 201)
            {
              toast.success(response.data.message);
              form.reset({name: "",email: "", password: ""})
            }
            else    
              toast.error(response.data.message);
            setNewUser(false)
        }   
        catch(error)
        {
            console.log(error)
        }
        finally
        {
          setIsLoading(false)
        }
    }

    if(isLoading)
        return <Loading/>

    return (
    <Dialog open={newUser} onOpenChange={setNewUser}>
        <DialogTrigger asChild>
            <Button className='h-10 text-xs md:text-sm'>New Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create new profile</DialogTitle>
                <DialogDescription>
                    Register with valid email and password
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            
              <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
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
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
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
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                        <Input className='md:h-12 h-10 text-sm' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />
    
                {isLoading ? 
                <Button className='md:h-12 h-10 text-sm w-full'>
                  <Loader2 className='animate-spin'/>
                  Registering...
                </Button>
                : <Button type="submit" className='md:h-12 h-10 text-sm w-full'>Register</Button>}
              </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default ProfileForm

