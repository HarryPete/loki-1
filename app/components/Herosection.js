'use client'

import { motion } from "framer-motion";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import Navbar from "./Navbar";

const avatars = [
    {
        imageUrl: "https://res.cloudinary.com/dzuaagm1a/image/upload/v1735372630/karanvir_jga0tj.jpg",
        profileUrl: "https://www.linkedin.com/in/mr-index-karanvir-chouhan-acams-66ab3a78/",
    },
    {
      imageUrl: "https://res.cloudinary.com/dzuaagm1a/image/upload/v1735371846/deepshika_nzikle.jpg",
      profileUrl: "https://www.linkedin.com/in/cs-deepshikha-srivastava-49264177/",
    },
    {
      imageUrl: "https://res.cloudinary.com/dzuaagm1a/image/upload/v1735372786/sara_vsc52l.jpg",
      profileUrl: "http://linkedin.com/in/sara-alsaegh",
    },
    {
      imageUrl: "https://res.cloudinary.com/dzuaagm1a/image/upload/v1735322764/profiles/kdkzowuba72xwry4wgij.jpg",
      profileUrl: "https://www.linkedin.com/in/nagesh-bangera-cams-417b2279/",
    },
    {
      imageUrl: "https://res.cloudinary.com/dzuaagm1a/image/upload/v1735373073/vibitha_adma3f.jpg",
      profileUrl: "https://www.linkedin.com/in/vibitha-vijayan-9199b12b2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    },
    {
      imageUrl: "https://res.cloudinary.com/dzuaagm1a/image/upload/v1735372493/aslam_qoi4yu.jpg",
      profileUrl: "www.linkedin.com/in/mohamed-aslam-28b826276",
    }
  ];
  

  const HeroSection = () => {
    return (
      <div className="text-white text-base">
        <div
          className="md:h-[80vh] h-[100vh] pt-[15vh] w-full flex items-center justify-center relative"
          style={{
            backgroundImage:
              "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)",
          }}
        >
          <Navbar />
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:space-y-10 space-y-6 flex flex-col items-center"
          >
            <motion.h1
              className="text-4xl md:text-7xl font-bold text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Master{" "}
              <motion.span
                className="md:inline block bg-yellow-400 md:p-2 md:mt-0 mt-2 p-2 rounded-lg text-black"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                AML & Beyond
              </motion.span>
            </motion.h1>
  
            <motion.p
              className="font-normal max-w-3xl text-center mx-auto leading-loose md:text-base text-sm px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Unlock your potential in anti-money laundering and sanctions
              compliance with expert-led learning, practical applications, and
              real-world case studies
            </motion.p>
  
            <motion.div
              className="flex md:flex-row flex-col justify-center items-center gap-6 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <AvatarCircles numPeople={99} avatarUrls={avatars} />
              <p className="text-center md:text-base text-sm md:text-start leading-loose ">
                See why a growing number of emerging leaders trust us to elevate
                their skills.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

export default HeroSection
