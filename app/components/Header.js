import user from '@/assets/user.png'
import logo from '@/assets/logo.png'
import settings from '@/assets/settings.png'
import menu from '@/assets/menu.png'
import close from '@/assets/close.png'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
// import Logout from '../logout/Logout'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import Logout from './Logout';
import ProfileSettings from './ProfileSettings';
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import axios from 'axios'
import { motion } from "framer-motion";

const Header = () =>
{
    const router = useRouter();
    const { data, status } = useSession();
    const [ showDetails, setShowDetails ] = useState(false);
    const [ userData, setUserData ] = useState(null); 

    useEffect(()=>
    {
        status === 'authenticated' && getUserData();
    },[status])
    
    const getUserData = async () =>
    {
        try
        {
            const url = `/api/user/${data.user.id}`
            const response = await axios.get(url);
            setUserData(response.data)
        }
        catch(error)
        {
            toast(error.message);
        }
    }

    return(
        <div className='fixed md:text-sm text-xs top-0 z-50 w-[100%] flex items-center justify-between p-5 shadow-lg bg-neutral-100'>
            <Image className='h-8 w-fit aspect-square object-contain rounded-full cursor-pointer' src={logo} style={{
            backgroundImage:
              "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)",
          }} alt='logo' onClick={()=> router.push('/')} />
            <div className='flex items-center gap-4'>
                {data?.user && 
                <div className='flex items-center gap-4'>
                    {(data.user.role === 'admin' || data.user.role === 'user') && <Link href={data.user.role === 'user' ? '/dashboard' : '/admin/dashboard'}>Dashboard</Link>}
                    <Image className='h-8 w-fit cursor-pointer' src={menu} alt='profile' onClick={()=> setShowDetails(true)}/>
                </div>}
            </div>
            
{showDetails && (
  <div
    className="fixed inset-0 bg-black bg-opacity-30 z-50"
    onClick={() => setShowDetails(false)}
  >
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed w-[90%] sm:w-96 top-24 sm:right-5 right-[5%] flex flex-col items-end gap-2 p-6 bg-white shadow-lg rounded-lg"
      onClick={(e) => e.stopPropagation()} // Prevents click inside from closing
    >
      <Image
        className="h-6 w-fit cursor-pointer"
        src={close}
        alt="close"
        onClick={() => setShowDetails(false)}
      />
      <div className="flex gap-4 w-full border-b border-gray-300">
        <Image
          className="h-12 w-12 object-cover rounded-full"
          src={userData?.imageURL ? userData?.imageURL : user}
          height={100}
          width={100}
          alt="user"
        />
        <div className="flex flex-col gap-1 pb-5 w-[100%]">
          <p className="font-semibold">{data.user.name}</p>
          <p className="">{data.user.email}</p>
        </div>
      </div>
      <Link
        href="/settings"
        onClick={() => setShowDetails(false)}
        className="flex items-center gap-4 w-[100%] hover:bg-yellow-400 cursor-pointer py-4 px-2 rounded"
      >
        <Image className="h-6 w-fit" src={settings} alt="settings" />
        <p>Settings</p>
      </Link>
      <Logout />
    </motion.div>
  </div>
)}
            
        </div>
    )
}

export default Header
