import React from 'react'
import NewDm from './NewDm'
import AllContacts from './allContacts'
import CreateChannel from './createChannel'
import AllChannels from './allChannels'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/configStore'
function ContactContainer() {
 
  return (
    <>
    <div className='relative sm:w-[10vw] md:[13vw] xl:w-[28vw] flex-col items-center bg-gray-900 border-r-2 border-[#2f303b] w-full'>
      <Sidebar/>
    </div>
  
  
    </> 
 
  )
}







const Sidebar = () => {
  const selector = useSelector((state:RootState)=>state.counter)



  return (
    <aside className="w-[331px] ml-2 bg-gray-900 h-screen flex flex-col shadow-lg text-gray-100">
      
      <div className="p-4 border-b flex items-center border-gray-700">
        <input
          type="text"
          placeholder="Search Contacts"
          className="w-full px-4 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200 placeholder-gray-500"
        />
      </div>
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-2 p-4">
          {
            selector.sideBarContact?<AllContacts/>:<AllChannels/>
          }
        </ul>
      </div>
     {selector.sideBarContact?<NewDm/>:<CreateChannel/>}
    </aside>
  );
};
export default ContactContainer