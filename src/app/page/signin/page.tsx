"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {  useRouter } from "next/navigation";
import { createAxios } from "@/utils/constants";
import { useDispatch } from "react-redux";
import { addUserData } from "@/store/context";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { signIn } from "next-auth/react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Entered email is not in valid format"),
  password: z.string().min(6, "The password should be at least 6 characters"),
});

export default function ProfileForm() {
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useDispatch();


  const BottomGradient = () => (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const checkUser = await createAxios.post("/signin", { email: values.email,password:values.password });
      
      if (checkUser.status !== 200) {
        toast({
          variant:"destructive",
          title: "User does not exist",
          description: "Please sign up first and create an account.",
        });
        return;
      }else{
         await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });  
     
          if (checkUser.data.profileSetup) {
            toast({
              variant:"default",
              title: "Logging User",
              description: "Please wait .",
            });
            dispatch(addUserData(checkUser.data.response));
            router.push("/page/socket/chat");
          } else {
            toast({
              variant:"default",
              title: "Please Setup Your Profile Image",
              description: "Redirecting to profiel page",
            });
            dispatch(addUserData(checkUser.data.response));
            router.push("/page/socket/profile");
          }} 
     } catch (error) {
   
      toast({
        title: "Error",
        description: "Password is incorrect! Please try again later.",
      });
      throw error
    }
  };
  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/page/socket/profile", // Replace "/dashboard" with your desired redirect path
    });
  };
  const handleGithubSignIn = () => {
    signIn("github", {
      callbackUrl: "/page/socket/profile", // Replace "/dashboard" with your desired redirect path
    });
  };
  return (
    <div>
      <BackgroundBeamsWithCollision  className="flex w-screen h-screen gap-16 md:gap-12 xl:gap-28">
        {/* Left container with welcome message */}
        
        <div className="hidden sm:block ">
          <h2 className="text-lg relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white font-sans tracking-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              ConnectionAdda
            </span>
          </h2>
          <p className="text-lg relative z-20 md:text-xl lg:text-2xl font-medium text-center text-white font-sans tracking-tight mt-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              Log In
            </span>{" "}
            and start chatting today!
          </p>
        </div>



  
        {/* Login form container */}
        <BackgroundGradient className="rounded-[22px] max-w-xs bg-zinc-900 sm:max-w-sm ">
          <div className="max-w-4xl w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input sm:max-w-sm bg-black">
            <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-800">
              Log In
            </h2>
            <p className="text-base max-w-sm mt-2 w-80 text-start text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Encrypted Chatting and Data Sharing
            </p>
  
            {/* Login form */}
            <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4">
                <Input
                  id="email"
                  className="bg-zinc-800"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  value={form.watch("email")||""}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Input
                  id="password"
                  className="bg-zinc-800"
                  placeholder="••••••••"
                  type="password"
                  value={form.watch("password")||""}
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>
  
              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                type="submit"
              >
                Log In &rarr;
                <BottomGradient />
              </button>
              <div className="bg-gradient-to-r from-transparent gap-5 via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            </form>
  
            {/* Social login buttons */}
            <button
              className="relative group/btn flex space-x-2 mb-6 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              onClick={handleGithubSignIn}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-300" />
              <span className="text-neutral-300 text-sm">GitHub</span>
              <BottomGradient />
            </button>
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              onClick={handleGoogleSignIn}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
              <span className="text-neutral-300 text-sm">Google</span>
              <BottomGradient />
            </button>
  
            {/* Divider */}
            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
  
            {/* Redirect to Sign Up */}
            <h1 className="text-lg text-center text-gray-200">
              Don’t have an account?{" "}
              <Link
                href="/page/signup"
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold underline hover:brightness-125 focus:outline-none"
              >
                Sign Up
              </Link>
            </h1>
          </div>
        </BackgroundGradient>
      </BackgroundBeamsWithCollision>
    </div>
  );
  
}



  