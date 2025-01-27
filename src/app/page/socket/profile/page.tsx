"use client"
import { useEffect, useRef, useState } from "react"
import {IoArrowBack} from "react-icons/io5"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import getColorClass, { colorMap } from "@/utils/getColour"
import {FaPlus,FaTrash} from "react-icons/fa"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { createAxios } from "@/utils/constants"
import { Button } from "@/components/ui/moving-border"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { addUserData } from "@/store/context"
import { useSelector } from "react-redux"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { RootState } from "@/store/configStore"
const Profile=()=>{
    const {userData }= useSelector((state:RootState)=>state.counter)
const [isverified,setIsVerified]=useState(false)
const [firstname,setFirstname]=useState("")
const [lastname,setLastname]=useState("")
const [image,setImage]=useState()
const [hovered,setHovered]=useState(false)
const [selectedColor,setSelectedColor]=useState(1)
const session = useSession()
const router = useRouter()
const dispatch = useDispatch()
const{ toast }= useToast()
const email = session.data?.user.email
const handleRef = useRef<HTMLInputElement | null >(null)

useEffect(()=>{
   if(!email) return 
    const getInfo =async ()=>{
       
        try {
            const {data} = await createAxios.post("getInfo",{
          email
            })
            if(!data){
                toast({
                    variant: "destructive",
                    title: "User not found.",
                    description: "PLease login again or retry after sometime.",
                  })
                  return false
            }else{
                console.log(data)
                setFirstname(data.firstname)
                setLastname(data.lastname)
                setSelectedColor(data.color)
                setIsVerified(data.profileSetup)
                setImage(data.image)
                return true
            }
        } catch (error) {
            console.log(error)
            return false
        }
    
    }
   getInfo()

},[email,userData,toast])




  
 




const handleNavigate=()=>{
if(isverified){
    router.push("/page/socket/chat")
}else{
    toast({
        variant:"destructive",
        title:"Profile not setup",
        description:"First setup the profile and retry."
    })
}
}



const validateProfile = ()=>{
    if(!firstname){
        toast({
            variant: "destructive",
            title: "Uh no! Firstname not found.",
            description: "First enter the firstname then retry.",
          })
return false
    }
    if(!lastname){
        toast({
            variant: "destructive",
            title: "Uh no! Lastname not found.",
            description: "First enter the lastname then retry.",
         
          })
        return false
    }
    return true
}

const handleFileInputClick = ()=>{
    //@ts-expect-error hhhh
handleRef.current.click()
}
const handleImageDelete = async()=>{
    try {
        const response = await createAxios.post("/removeImage")
        if(response.status==200){
            toast({
                variant:"default"
                ,title:"Image deleted Successfully"
            })
           setImage(response.data.image)
            dispatch(addUserData(response.data))
        }
    } catch (error) {
        toast({
            variant:"destructive"
            ,title:"image could not be deleted"
        })
        throw error
    }
}
const handleImageChange = async(event:React.ChangeEvent<HTMLInputElement>)=>{
  if(event.target.files){
    const file = event.target.files[0];
    console.log({file})
    if(file){
        const formData = new FormData()
        formData.append("file",file)
        const response = await createAxios.post("/addProfileImage",formData)
    if(response.status==200){
        setImage(response.data.image)
        toast({
            variant:"default"
            ,title:"Image Uploaded Successfully"
        })
        console.log(response.data)
        dispatch(addUserData(response.data))
    }
    
    }
  }

}

const saveChanges = async ()=>{
if(validateProfile()){
    try {
        console.log(firstname,lastname,selectedColor,session.data?.user.email)
        const response = await createAxios.post("/setInfo",{
            firstname,
            lastname,
            color:selectedColor,
            profileSetup:true
        })
        dispatch(addUserData(response.data))
        if(response.status==200){
            toast({
                variant: "default",
                title: "Profile has been updated.",
                description: "All the changes has been saved .",
             
              })
            router.push("/page/socket/chat")
        }else{
            toast({
                variant: "destructive",
                title: "Something went wrong.",
                description: "Something went wrong with the server please retry..",
             
              })
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Something went wrong.",
            description: "Something went wrong with the server.",
         
          })
          throw error
    }
}



}

return (
    <AuroraBackground className="bg-black w-[93rem] h-full">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="bg-transparent h-[100vh] flex items-center justify-center flex-col gap-10">
          <div className="bg-transparent h-[100vh] flex items-center justify-center flex-col gap-10">
            <div className="flex flex-col gap-5 w-[93rem] md:w-max">
              <div className="ml-8">
                <IoArrowBack
                  onClick={handleNavigate}
                  className="size-8 hover:cursor-pointer text-red-700"
                />
              </div>
              <div className="grid grid-cols-2 w-full gap-5">
                {/* Avatar Section */}
                <div
                  className="h-full w-32 md:h-38 relative flex items-center justify-center"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Avatar className="size-36 md:size-48 border rounded-full border-zinc-800 overflow-hidden">
                    {image ? (
                      <AvatarImage
                        className="size-36 md:size-48 flex items-center rounded-full border-2 border-zinc-800 object-cover shadow-md"
                        src={image}
                      />
                    ) : (
                      <AvatarFallback
                        className={`size-36 md:size-48 uppercase text-5xl border-[1px] flex items-center ${getColorClass(
                          selectedColor
                        )}`}
                      >
                        {session.data?.user.email?.substring(0, 2)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {hovered && (
                    <div className="absolute size-36 md:size-48 border rounded-full flex items-center justify-center bg-black/50 ring-fuchsia-50">
                      {image ? (
                        <FaTrash
                          onClick={handleImageDelete}
                          className="text-white text-3xl rounded-full cursor-pointer"
                        />
                      ) : (
                        <FaPlus
                          onClick={handleFileInputClick}
                          className="text-white text-3xl cursor-pointer"
                        />
                      )}
                    </div>
                  )}
                  <Input
                    type="file"
                    ref={handleRef}
                    className="hidden bg text-white"
                    onChange={handleImageChange}
                    name="profile-image"
                    accept=".png , .jpg , .jpeg , .svg , .webp"
                  />
                </div>
  
                {/* Input Fields Section */}
                <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                  <div className="w-full">
                    <Input
                      placeholder="Email"
                      type="email"
                      disabled
                      value={session.data?.user.email || ""}
                      className="rounded-lg p-6 text-white bg-black border-none"
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      placeholder="Firstname"
                      type="text"
                      value={firstname || ""}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="rounded-lg p-6 text-white bg-black/50 border-none"
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      placeholder="Lastname"
                      type="text"
                      value={lastname || ""}
                      onChange={(e) => setLastname(e.target.value)}
                      className="rounded-lg p-6 text-white bg-black/50 border-none"
                    />
                  </div>
                  <div className="w-full flex gap-5">
                    {colorMap.map((color, index) => (
                      <div
                        key={index}
                        className={` ${getColorClass(index)} size-8 rounded-full cursor-pointer transition-all duration-300 ${
                          selectedColor == index ? "outline outline-white/50 outline-1" : ""
                        }`}
                        onClick={() => setSelectedColor(index)}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Save Changes Button */}
              <div className="flex items-center justify-center mt-5">
                <Button
                
                  borderRadius="1.5rem"
                  className="bg-black/10 text-white hover:bg-black/50 border-3 border-slate-800"
                  onClick={saveChanges}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
  

}
export default Profile