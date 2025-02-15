"use client";

import AnimatedCircularProgressBar from "@/components/ui/animated-circular-progress-bar";
import { useEffect, useState } from "react";
import logo from '../../assets/logo.png'
import Image from "next/image";

const Loading = () =>
{
    const [value, setValue] = useState(0);

    useEffect(() => 
    {
        const handleIncrement = (prev) => 
        {
            if (prev === 100)
                return 0;
            return prev + 10;
        };
    
        setValue(handleIncrement);
        const interval = setInterval(() => setValue(handleIncrement), 2000);
    
        return () => clearInterval(interval);
    }, []);

  return (
    <div className="fixed top-0 left-0 z-50 w-[100vw] bg-black bg-opacity-30 h-[100vh] flex justify-center items-center">
        <div className="relative rounded-full" style={{backgroundImage:"radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
        <AnimatedCircularProgressBar
        max={100}
        min={0}
        value={value}
        gaugePrimaryColor="var(--action-color)"
        gaugeSecondaryColor="rgba(0,0,0,0.1)"/>
        <Image className="absolute top-[50%] left-[50%] h-12 w-fit translate-x-[-50%] translate-y-[-50%]" src={logo} alt='FINTS AML'/>
        </div>
    </div>
  );
}

export default Loading
