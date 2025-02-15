'use client';

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReferralSection()
{
    const router = useRouter()

  return (
    <div className="sm:px-[10vw] px-[5vw] lg:py-12 md:py-8 py-6 text-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col bg-yellow-400 p-8 rounded-2xl shadow-lg"
      >
        {/* Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Briefcase className="md:w-10 md:h-10 w-8 h-8 text-black" />
        </motion.div>

        {/* Heading Animation */}
        <motion.h2
          className="lg:text-3xl md:text-xl text-lg font-bold mt-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Exclusive Referrals for Our Learners
        </motion.h2>

        {/* Description Animation */}
        <motion.p
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        >
          Get access to premium referrals and career opportunities available only to our learners.
        </motion.p>

        {/* Button Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 space-x-2 "
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 font-semibold bg-white hover:bg-gray-50 rounded-lg transition"
            onClick={()=> router.push('/courses/cams')}
          >
            CAMS
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 font-semibold bg-white hover:bg-gray-50 rounded-lg transition"
            onClick={()=> router.push('/courses/cgss')}
          >
            CGSS
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
