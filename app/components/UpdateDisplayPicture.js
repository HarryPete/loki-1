import { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Image from 'next/image';
import defaultDP from '../../assets/defaultDP.png'
import device from '../../assets/device.png'
import close from '../../assets/close.png'
import Loading from './Loading';

const UpdateDisplayPicture = ({ level, userData, getUserData, editDP, setEditDP, getBatch }) =>
{

    const [ isLoading, setIsLoading ] = useState(false)

    const UpdateDP = async (file) =>
    {
        try
        {
            
            setIsLoading(true)
            const data = { imageURL: file }
            const url = `api/user/${userData._id}`
            const response = await axios.put(url, data);
            if(level === 'admin')
                getBatch();
            else
                getUserData();
            toast(response.data.message);
            setEditDP(false)
        }   
        catch(error)
        {
            toast(error)
        }
        finally
        {
            setIsLoading(false)
        }   
    }

    const handleFileChange = async (e) => 
    {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onloadend = () => 
        {
            UpdateDP(reader.result); // Convert file to base64
        };
        reader.readAsDataURL(file);
    };

    if(isLoading)
        return <Loading/>

    return(
        <Dialog open={editDP} onOpenChange={setEditDP}>
        <DialogTrigger asChild>
            <Image className='cursor-pointer md:h-32 w:h-24 md:w-32 bg-white object-cover w-24 shadow-md aspect-square object-top rounded-full' 
            src={userData?.imageURL ? userData?.imageURL : defaultDP} width={100} height={100} alt='user'/>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] space-y-0.5">
            <DialogHeader>
                <DialogTitle>Display Picture</DialogTitle>
                <DialogDescription>
                    Edit your display picture here
                </DialogDescription>
            </DialogHeader>
            
            <label htmlFor="file-input" className='hover:bg-gray-100 p-3 md:text-sm text-xs flex items-center gap-4 rounded cursor-pointer'>
                <Image className='h-7 w-fit' src={device} width={100} height={100} alt='user'/>
                <span>Upload from device</span>
            </label>
            <Input type='file' id="file-input" className='md:h-12 h-10 md:text-sm text-xs hidden' onChange={handleFileChange} />
            <div className='hover:bg-gray-100 p-3 md:text-sm text-xs flex items-center gap-4 rounded'>
                <Image className='h-7 w-fit' src={close} width={100} height={100} alt='user'/>
                <span>Remove display picture</span>
            </div>
            <Input type='file' id="file-input" className='md:h-12 h-10 md:text-sm text-xs hidden' onChange={handleFileChange} />
        </DialogContent>
        </Dialog>
    )
}

export default UpdateDisplayPicture