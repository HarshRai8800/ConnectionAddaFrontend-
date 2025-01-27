import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import React, { useState } from 'react';
import { LuPencil } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';
import { AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store/configStore';



function ProfileFooter() {
  const selector = useSelector((state: RootState) => state.counter);
const [openNewProfile,setOpenNewProfile]=useState(false)
  const router = useRouter();

 
return <div className="absolute bottom-4 cursor-pointer size-12 rounded-full bg-gray-900 flex items-center justify-between ">
      {/* Profile Avatar */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 md:w-12 md:h-12 flex justify-center items-center rounded-full overflow-hidden ">
          {selector.userData?.image ? (
            <AvatarImage  onClick={()=>setOpenNewProfile(true)} src={selector.userData?.image}/>
          ) : (
            <AvatarFallback className="uppercase text-xs flex items-center justify-center bg-red-500 text-white">
              {selector.userData?.firstname?.substring(0, 2)}
            </AvatarFallback>
          )}
        </Avatar>
        <Dialog open={openNewProfile} onOpenChange={setOpenNewProfile}>
        <DialogContent
          className="bg-gradient-to-r from-purple-500 to-violet-900  w-[500px] h-[500px] text-white rounded-xl shadow-xl flex flex-col items-center p-6 transform transition-all duration-500 ease-in-out scale-110"
        >
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">Profile Information</DialogTitle>
          </DialogHeader>

          {/* Profile Image */}
          <Avatar className=" mb-6 overflow-hidden rounded-full border-4 border-gray-100 transform hover:scale-110 transition-all duration-300">
  <AvatarImage className="w-full h-full object-cover" src={selector.userData?.image} alt="User Profile Picture" />
  <AvatarFallback className="bg-red-500 text-white text-lg font-bold flex items-center justify-center w-full h-full">
    {selector.userData?.firstname[0]}{selector.userData?.lastname[0]}
  </AvatarFallback>
</Avatar>

          {/* User Details */}
          <div className="flex flex-col gap-3 text-center">
            <div className='flex items-center justify-center gap-6'>
        <p className="text-lg font-semibold">{selector.userData?.firstname} {selector.userData?.lastname}</p>
            <TooltipProvider  >
  <Tooltip>
    <TooltipTrigger>
      <div onClick={()=>{router.push("/page/socket/profile")}}>
      <LuPencil className='hover:text-slate-400'/>
      </div>
    
    </TooltipTrigger>
    <TooltipContent>
      <p className="text-gray-400 text-[12px]"> Edit  </p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
           
            </div>
            
            <p className="text-sm text-gray-200">{selector.userData?.email}</p>
            <p className="text-sm text-gray-300">User ID: {selector.userData?.id}</p>
          </div>

          {/* Profile Setup Status */}
          <div className="mt-4 text-center">
            {selector.userData?.profileSetup ? (
              <p className="text-green-400 font-semibold">Profile Setup: Completed</p>
            ) : (
              <p className="text-yellow-400 font-semibold">Profile Setup: Pending</p>
            )}
          </div>

          {/* Close Button */}
          <div className="mt-6">
            <Button
              onClick={() => setOpenNewProfile(false)}
              className="bg-black/50 border-2 hover:bg-gray-800 text-white transition-all duration-300  rounded-lg"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>

      
    </div>
  
}

export default ProfileFooter;
