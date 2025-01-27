"use client"

import * as React from "react";
import { CircleUserRound, Forward, Users } from "lucide-react";
import { FaPowerOff } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { changeSideBarChannel, changeSideBarContact } from "@/store/context";
import ProfileFooter from "../Container/contacts/getProfileInfo";
import { signOut } from "next-auth/react";
import { RootState } from "@/store/configStore";

interface NavItem {
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const Logo = () => {
  return (
    <div className="flex justify-start mt-5 items-center gap-4">
      <svg fill="none" height="38" viewBox="0 0 32 48" width="24" xmlns="http://www.w3.org/2000/svg">
        <g fill="#fff">
          <path d="m.599609 19.2002h9.59998v9.59999h-9.59998z" />
          <path d="m31.4004 28.7998h9.6v9.59999h-9.6z" transform="matrix(-1 0 -0 -1 62.8008 57.5996)" />
          <path d="m10.1992 19.2001 11.6-9.6v9.6l-11.6 9.6z" opacity=".2" />
          <path d="m21.7988 28.7999-11.6 9.6v-9.6l11.6-9.6z" opacity=".5" />
          <path d="m.599609 19.2 21.199991-19.2v9.59999l-11.6 9.60001z" opacity=".6" />
          <path d="m31.4004 28.8-21.2 19.2v-9.6l11.6-9.6z" opacity=".7" />
        </g>
      </svg>
    </div>
  );
};

const navItems: NavItem[] = [
  {
    title: 'Contact',
    icon: CircleUserRound,
    content: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-100">Welcome Home</h2>
        <p className="text-gray-400">This is your homepage dashboard overview.</p>
      </div>
    ),
  },
  {
    title: 'Channel',
    icon: Users,
    content: (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-100">Dashboard Analytics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
            <h3 className="font-medium text-gray-200">Total Users</h3>
            <p className="text-2xl font-bold text-white">1,234</p>
          </div>
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
            <h3 className="font-medium text-gray-200">Active Sessions</h3>
            <p className="text-2xl font-bold text-white">56</p>
          </div>
        </div>
      </div>
    ),
  }
];

export function DynamicSidebar() {
  const [state, setState] = React.useState<boolean | null>(false);
  const path = usePathname();
  const selector = useSelector((state: RootState) => state.counter);
  const router = useRouter();
  const dispatch = useDispatch();

  const action = (identifier: string) => {
    // Prevent updating state if the current state is already the desired one
    if (state === null || (identifier === 'Channel' && state !== selector.sideBarChannel) || (identifier !== 'Channel' && state !== selector.sideBarContact)) {
      setState(!state);  // Only toggle state if it's necessary

      if (path.split("/")[2] !== "chat") {
        router.push("/page/socket/chat"); // Only navigate if not already in the chat page
      }

      if (identifier === 'Channel') {
        const channel = selector.sideBarChannel;
        dispatch(changeSideBarChannel(!channel));
        dispatch(changeSideBarContact(channel));
      } else {
        const contact = selector.sideBarContact;
        dispatch(changeSideBarContact(!contact));
        dispatch(changeSideBarChannel(contact));
      }
    }
  };

  const [activeItem, setActiveItem] = React.useState<NavItem | null>(null);

  return (
    <SidebarProvider style={{ width: "3rem" }} className="bg-gray-900">
      <div className="relative flex min-h-screen">
        {/* Backdrop for Sidebar */}
        {activeItem && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => { setActiveItem(null); }}
          ></div>
        )}

        {/* Sidebar */}
        <Sidebar
          collapsible="none"
          className={cn(
            "fixed left-0 top-0 z-50 flex h-full w-[60px] flex-col items-center border-r border-gray-700 bg-gray-900",
            activeItem && "md:w-80"
          )}
        >
          <SidebarContent className="flex flex-col items-center gap-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="cursor-pointer" onClick={() => router.push("/page/socket/about")}>
                    <Logo />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-white/75 text-[12px]">About Us</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="hover:bg-transparent flex items-center text-slate-300 hover:text-slate-700 justify-center size-8"
                  onClick={() => action(item.title)}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Icon className="h-5 w-5" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-white text-[9px] mb-5">{item.title}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="sr-only">{item.title}</span>
                </div>
              );
            })}

            <div
              onClick={() => {
                router.push("/page/signin");
                signOut();
              }}
              className="mb-4 hover:text-gray-700 cursor-pointer text-gray-300"
            >
              <FaPowerOff className="w-8" />
            </div>

            {selector.userData === null ? null : <ProfileFooter />}
          </SidebarContent>
        </Sidebar>

        {/* Expanded Content Area */}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full overflow-hidden border-r border-gray-700 bg-gray-800 transition-all duration-300 md:w-80",
            !activeItem && "hidden"
          )}
        >
          {activeItem && (
            <div className="h-full">
              {/* Active Item Header */}
              <div className="flex items-center gap-3 border-b border-gray-700 bg-gray-900 p-4">
                <activeItem.icon className="h-5 w-5 text-gray-100" />
                <span className="font-medium text-gray-100">{activeItem.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-gray-400 hover:text-gray-100"
                  onClick={() => setActiveItem(null)}
                >
                  <Forward className="h-4 w-4" />
                  <span className="sr-only">Close sidebar</span>
                </Button>
              </div>
              {/* Content */}
              <div className="p-4 text-gray-400">{activeItem.content}</div>
            </div>
          )}
        </div>
      </div>
    </SidebarProvider>
    
  );
}
