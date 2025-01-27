"use client"
import ChatContainer from '@/components/Container/chatContainer'
import EmptyChatContainer from '@/components/Container/emptyChatContainer'
import ContactContainer from '@/components/Container/contacts/contactContainer'

import { removeChat } from '@/store/context'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { RootState } from '@/store/configStore'
function Chat() {


  const dispatch=useDispatch()


  useEffect(()=>{
  dispatch(removeChat())

  },[])
const selector = useSelector((state:RootState)=>state.counter)

  return (

    <div className='flex w-full  h-screen text-white overflow-hidden'>
<ContactContainer/>
{
  selector.selectedChatData?.firstname?<ChatContainer/>:<EmptyChatContainer/> 
}





    </div>
  )
}

export default Chat