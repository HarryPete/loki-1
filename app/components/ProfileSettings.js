import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import logo from '@/assets/logo.png'
import { FormatDate } from "@/utility/FormatDate"
import { useSession } from "next-auth/react"
import Link from "next/link"
import Image from "next/image"

const ProfileSettings = () =>
{
    const { data } = useSession()

    console.log(data)

    return (
        <Sheet>
        <SheetTrigger asChild>
        <div className="space-y-1 cursor-pointer">
            <div className="px-4 py-0.5 rounded" style={{backgroundColor:'var(--action-color)'}}></div>
            <div className="px-4 py-0.5 rounded" style={{backgroundColor:'var(--action-color)'}}></div>
            <div className="px-4 py-0.5 rounded" style={{backgroundColor:'var(--action-color)'}}></div>
        </div>
        </SheetTrigger>
        <SheetContent className='text-sm md:text-base'>
            <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
            </SheetHeader>
            
            <Image className='lg:h-16 h-12 w-fit aspect-square object-cover p-2 mb-4 rounded-full' style={{backgroundColor: 'var(--primary-color)'}} src={logo} alt='logo' onClick={()=> router.push('/')}/> 
            <div className='flex flex-col gap-2 bg-gray-100 rounded shadow-lg'>
                {(data?.user?.role === 'user' || data?.user?.role === 'admin') && <Link className=' hover:bg-yellow-400 p-4 rounded' href='/dashboard'>Dashboard</Link>}
                <Link className=' hover:bg-yellow-400 p-4 rounded' href='/courses'>Courses</Link>
                <Link className=' hover:bg-yellow-400 p-4 rounded' href='/about'>About</Link>
                {(data?.user?.role === 'visitor' || !data?.user?.role) && <Link className=' hover:bg-yellow-400 p-4 rounded' href='/signup' >Signup</Link>}
            </div>  
            <h1 className="md:text-xl text-lg py-4 font-semibold text-yellow-400">Upcoming batch</h1>
            <div className="bg-gray-100 rounded space-y-2 p-4 shadow-lg">
                <h1>CAMS - 148</h1>
                <p className="text-gray-400">Starting from Jaunuary 17, 2025</p>
            </div>
            <h1 className="md:text-xl text-lg py-4 font-semibold text-yellow-400">Offers</h1>
            <div className="bg-gray-100 rounded space-y-2 p-4 shadow-lg" >
                <div className="flex justify-between">
                    <h1>AML20</h1>
                    <p>20% off</p>
                </div>
                <p className="text-gray-400">Valid till January 20</p>
            </div>

            </SheetContent>
    </Sheet>    
  )
}

export default ProfileSettings
