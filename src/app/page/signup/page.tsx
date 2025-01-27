"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Form, FormField } from "@/components/ui/form";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createAxios } from "@/utils/constants";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addUserData } from "@/store/context";
import { useDispatch } from "react-redux";

const formSchema = z.object({
  firstname: z.string().nonempty("First name is required"),
  lastname: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfileForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast({
        variant: "destructive",
        color: "purple",
        title: "Form Submitted",
        description: "Thank you for signing up!",
      });
      return;
    }

    try {
      const signUpResponse = await createAxios.post("/signup", {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      });

      if (signUpResponse.status === 200) {
        await signIn("credentials", { email: data.email, password: data.password, redirect: false });
        toast({
          variant: "default",
          color: "blue",
          title: "Form Submitted",
          description: "Thank you for signing up!",
        });

        if (signUpResponse.data.profileSetup) {
          toast({
            variant: "default",
            title: "Logging User",
            description: "Please wait .",
          });
          dispatch(addUserData(signUpResponse.data.response));
          router.push("/page/socket/chat");
        } else {
          toast({
            variant: "default",
            title: "Please Setup Your Profile Image",
            description: "Redirecting to profile page",
          });
          dispatch(addUserData(signUpResponse.data.response));
          router.push("/page/socket/profile");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Form Could not be submitted",
        description: "Please Retry Again!",
      });
      throw error;
    }
  };

  const LabelInputContainer = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );

  const BottomGradient = () => (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );

  return (
    <>
      <BackgroundBeamsWithCollision className="flex gap-16 md:gap-16 xl:gap-28">
        {/* Hide this container on small screens */}
        <div className="hidden sm:block">
          <h2 className="text-lg relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-white font-sans tracking-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              ConnectionAdda
            </span>
          </h2>
          <p className="text-lg relative z-20 md:text-xl lg:text-2xl font-medium text-center text-white font-sans tracking-tight mt-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
              Sign Up
            </span>{" "}
            and start chatting today!
          </p>
        </div>

        {/* Form container */}
        <BackgroundGradient className="rounded-[22px] max-w-xs bg-zinc-900 sm:max-w-sm">
          <div className="w-[90%] sm:w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black">
            <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-800">
              Sign Up
            </h2>
            <p className="text-base max-w-xs mt-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
              Get Connected With the Power of Encryption
            </p>

            {/* Form */}
            <Form {...form}>
              <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row md:space-y-0 md:space-x-2 mb-2">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <LabelInputContainer>
                        <Label htmlFor="firstname">First name</Label>
                        <Input
                          className="bg-zinc-800 text-white"
                          id="firstname"
                          placeholder="Tyler"
                          {...field} // This ensures the input is controlled
                        />
                        {form.formState.errors.firstname && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.firstname.message}
                          </p>
                        )}
                      </LabelInputContainer>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <LabelInputContainer>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input
                          className="bg-zinc-800 text-white"
                          id="lastname"
                          placeholder="Durden"
                          {...field} // This ensures the input is controlled
                        />
                        {form.formState.errors.lastname && (
                          <p className="text-red-500 text-sm">
                            {form.formState.errors.lastname.message}
                          </p>
                        )}
                      </LabelInputContainer>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <LabelInputContainer className="mb-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        className="bg-zinc-800 text-white"
                        id="email"
                        placeholder="projectmayhem@fc.com"
                        {...field} // This ensures the input is controlled
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </LabelInputContainer>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <LabelInputContainer className="mb-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        className="bg-zinc-800 text-white"
                        id="password"
                        placeholder="Create 6 digit password"
                        {...field} // This ensures the input is controlled
                      />
                      {form.formState.errors.password && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </LabelInputContainer>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <LabelInputContainer className="mb-8">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        className="bg-zinc-800 text-white"
                        id="confirmPassword"
                        placeholder="Confirm password"
                        {...field} // This ensures the input is controlled
                      />
                      {form.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </LabelInputContainer>
                  )}
                />
                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Sign up &rarr;
                  <BottomGradient />
                </button>
              </form>
              <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            </Form>

            <h1 className="text-lg text-center text-gray-200">
              Already have an account?{" "}
              <Link
                href="/page/signin"
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold underline hover:brightness-125 focus:outline-none"
              >
                Log In
              </Link>
            </h1>
          </div>
        </BackgroundGradient>
      </BackgroundBeamsWithCollision>
    </>
  );
}
