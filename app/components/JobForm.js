import ForumKey from './ForumKey'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Country, State, City }  from 'country-state-city';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormMessageeFormMessage} from "@/components/ui/form"
import { keywords } from '@/utility/keywords'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title is too short",
  }),
  company: z.string().min(4, {
    message: "Company is a required field",
  }),
  workplaceType: z.string().min(4, {
    message: "Workplace type is a required field",
  }),
  jobType: z.string().min(4, {
    message: "Job type is a required field",
  }),
  country: z.string().min(3, {
    message: "Country is a required field",
  }),
  city: z.string().min(3, {
    message: "City is a required field",
  }),
  experience: z.string().min(1, {
    message: "Experience is a required field",
  }),
  budget: z.string(),
  contact: z.string(),
  description: z.string().min(10, {
    message: "Job description is too short",
  }),
  email: z.string().min(8, {
    message: "Email is a required field",
  }),
  openings: z.string(),
  link: z.string(),
})

const JobForm = () =>
{
    const session = useSession();
    const user = session?.data?.user?.id;
    const countries = Country.getAllCountries();
    const router = useRouter();
    const [ isLoading, setIsLoading ] = useState(false);

    const form = 
        useForm({
            resolver: zodResolver(formSchema),
            defaultValues: 
            {
                title: "",
                company: "",
                workplaceType: "",
                jobType: "",
                country: "",
                city: "",
                experience: "",
                budget: "",
                description: "",
                link: "",
                openings: 1,
                email: "",
                contact: ""
            },
    })
    
    async function onSubmit(data) 
    {
        try
        {
            setIsLoading(true);
            const url = '/api/job'
            const response = await axios.post(url, data);
            toast.success(response.data.message);
            router.push('/')
        }
        catch(error)
        {
            toast.error(error.message);
        } 
        finally
        {
          setIsLoading(false)
        }
    }

    return(
            <Form {...form} >
                <div className='p-4 rounded-xl text-white' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
                  <h1 className="font-semibold">Post a job</h1>
                  <p className='text-gray-400 mt-2 md:text-sm text-xs'>Quickly post job openings and connect with top talent. Simplify your hiring process with our easy-to-use platform – start building your dream team today!</p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 text-xs grid lg:grid-cols-2 grid-cols-1 gap-4 items-start">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Title</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Company</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                <FormField
                control={form.control}
                name="workplaceType"
                render={({ field }) => (
                <FormItem>
                <FormLabel className='md:text-sm text-xs'>Workplace Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='h-10 md:text-sm text-xs'>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className='h-10 md:text-sm text-xs' value="Onsite">On-site</SelectItem>
                  <SelectItem className='h-10 md:text-sm text-xs' value="Hybrid">Hybrid</SelectItem>
                  <SelectItem className='h-10 md:text-sm text-xs' value="Remote">Remote</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          )}
        />

            <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                <FormItem>
                <FormLabel className='md:text-sm text-xs'>Job Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='h-10 md:text-sm text-xs'>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className='h-10 md:text-sm text-xs' value="Fulltime">Full-time</SelectItem>
                  <SelectItem className='h-10 md:text-sm text-xs' value="Internship">Internship</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          )}
        />

            <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                <FormItem>
                <FormLabel className='md:text-sm text-xs'>Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} onChange={()=> handleChange(field.value)}>
                <FormControl className='h-10 md:text-sm text-xs'>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                {countries.map((country)=>
                (
                    <SelectItem className='h-10 md:text-sm text-xs' key={country.isoCode} value={country.name}>{country.name}</SelectItem>
                ))}
                </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
                )}
            />

                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>City</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Experience range ( in years )</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} placeholder="3-5" />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Budget ($)</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

            {/* <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                <FormItem>
                <FormLabel className='md:text-sm text-xs'>City</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='h-10 md:text-sm text-xs'>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                {cities.map((city)=>
                (
                    <SelectItem className='h-10 md:text-sm text-xs' key={city.isoCode} value={city.name}>{city.name}</SelectItem>
                ))}
                </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
                )}
            /> */}

              <FormField
                control={form.control}
                name="openings"
                render={({ field }) => (
                <FormItem>
                <FormLabel className='md:text-sm text-xs'>Openings</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className='h-10 md:text-sm text-xs'>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className='h-10 md:text-sm text-xs' value="1">1</SelectItem>
                  <SelectItem className='h-10 md:text-sm text-xs' value="2">2</SelectItem>
                  <SelectItem className='h-10 md:text-sm text-xs' value="3">3</SelectItem>
                  <SelectItem className='h-10 md:text-sm text-xs' value="4">4</SelectItem>
                  <SelectItem className='h-10 md:text-sm text-xs' value="5">5</SelectItem>
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
          )}
        />

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Job link ( if any )</FormLabel>
                        <FormControl>
                        <Input className='h-10' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

              <div className='lg:col-span-2 col-span-1' >
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Job description</FormLabel>
                        <FormControl>
                        <Textarea className='min-h-16 col-span-2 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />
                </div>

                {/* <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Job link (if any)</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                /> */}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Email</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className='md:text-sm text-xs'>Contact</FormLabel>
                        <FormControl>
                        <Input className='h-10 md:text-sm text-xs' {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>)}
                />

                {isLoading ? 
                <Button className='h-10 w-fit lg:col-span-2 col-span-1' type="submit">
                  <Loader2 className='animate-spin'/>
                </Button> : 
                <Button className='h-10 w-fit lg:col-span-2 col-span-1' type="submit">Post</Button>}
                </form>
            </Form>
        
    )
}

export default JobForm
