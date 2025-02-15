'use client'

import { useEffect, useState } from 'react'
import { faqData } from '@/utility/faqData'
import chat from '@/assets/chat.png'
import defaultDP from '@/assets/defaultDP.png'
import linkedin from '@/assets/linkedinn.png'
import live from '@/assets/live.png'
import material from '@/assets/material.png'
import record from '@/assets/record.png'
import mock from '@/assets/mock.png'
import discussion from '@/assets/discussion.png'
import placement from '@/assets/placement.png'

import globe from '@/assets/globe.png'
import compliance from '@/assets/compliance.png'
import career from '@/assets/career.png'
import goal from '@/assets/goal.png'


import organisation from '@/assets/organisation.png'
import prevention from '@/assets/prevention.png'
import verified from '@/assets/verified.png'
import updated from '@/assets/updated.png'
import success from '@/assets/success.png'

import Image from 'next/image'
import HeroSection from './components/Herosection'
import Accordian from './components/Accordian'
import Footer from './components/Footer'
import Query from './components/Query'
import Marquee from '@/components/ui/marquee'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import RequestForm from './components/RequestForm'
import axios from 'axios'
import { toast } from 'sonner'
import Rating from './components/Rating'
import Link from 'next/link'
import Founder from './components/Founder'
import { Skeleton } from '@/components/ui/skeleton'
import { FormatDate } from '@/utility/FormatDate'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'
import WorldMap from '@/components/ui/world-map'
import { WobbleCard } from '@/components/ui/wobble-card'
import CourseTimeline from './components/CourseTimeline'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import CourseBenefits from './components/CourseBenefits'
import ContactForm from './components/ContactForm'
import InstructorSection from './components/InstructorSection'
import FAQ from './components/FAQ'
import StatSection from './components/StatSection'
import { cn } from '@/lib/utils'
import { DotPattern } from '@/components/magicui/dot-pattern'
import UpcomingBatches from './components/UpcomingBatches'
import MarqueeProfiles from './components/MarqueeProfiles'
import ReferralSection from './components/ReferralSection'

const heroData =
[
    {
        id: 1,
        image: live,
        header: 'Live Classes',
        detail: 'Engage with live, interactive sessions led by industry experts.'
    },
    {
        id: 2,
        image: material,
        header: 'Curated Study Materials',
        detail: 'Detailed notes, summaries, and cheat sheets for quick revision'
    },
    {
        id: 3,
        image: record,
        header: 'Recorded Sessions',
        detail: 'Recorded sessions for you to review anytime, anywhere.'
    },
    {
        id: 4,
        image: mock,
        header: 'Mock Tests',
        detail: 'Test your knowledge with our carefully designed mock exams..'
    },
    {
        id: 5,
        image: discussion,
        header: 'Forum',
        detail: 'Ask questions and collaborate with peers preparing for the same exams'
    },
    {
        id: 6,
        image: placement,
        header: 'Referrals',
        detail: 'Benefit from job referrals and career guidance through our strong alumni network'
    }
]

const roadmap = [
  {
    weeks: "1–2",
    focus: "Build the Foundation",
    description:
      "Understand the basics of compliance, AML, and sanctions frameworks. Study key principles, terminologies, and regulatory bodies like FATF, OFAC, and EU laws.",
  },
  {
    weeks: "3–4",
    focus: "Deep Dive into Regulations and Risks",
    description:
      "Explore AML laws, sanctions compliance programs, risk assessment strategies, money laundering typologies, and sanctions evasion tactics through detailed study.",
  },
  {
    weeks: "5–6",
    focus: "Practical Application and Testing",
    description:
      "Engage in case studies, quizzes, and scenarios to apply knowledge. Practice compliance measures, risk mitigation strategies, and take initial mock tests.",
  },
  {
    weeks: "7-9",
    focus: "Initial Mock Tests and Analysis",
    description:
      "Take one full-length mock test per week for both CAMS and CGSS. Analyze performance, identify weak areas, and revise key topics to build confidence.",
  },
  {
    weeks: "10–11",
    focus: "Advanced Mock Tests and Refinement",
    description:
      "Take two full-length mock tests per week for each certification. Focus on high-weightage topics, refine time management, and ensure consistent performance.",
  },
];

