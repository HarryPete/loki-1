import { motion } from "framer-motion";
import { Briefcase, Users, GraduationCap } from "lucide-react";
import founderPicture from '@/assets/founder.png'
import jpmorganLogo from '@/assets/jp-morgan.png'
import standardLogo from '@/assets/standard-chartered.png'
import mashreqLogo from '@/assets/mashreq.png'
import westernLogo from '@/assets/western-union.png'
import brightLogo from '@/assets/bright-money.png'
import Image from "next/image";

const lokeshNaikHighlights = [
  {
    title: "12+ Years of Expertise",
    description: "Setting benchmarks in financial regulation and compliance.",
    icon: "expertise-icon"
  },
  {
    title: "100+ Compliance Strategies",
    description: "Shaped solutions for top-tier banks globally.",
    icon: "strategy-icon"
  },
  {
    title: "25+ Countries Impacted",
    description: "Influenced global financial crime standards.",
    icon: "global-icon"
  },
  {
    title: "5000+ AML Training Sessions",
    description: "Trained professionals in Anti-Money Laundering.",
    icon: "training-icon"
  },
];

export default function InstructorSection() {
  return (
    <div className="sm:px-[10vw] px-[5vw] lg:py-12 md:py-8 py-6">
      <motion.div
        className="flex flex-col items-center justify-center text-white p-10 rounded-2xl shadow-lg"
        style={{
          backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"
        }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Founder Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image
            src={founderPicture}
            alt="Founder"
            className="md:w-48 md:h-48 h-36 w-36 object-cover object-top rounded-full p-1 bg-gray-200"
          />
        </motion.div>

        {/* Heading & Description */}
        <motion.h2
          className="text-base font-bold mt-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Lokesh Naik
        </motion.h2>
        <motion.p
          className="text-sm text-gray-300 mt-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Founder & Lead Instructor
        </motion.p>

        {/* Highlights */}
        <motion.div
          className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {lokeshNaikHighlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="bg-white text-black shadow-md p-4 rounded-xl md:space-y-2 space-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <h1 className="font-semibold">{highlight.title}</h1>
              <p className="leading-loose">{highlight.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Logos */}
        <motion.div
          className="flex justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {[jpmorganLogo, standardLogo, mashreqLogo, westernLogo, brightLogo].map((logo, index) => (
            <Image
              key={index}
              className="sm:h-12 sm:w-12 h-10 w-10 bg-gray-100 rounded-full"
              src={logo}
              alt="logo"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
