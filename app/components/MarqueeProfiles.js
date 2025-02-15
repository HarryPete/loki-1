import Marquee from "@/components/ui/marquee"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import linkedin from '@/assets/linkedinn.png'
import { motion } from 'framer-motion'

const MarqueeProfiles = ({isLoading, displayData}) =>
{
    return(
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Marquee className="justify-center overflow-hidden pb-12 [--duration:60s] [--gap:2rem] w-[100%]">
                {isLoading
                  ? [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                      <motion.div
                        className="transition-all flex flex-col items-center p-2 rounded"
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Skeleton className="lg:p-20 md:p-16 p-8 bg-gray-200 shadow-md rounded-full mb-2" />
                        <Skeleton className="p-2 rounded-xl bg-gray-200 mt-2 shadow-md mb-3 w-36" />
                        <Skeleton className="p-1.5 rounded-xl shadow-md w-20 bg-gray-200" />
                      </motion.div>
                    ))
                  : displayData?.recentGraduates?.map((user, index) => (
                      <motion.div
                        className="transition-all flex flex-col items-center p-2 rounded"
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Link className="relative" href={user?.linkedIn ?? ""}>
                          <Image
                            className="lg:h-36 md:h-36 h-24 w-fit aspect-square object-cover rounded-full object-top"
                            src={user?.imageURL ? user?.imageURL : defaultDP}
                            width={100}
                            height={100}
                            alt={user?.name}
                          />
                          <motion.div
                            className="absolute bottom-0 right-2"
                            initial={{ y: 5 }}
                            animate={{ y: 0 }}
                            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                          >
                            <Image
                              className="lg:h-10 md:h-8 h-6 w-fit"
                              src={linkedin}
                              alt={user?.name}
                            />
                          </motion.div>
                        </Link>
                        <h1 className="text-base font-semibold mt-2">{user?.name}</h1>
                        <p className="lg:text-sm text-xxs text-gray-400">{user?.country}</p>
                      </motion.div>
                    ))}
              </Marquee>
            </motion.div>
    )
} 

export default MarqueeProfiles