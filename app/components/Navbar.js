'use client'

import Image from 'next/image'
import logo from '@/assets/logo.png'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import HamburgerMenu from './HamburgerMenu'
import SlidingMenu from './SlidingMenu'
import ProfileSettings from './ProfileSettings'



const Navbar = () =>
{
    const router = useRouter();

    return(
        <div className='absolute top-12 flex justify-between py-6 rounded left-[5%] w-[90%] z-10'>
            <Image className='lg:h-16 h-10 w-fit' src={logo} alt='logo' onClick={()=> router.push('/')}/>  
            <ProfileSettings/>
        </div>
    )
}

export default Navbar
