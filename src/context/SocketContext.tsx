"use client";
import { createAxios } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { createContext, useContext, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/store/context";
import { RootState } from "@/store/configStore";

const SocketContext = createContext<Socket | null>(null); // Specify Socket type

export const useSocket = () => {
  return useContext(SocketContext); // Custom hook to access the socket context
};

interface SocketProviderProps {
  children: React.ReactNode;
}

interface Message {
  senderId: string;
  recipient: string;
  content: string;
  fileUrl?: string;
  channelId?: string;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType, userData } = useSelector(
    (state: RootState) => state.counter
  );
  const session = useSession();

  const socket = useRef<Socket | null>(null); // Using `useRef` to persist socket instance

  
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const { data } = await createAxios.post("/getInfo", {
          email: session?.data?.user?.email,
        });
        if (data?.id) {
          socket.current = io("http://localhost:8040", {
            withCredentials: true,
            query: { userId: data.id },
            secure: true,
          });

          socket.current.on("connect", () => {
           
          });

          const handleReciveMessage = async (message: Message) => {
            try {
           
              if (selectedChatType && message.senderId == selectedChatData.id) {
                dispatch(
                  addMessage({
                    sender: message.senderId,
                    recipent: message.recipient,
                    content: message.content,
                    fileUrl: message.fileUrl,
                  })
                );
              }
            } catch (error) {
              console.log(error);
            }
          };

          const handleReceiveChannelMessage = async (message: Message) => {
            console.log(message);
            if (selectedChatType !== undefined && selectedChatData.id === message.channelId) {
              if (userData?.id !== message.senderId) {
                dispatch(addMessage(message));
              }
            }
          };

          socket.current.on("send_channel_message", handleReceiveChannelMessage);
          socket.current.on("recievedMessage", handleReciveMessage);

          socket.current.on("disconnect", () => {
            console.log("Disconnected from socket server");
          });
        }
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    if (session?.data?.user?.email) {
      console.log("hi");
      initializeSocket();
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect(); // Disconnect socket on cleanup
        console.log("Socket disconnected");
      }
    };
  }, [
    dispatch,
    selectedChatData,
    selectedChatType,
    userData?.id,
    session?.data?.user?.email,
  ]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
