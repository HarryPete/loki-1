'use client'

import logo from '../../assets/logo.png'
import Image from 'next/image';
import successicon from '../../assets/success-icon.png'
import erroricon from '../../assets/error-icon.png'
// import { credentialLogin, googleLogin } from '@/app/action';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import GoogleAuth from '../components/GoogleAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Loading from '../components/Loading';
import { signIn } from 'next-auth/react';

export default function Page() {
    return (
      <Suspense fallback={<Loading/>}>
        <Login />
      </Suspense>
    );
}

const Login = () =>
{   
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ isError, setError ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState('')
    const [ success, setSuccess ] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
    const error = searchParams.get('error');

    useEffect(() => 
    {
        if (error) 
        {
            setError(true)
            switch (error) 
            {
                case "CredentialsSignin":
                setErrorMessage("Invalid username or password");
                break;
                case "Something went wrong!":
                setErrorMessage("Something went wrong! Please try again.");
                break;
                default:
                setErrorMessage("An unexpected error occurred");
            }
        }
    }, [error]);

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setSuccess(false)
        setSuccessMessage('')

        const formData = new FormData(e.currentTarget);

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

        setError(false)
        setErrorMessage('');

        signIn('credentials', 
        {
            email : formData.get('email'), 
            password: formData.get('password'),
            callbackUrl
        })
    }

    return(
        <div style={{ backgroundImage: "radial-gradient(164.75% 100% at 50% 0, #334155 0, #0f172a 48.73%)"}} className='h-[100vh] flex items-center justify-center'>
            <div className='rounded-xl w-96 p-8 space-y-2 bg-white'> 
                <div className='flex justify-center cursor-pointer mb-6'>
                    <Image className='h-12 w-fit' src={logo} alt='logo' onClick={()=> router.push('/')}/>
                </div>
                <div className='w-full flex flex-col gap-4 items-center'>
                    <form className='flex flex-col w-full gap-4'onSubmit={handleSubmit}>
                        <Input className='h-12 bg-neutral-50' name="email" type="text" placeholder="Email" />
                        <Input className='h-12 bg-neutral-50' name="password" type="text" placeholder="Password" />

                        {isError && 
                        <div className='flex gap-2 items-center text-sm'>
                            <Image className='h-6 w-fit' src={erroricon} alt='error'/>
                            <p className='text-red-600'>{errorMessage}</p>
                        </div>}

                        {success && 
                       <div className='flex gap-2 items-center text-sm'>
                       <Image className='h-6 w-fit' src={successicon} alt='error'/>
                       <p className='text-green-600'>{successMessage}</p>
                   </div>}
                        <Button type='submit p-6'>Login</Button>
                    </form>

                    <p className='text-muted-foreground'>or</p>
                    <GoogleAuth/>
                </div>
                <div className='text-center pt-2 text-sm text-gray-400'>Don't have an account?
                    <Link href='/signup' className='pl-1 text-blue-500 hover:underline cursor-pointer'>Signup</Link>
                </div>
                {/* <div className='text-center'>
                    <Link href='/reset-password' className='mt-2 text-sm text-blue-900 hover:underline'>Forgot password</Link>
                </div> */}
            </div>
        </div>
    )
}