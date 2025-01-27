"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function Home() {
  const session = useSession()
  const router = useRouter()


  
  useEffect(()=>{
    
  console.log(session.data?.user)
    if(session.data?.user){
      if(session.data.user.isVerfied){
        router.push("/page/socket/chat")
      }else{
        router.push("/page/socket/profile")
      }
    }else{
      router.push("/page/signin")
    }

  })
const state = useSelector((state)=>state)
console.log(state)
return (




  <div className="w-screen h-screen">
     <div className="flex items-center justify-center min-h-screen bg-zinc-800 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500">
      </div>
    </div>
   
  </div>
)
}
