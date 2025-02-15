import Image from 'next/image'
import founder from '@/assets/founder.png'
import linkedin from '@/assets/linkedin.png'
import success from '@/assets/success.png'
import jpmorganLogo from '@/assets/jp-morgan.png'
import standardLogo from '@/assets/standard-chartered.png'
import mashreqLogo from '@/assets/mashreq.png'
import westernLogo from '@/assets/western-union.png'
import brightLogo from '@/assets/bright-money.png'
import Marquee from '@/components/ui/marquee'
const lokeshNaikHighlights = [
    {
      title: "10+ Years of Expertise",
      description: "Setting benchmarks in financial regulation and compliance.",
      icon: "expertise-icon"
    },
    {
      title: "100+ Compliance Strategies",
      description: "Shaped solutions for top-tier banks globally.",
      icon: "strategy-icon"
    },
    {
      title: "15+ Countries Impacted",
      description: "Influenced global financial crime standards.",
      icon: "global-icon"
    },
    {
      title: "5000+ AML Training Sessions",
      description: "Trained professionals in Anti-Money Laundering.",
      icon: "training-icon"
    },
    // {
    //   title: "1 Visionary Leader",
    //   description: "Redefining compliance with innovative leadership.",
    //   icon: "leadership-icon"
    // },
    // {
    //   title: "Thousands Guided",
    //   description: "Mentored professionals to excel in compliance.",
    //   icon: "excellence-icon"
    // }
  ];
  
    

const Founder = () =>
{

    return(
        <div className='rounded-xl relative flex flex-col gap-4 md:p-12 bg-white shadow-md p-6 lg:w-[800px] md:w-[600px] w-full'>
             <div className='space-y-8 flex flex-col items-center pb-4'>
                <div className='flex flex-col lg:flex-row justify-between gap-4 w-full'>
                    <div className='z-10 flex lg:flex-row flex-col lg:items-end justify-end items-center gap-4'>
                        <a href='https://www.linkedin.com/in/lokesh-naik-amltrustedsource/' target='_blank'>
                            <Image className='h-32 w-32 bg-gray-100 p-1 rounded-full object-cover object-top' src={founder} alt='Lokesh Naik'/>
                        </a> 
                        <div>
                        <p className='font-semibold'>Lokesh Naik</p>
                        <p className='font-sm lg:text-start text-center text-gray-400'>India</p>
                        </div>
                    </div>
                    <div className='lg:w-[25%] w-full grid grid-cols-2 lg:gap-2 md:gap-4 gap-2 z-10'>
                        <div className='text-center flex flex-col items-center'>
                            <h1 className='font-semibold'>CAMS</h1>
                            <Image className='h-16 w-fit' src={success} alt='certified'/>
                        </div>
                        <div className='text-center flex flex-col items-center'>
                            <h1 className='font-semibold'>CGSS</h1>
                            <Image className='h-16 w-fit' src={success} alt='certified'/>
                        </div>
                    </div>
                </div>
                <div className='z-10 grid sm:grid-cols-2 grid-cols-1 gap-4 relative'>
                {lokeshNaikHighlights.map((highlight, index)=>
                (
                    <div key={index} className='space-y-2 gap-2 items-center shadow-md p-4 rounded-xl'>
                        <h1 className='font-semibold'>{highlight.title}</h1>
                        <p className='text-gray-400 leading-loose'>{highlight.description}</p>
                    </div>
                ))}              
                </div>
            </div>
            <div className='z-10 flex justify-center gap-4'>
                <Image className='sm:h-16 sm:w-16 h-10 w-10 bg-gray-100 rounded-full' src={jpmorganLogo} alt='logo'/>
                <Image className='sm:h-16 sm:w-16 h-10 w-10 bg-gray-100 rounded-full' src={standardLogo} alt='logo'/>
                <Image className='sm:h-16 sm:w-16 h-10 w-10 bg-gray-100 rounded-full' src={mashreqLogo} alt='logo'/>
                <Image className='sm:h-16 sm:w-16 h-10 w-10 bg-gray-100 rounded-full' src={westernLogo} alt='logo'/>
                <Image className='sm:h-16 sm:w-16 h-10 w-10 bg-gray-100 rounded-full' src={brightLogo} alt='logo'/>
            </div>
            
        </div>
    )
}

export default Founder