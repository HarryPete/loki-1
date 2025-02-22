import Image from "next/image"
import tick1 from '@/assets/tick-light.png'
import tick2 from '@/assets/tick-dark.png'
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const batchVariants = 
{
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
  
const UpcomingBatches = () => 
{
    const router = useRouter()

    return (
      <div className="sm:px-[10vw] px-[5vw] lg:py-12 md:py-8 py-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="text-xl md:text-5xl lg:pb-12 md:pb-8 pb-6 font-bold"
        >
          New Batches – Secure Your Spot!
        </motion.h2>
  
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 items-center leading-loose">
          
          {[
            { title: "CGSS - 4", description: "Comprehensive learning program for aspirants preparing for CGSS certification", tick: tick2, bg: "bg-white text-black", date: 'February 15', link: '/courses/cgss' },
            { title: "CAMS - 0", description: "An accelerated course for individuals aiming to quickly prepare for the CAMS certification", tick: tick1, bg: "bg-gradient-to-b from-gray-800 to-gray-900 text-white", date: 'Fastrack Batch', link: '/courses/cams' },
            { title: "CAMS - 150", description: "Comprehensive learning program for aspirants preparing for CAMS certification", tick: tick2, bg: "bg-white text-black", date: 'February 28', link: '/courses/cams'},
          ].map((batch, index) => (
            <motion.div 
              key={index} 
              variants={batchVariants} 
              initial="hidden" 
              whileInView="visible"
              viewport={{ once: true }}
              className={`p-6 rounded-xl space-y-4 shadow-xl h-fit ${batch.bg}`}
            >
                <span>{batch.date}</span>
              <h1 className="text-xl font-semibold">{batch.title}</h1>
              <p className="text-start">{batch.description}</p>
              <ul className="pt-2 space-y-2">
                <li className="flex gap-2">
                  <Image className="mt-1.5 h-4 w-fit" src={batch.tick} alt="icon" />
                  Intensive and fast-paced learning
                </li>
                <li className="flex gap-2">
                  <Image className="mt-1.5 h-4 w-fit" src={batch.tick} alt="icon" />
                  Expert-curated resources
                </li>
                <li className="flex gap-2">
                  <Image className="mt-1.5 h-4 w-fit" src={batch.tick} alt="icon" />
                  Covers all critical topics in a condensed timeframe with focused study
                </li>
              </ul>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-4 py-2 rounded-3xl"
                  onClick={()=> router.push(batch.link)}
                >
                  Details
                </motion.button>
              </div>
            </motion.div>
          ))}
  
        </div>
      </div>
    );
  }

export default UpcomingBatches