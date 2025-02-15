import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import verified from '@/assets/tick-dark.png';

const extraData = [
  'Recorded Lectures',
  '10+ Mock Tests',
  '1:1 Sessions',
  'Exclusive Study Guides',
  'Lifetime Forum Access',
  'Exam Strategies',
  'Job Assistance',
];

const CourseCard = ({ level, course }) => {
  return (
    <Link href={level === 'admin' ? `/admin/courses/${course.id}` : `/courses/${course.id}`}>
      <motion.div
        whileHover={{ scale: 1.00 }}
        whileTap={{ scale: 0.95 }}
        className='relative group cursor-pointer'
        
      >
        <Card  style={{
            backgroundImage:
              "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)",
          }} className='space-y-4 p-6 bg-white shadow-xl rounded-xl text-xs md:text-sm transition duration-300'>
          <div className='relative w-full flex items-center justify-center rounded-lg overflow-hidden'>
            <Image
              src={course.imageURL}
              alt={course.title}
              width={100}
              height={100}
              className='object-cover h-40 w-fit group-hover:scale-105 transition-transform duration-300'
            />
        </div>

        <h3 className='font-semibold text-white text-center'>{course.title}</h3>
          
        </Card>
      </motion.div>
    </Link>
  );
};

export default CourseCard;