'use client'

import styles from './layout.module.css'
import close from '@/assets/close.png'
import chat from '@/assets/chat.png'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Header from '../components/Header'
import UserPanel from '../components/UserPanel'
// import Chat from '../components/chat/Chat'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
// import Chat from '@/components/chat/Chat'
// import { Provider } from 'react-redux'
// import { store } from '@/store'

export default function Layout({ children }) 
{
    const [ showChat, setShowChat ] = useState(false);
    const [ chatId, setChatId ] = useState(null); 
    const { status, data } = useSession();
    const [ userData, setUserData ] = useState(null); 

    useEffect(()=>
    {
        status === 'authenticated' && getUserChat();
    },[status])
    
    const getUserChat = async () =>
    {
        try
        {
            const url = `/api/user/${data.user.id}`
            const response = await axios.get(url);
            setUserData(response.data)
            // const chatId = response.data.chat[0]?._id ? response.data.chat[0]?._id : null
            // setChatId(chatId);
        }
        catch(error)
        {
            toast(error.message);
        }
    }

    return(
        <div className=''>
            <Header userData={userData}/>
            {/* <UserPanel/> */}
            
            <div className='pt-28 lg:px-[10vw] px-[5vw] pb-12'>
                {children}
            </div>

            {/* <Image className={styles.support} src={showChat ? close : chat} alt="chat" onClick={()=> setShowChat(!showChat)}/>
            {showChat &&  
            <div className={styles.chatWrapper}>
                <div className={styles.chat}>
                    <Chat type="user" userChatId={chatId}/>
                </div>
            </div>} */}

        </div>
    )
}