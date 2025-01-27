import React from 'react'
import Header from './chatheader/Header'
import Message from './message-bar/Message'
import Chat from './chatcontainer/Chat'

function ChatContainer() {
  return (
  <div className=' top-0 h-[100vh] w-full bg-black flex flex-col'>
<Header/>
<Chat/>
<Message/>
  </div>
  )
}

export default ChatContainer