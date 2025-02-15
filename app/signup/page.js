'use client'

import logo from '../../assets/logo.png'
import Image from 'next/image';
import successicon from '../../assets/success-icon.png'
import erroricon from '../../assets/error-icon.png'
// import { credentialLogin, googleLogin } from '@/app/action';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleAuth from '../components/GoogleAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Signup = () =>
{   
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ error, setError ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState('')
    const [ success, setSuccess ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setSuccess(false)
        setSuccessMessage('')

        const formData = new FormData(e.currentTarget);

        if(!formData.get('name')) 
        {
            setError(true);
            setErrorMessage('Name is required')
            return
        } 

        if(!formData.get('email')) 
        {
            setError(true);
            setErrorMessage('Email is required')
            return
        } 

        if(!formData.get('password')) 
        {
            setError(true);
            setErrorMessage('Password is required')
            return
        } 

        if(formData.get('password').length < 6) 
        {
            setError(true);
            setErrorMessage('Password is too short')
            return
        } 

        setError(false)
        setErrorMessage('')

        try
        {
            const url = '/api/user/signup'
            const response = await axios.post(url, 
                {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                })
            if(response.data.status !== 201)
            {
                setError(true)
                setErrorMessage(response.data.message)
            }
            else
            {
                setSuccess(true)
                setSuccessMessage(response.data.message)
                setTimeout(()=>
                {
                    router.push('/login')
                },500)
            }
        }
        catch(error)
        {
            setError(true)
            setErrorMessage(error.message)
        }
    }

    return(
        <div className='h-[100vh] flex items-center justify-center' style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}}>
            <div className='bg-white rounded-xl w-96 p-8'> 
                <div className='flex justify-center cursor-pointer mb-4'>
                    <Image className='h-12 w-fit' src={logo} alt='logo' onClick={()=> router.push('/')}/>
                </div>
                <div className='w-full flex flex-col gap-4 items-center'>
                    <form className='flex flex-col w-full gap-4'onSubmit={handleSubmit}>
                        <Input className='h-12 bg-neutral-50' name="name" type="text" placeholder="Name" />
                        <Input className='h-12 bg-neutral-50' name="email" type="text" placeholder="Email" />
                        <Input className='h-12 bg-neutral-50' name="password" type="text" placeholder="Password" />

                        {error && 
                        <div className='flex gap-2 items-center text-sm'>
                            <Image className='h-6 w-fit' src={erroricon} alt='error'/>
                            <p className='text-red-600'>{errorMessage}</p>
                        </div>}

                        {success && 
                       <div className='flex gap-2 items-center text-sm'>
                       <Image className='h-6 w-fit' src={successicon} alt='error'/>
                       <p className='text-green-600'>{successMessage}</p>
                   </div>}
                        <Button className='' type='submit'>Sign up</Button>
                    </form>

                    <p className=''>or</p>
                    <GoogleAuth/>
                </div>
                <p className='text-center pt-2 text-sm text-gray-400'>Already a user? 
                    <Link href='/login' className='pl-1 text-blue-500 hover:underline cursor-pointer'>Login</Link></p>
           </div>
        </div>
    )
}

export default Signup