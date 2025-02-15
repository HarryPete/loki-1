'use client'

import Image from 'next/image'
import logo from '@/assets/logo.png'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'

const Navbar = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data } = useSession();

    return (
        <div className='absolute top-12 flex items-center justify-between py-6 rounded lg:left-[10%] w-[90%] left-[5%] lg:w-[80%] z-20'>
            {/* Logo */}
            <Image 
                className='md:h-10 h-8 w-fit cursor-pointer' 
                src={logo} 
                alt='logo' 
                onClick={() => router.push('/')} 
            />  
          
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
                {(data?.user?.role === 'user' || data?.user?.role === 'admin') && <a href="/dashboard" className="hover:text-gray-400 transition">Dashboard</a>}

                {/* Courses with Dropdown */}
                <div 
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <div className="flex items-center space-x-1">
                        <span className="hover:text-gray-400 transition">Courses</span>
                        <ChevronDown size={16} />
                    </div>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-9 left-0 bg-white shadow-lg rounded-md py-2 w-40"
                            >
                                <a href="/courses/cams" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">CAMS</a>
                                <a href="/courses/cgss" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">CGSS</a>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {!(data?.user?.role) ? <a href="/login" className="hover:text-gray-400 transition">Login</a> : 
                <div className='flex items-center gap-2'>
                    <User size={16} className='text-blue-500'/>
                    <span className='text-neutral-400'>{data.user.name.split(' ')[0]}</span>
                </div>}
            </div>
            
            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsOpen(true)}>
                <Menu size={28} />
            </button>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 flex items-center justify-center bg-white"
                    >
                        {/* Close Button */}
                        <button className="absolute top-4 right-4 text-black" onClick={() => setIsOpen(false)}>
                            <X size={24} />
                        </button>

                        {/* Mobile Links */}
                        <div className="flex flex-col items-start justify-center w-30 space-y-8 text-sm">
                            {(data?.user?.role === 'user' || data?.user?.role === 'admin') && <a href="/dashboard" className="text-gray-800 text-base hover:text-gray-600 transition">Dashboard</a>}

                            {/* Mobile Courses with Dropdown */}
                            <div className="text-gray-800 cursor-pointer">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-1">
                                    <span className='text-base'>Courses</span>
                                    <ChevronDown size={16} />
                                </button>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="flex flex-col mt-2 space-y-2"
                                        >
                                            <a href="/courses/cams" className="text-gray-600 text-base hover:text-gray-400 transition">CAMS</a>
                                            <a href="/courses/cgss" className="text-gray-600 text-base hover:text-gray-400 transition">CGSS</a>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {!(data?.user?.role) && <a href="/login" className="text-gray-800 hover:text-gray-600 text-base transition">Login</a>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Navbar
