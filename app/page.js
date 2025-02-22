'use client'

import { useEffect, useState } from 'react'
import HeroSection from './components/Herosection'
import Footer from './components/Footer'
import axios from 'axios'
import { toast } from 'sonner'
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'
import WorldMap from '@/components/ui/world-map'
import CourseTimeline from './components/CourseTimeline'
import CourseBenefits from './components/CourseBenefits'
import InstructorSection from './components/InstructorSection'
import FAQ from './components/FAQ'
import StatSection from './components/StatSection'
import UpcomingBatches from './components/UpcomingBatches'
import MarqueeProfiles from './components/MarqueeProfiles'
import ReferralSection from './components/ReferralSection'

const Home = () =>
{
    const [ displayData, setDisplayData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

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