const numbers =
[
    {
        id: 1,
        title: 'Courses',
        number: '2'
    },
    {
        id: 2,
        title: 'Batches',
        number: '150+'
    },
    {
        id: 3,
        title: 'Success Stories',
        number: '1000+'
    },
]

  const whyCamsAndCgss = [
    {
      id: 1,
      color: 'bg-pink-800',
      icon: compliance, // Replace with actual icons or paths to images
      header: "Regulatory Compliance",
      description: "Increasing regulatory scrutiny demands professionals skilled in AML and sanctions compliance.",
    },
    {
      id: 2,
      color: 'bg-blue-900',
      icon: career,
      header: "Career Opportunities",
      description: "Certifications open high-paying career opportunities in compliance and risk management.",
    },
    {
      id: 3,
      icon: prevention,
      color: 'bg-green-800',
      header: "Financial Crime Prevention",
      description: "They provide tools to identify and prevent financial crimes like money laundering and fraud.",
    },
    {
      id: 4,
      icon: updated,
      color: 'bg-yellow-600',
      header: "Stay Updated",
      description: "Keep professionals updated with evolving financial crime techniques and sanctions frameworks.",
    },
    {
      id: 5,
      icon: globe,
      color: 'bg-violet-800',
      header: "Global Recognition",
      description: "CAMS and CGSS are globally recognized, enhancing professional credibility.",
    },
    // {
    //   id: 6,
    //   icon: organisation,
    //   header: "Organizational Compliance",
    //   description: "Help organizations avoid fines, sanctions, and reputational damage by ensuring compliance.",
    // },
    // {
    //   id: 7,
    //   icon: risk,
    //   header: "Risk Mitigation",
    //   description: "Build expertise in assessing and mitigating financial and sanctions-related risks.",
    // },
    {
      id: 8,
      icon: goal,
      color: 'bg-gray-800',
      header: "Professional Commitment",
      description: "Demonstrate commitment to compliance and readiness for specialized challenges.",
    },
  ];
  

