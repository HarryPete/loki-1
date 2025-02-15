'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Lecturecard from './LectureCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { ArrowBigDown, ArrowBigUp, ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react'

export const details =
[
    {
        id: 1,
        header: 11,
        detail: 'Weeks'
    },
    {
        id: 2,
        header: 32,
        detail: 'Sessions'
    },
    {
        id: 3,
        header: 17,
        detail: 'Learning Sessions'
    },
    {
        id: 4,
        header: 15,
        detail: 'Practice Sessions'
    }
]

const CourseDetail = ({course, level}) =>
{
    const router = useRouter();
    const [openLecture, setOpenLecture] = useState(null);

  const toggleLecture = (index) => {
    setOpenLecture(openLecture === index ? null : index);
  };

    const handleClick = () =>
    {
        localStorage.setItem('selectedCourse', course.id)
        router.push('/cart')
    }

    return (
        <div className='flex flex-col gap-4 w-full'>
            <div className='md:h-[50vh] h-48 rounded-xl flex items-center justify-center shadow-lg relative' style={{
            backgroundImage:
              "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)",
          }}>
                <Image className='object-contain rounded' src={course.imageURL} alt={course.title} layout='fill'/>
            </div>
            
            {level === 'visitor' && <Button onClick={handleClick} className='w-fit text-xs'>Join Now</Button>}
            
            {/* <p className='lg:text-3xl md:text-2xl text-xl font-bold'>{course.title}</p> */}
            <div className='grid lg:grid-cols-4 grid-cols-2 gap-4'>
            {details.map((data)=>
            (
                <div key={data.id} className='flex flex-col items-center p-4 space-y-2'>
                    <span className='font-semibold md:text-base text-sm'>{data.detail}</span>
                    <h1 className='font-semibold md:text-3xl text-xl'>{data.header}</h1>
                    
                </div>
            ))}
            </div>
            
            <div className="">
      <div className="relative">
        {course.lectures.map((lecture, index) => (
          <div key={index} className="relative border-l-4 border-gray pl-4" >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-3 h-3 bg-black rounded-full -left-2 top-7"
            ></motion.div>
            <button
              className="w-full flex justify-between items-center p-5 hover:bg-yellow-400 rounded-md"
              onClick={() => toggleLecture(index)}
            >
              <span className="font-semibold text-left">{lecture.title}</span>
              {openLecture === index ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openLecture === index && (
              <motion.ul 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 space-y-4 rounded-md"
              >
                {lecture.modules.map((topic, i) => (
                  <li key={i} className="text-gray-700 pl-2">{topic}</li>
                ))}
              </motion.ul>
            )}
          </div>
        ))}
      </div>
    </div>
        </div>
    )
}

export default CourseDetail