
import show from '@/assets/show.png'
import hide from '@/assets/drop.png'
import Image from 'next/image'
import BoxReveal from '@/components/ui/box-reveal'
import { FadeText } from '@/components/ui/fade-text'
import { Card } from '@/components/ui/card'

const Accordian = ({data, index, showFaq, setShowFaq}) =>
{
    return(
        <div className='flex flex-col gap-2 text-white'>
            <div className='flex items-start justify-between gap-2'>
                <BoxReveal boxColor={"var(--primary-color)"} duration={0.5}>
                    <p className={`${showFaq === index+1 ? 'font-semibold'  : ''}`}>{data.question}</p>
                </BoxReveal>
                <Image className='md:h-4 h-3 md:mt-0 mt-2 w-fit cursor-pointer' src={showFaq === index+1 ? show : hide} alt='icon' onClick={()=> setShowFaq((prev)=> prev===index+1 ? 0 : index+1)}/>  
            </div>
            {showFaq !== index+1 && 
            <p className='h-0.5 mt-4 bg-gray-600'></p>}
            {showFaq === index+1 && 
            <div className='rounded mt-4'>
                <FadeText direction="up" framerProps={{ show: { transition: { delay: 0.2 }}}} text={data.answer}/>
            </div>}
        </div>
    )
}

export default Accordian