const Home = () =>
{
    const [ showFaq, setShowFaq ] = useState(0);
    const [ displayData, setDisplayData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const { status, data } = useSession();
    const [ applyLoading, setApplyLoading ] = useState(false);

    useEffect(()=>
    {
      getDisplayData();
    },[])

    const getDisplayData = async () =>
    {
      try
      {
        const url = '/api/display'
        const response =await axios.get(url);
        setDisplayData(response.data[0])
      }
      catch(error)
      {
        toast(error.message)
      }
      finally
      {
        setIsLoading(false);
      }
    }

    const handleInterest = async (job) =>
    {
      try
      {
        setApplyLoading(true)
        const jobData = {...job, interests: [...job.interests, data.user.id]}
        const url = `/api/job/${job._id}`
        const response = await axios.put(url, jobData);
        toast.success(response.data.message);
        getDisplayData();
      }
      catch(error)
      {
        toast.error(error.message)
      }
      finally
      {
        setApplyLoading(false)
      }
    }

    return(
        <div className='md:text-sm text-xs leading-loose'>
            
            <HeroSection isLoading={isLoading} displayData={displayData}/>
            <div>
              <StatSection/>
              <WorldMap dots={[
                {
                  start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                  end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
                },
                {
                  start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                  end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                },
                {
                  start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                  end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                },
                {
                  start: { lat: 51.5074, lng: -0.1278 }, // London
                  end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                },
                {
                  start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                },
                {
                  start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                },
                {
                  start: { lat: 20.5937, lng: 78.9629 }, // India
                  end: { lat: -25.2744, lng: 133.7751 }, // Australia
                }]}/>
                
              <MarqueeProfiles isLoading={isLoading} displayData={displayData}/>
              </div>
              <UpcomingBatches/>
              <CourseBenefits/>
              <ReferralSection/>
              <CourseTimeline/>
              <InstructorSection/>
              <AnimatedTestimonials testimonials={displayData?.feedbacks} isLoading={isLoading} />
              <FAQ/>
              <Footer/>
      </div>
    )
}

export default Home

{/* <div className='sm:px-[10vw] px-[15vw] py-12'>
            <h1 className='font-semibold w-full flex items-center justify-center gap-2 md:text-xl lg:text-2xl text-lg mb-8'>Fints AML Referrals</h1>
            {isLoading ?
            <div className='grid md:grid-cols-3 grid-cols-1 w-full rounded gap-5'>
            {[1,2,3].map((_,index)=>(
              <Card className='space-y-6 p-8' key={index}>
                  <div className='space-y-4'>
                    <Skeleton className='w-[60%] p-2 shadow-md bg-gray-200 rounded'/>
                    <Skeleton className='w-[50%] p-2 shadow-md bg-gray-200 rounded'/>
                  </div>
                  <div className='space-y-3'>
                    <Skeleton className='p-1.5 w-[50%] rounded-xl bg-gray-200'/>
                    <Skeleton className='p-1.5 w-[50%] rounded-xl bg-gray-200'/>
                  </div>
                  <Skeleton className='p-0.5 rounded-xl bg-gray-200'/>
                  <div className='flex justify-between items-end'>
                  <div className='space-y-3'>
                    <div className='flex gap-2'>
                      <Skeleton className='p-3 w-12 rounded bg-gray-200'/>
                      <Skeleton className='p-3 w-12 rounded bg-gray-200'/>  
                    </div>
                    <Skeleton className='p-1.5 rounded bg-gray-200 w-56'/>
                  </div>
                    <Skeleton className='p-4 rounded bg-gray-200 w-20'/>
                  </div>
              </Card>
            ))}
            </div> :
            <Carousel >
            <CarouselContent>
            
            {displayData?.recentJobs?.map((job, index) => (
            <CarouselItem key={job._id} className='lg:basis-1/3'>
              <Card>
                <CardContent className="p-6 text-start">
                   <div className="font-semibold">
                      <p className='text-start'>{job.title}</p>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    
                  <div>
                    <p><span>Experience : </span>{job.experience} years</p>
                    <p className="pb-4"><span>Location : </span>{job.city +', ' +job.country}</p>
                    <p className="pb-4"><span>Openings : </span>{job.openings}</p>
                  </div>
                  <p className="border-t py-4">{job.description}</p>
                  <footer className="flex text-xs md:flex-row flex-col justify-between md:items-end items-start space-y-2 w-full border-t pt-6">
                    <div className='md:space-y-2 space-y-4'>
                    <div className="space-x-2">
                      <span className="bg-gray-200 p-1 rounded">{job.jobType}</span>
                      <span className="bg-gray-200 p-1 rounded">{job.workplaceType}</span>
                    </div>
                    <p className="text-muted-foreground">Posted on {FormatDate(job.createdAt)}</p>
                    </div>
                    {data?.user?.id && 
                    (!job.interests.includes(data.user.id) ? (applyLoading ? <Button className='w-20'><Loader2 className='animate-spin'/></Button> : <Button className='h-8 text-xs' onClick={()=> handleInterest(job)}>Show interest</Button>) : 
                    <div className='rounded p-2 py-0.5 gap-1 bg-gray-100 flex items-center'>
                      <span>Applied</span>
                      <Image className='h-4 w-4' src={verified} alt='icon'/>
                    </div>)}
                  </footer>     
                </CardContent>
              </Card>
          </CarouselItem>
          ))}
          </CarouselContent>
          <CarouselPrevious/>
          <CarouselNext />
          </Carousel>}
          </div> */}