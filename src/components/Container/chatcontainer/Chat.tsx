import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Message, replceMessageHistory } from '@/store/context';
import { createAxios } from '@/utils/constants';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/store/configStore';
import Image from 'next/image';

function Chat() {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // Local state to manage messages
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const { selectedChatData, selectedChatType, messages, userData } = useSelector(
    (state: RootState) => state.counter
  );

  const getMessages = async () => {
    try {
      const messageHistory = await createAxios.post('/getMessages', {
        userId: userData?.id,
        recipentId: selectedChatData.id,
      });
      if (messageHistory.status === 200) {
        dispatch(replceMessageHistory(messageHistory.data));
      } else {
        toast({
          variant: 'destructive',
          title: 'Message history could not be fetched',
          description: 'A technical error has occurred',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'A technical error has occurred',
      });
      console.log(error)
    }
  };

  const getChannelMessages = async () => {
    try {
      if (selectedChatData.id) {
        const messageHistory = await createAxios.post('/getChannelMessages', {
          channelId: selectedChatData?.id,
        });
        if (messageHistory.status === 200) {
          dispatch(replceMessageHistory(messageHistory.data.messages));
        } else {
          toast({
            variant: 'destructive',
            title: 'Message history could not be fetched',
            description: 'A technical error has occurred',
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'A technical error has occurred',
      });
      console.log(error)
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the file.");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = blobUrl;

      // Extract the file name dynamically or set a default one
      const fileName = url.split("/").pop() || "downloaded-file";
      link.download = fileName;

      // Trigger the download
      document.body.appendChild(link); // Append link to the DOM
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Release the blob memory
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  useEffect(() => {
    if (selectedChatType === "contact") {
      getMessages();
    } else {
      getChannelMessages();
    }
  }, [selectedChatData, selectedChatType]); 

  
  useEffect(() => {
    setLocalMessages(messages); 
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages]);

  const renderMessages = () => {
    return localMessages.map((message: Message, index: number) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      return (
        <div className="p-4" key={index}>
          {messageDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {selectedChatType === 'contact' &&
            selectedChatData.fileUrl === undefined &&
            renderDmessage(message)}
          {selectedChatType === "channel" &&
            selectedChatData.fileUrl === undefined &&
            renderChannelMessages(message)}
        </div>
      );
    });
  };

  const RenderImages = ({ message }: { message: Message }) => {
    const isSender = message.sender !== selectedChatData.id;

    return (
      <div className="items-center flex-col justify-center">
        <div
          className={`relative flex flex-col items-center justify-center w-52 h-36 rounded-lg my-2 shadow-md overflow-hidden ${
            isSender
              ? 'backdrop-blur-3xl border-[#8417ff]/50 bg-[#8417ff]/10'
              : 'border-white/70 backdrop-blur-3xl bg-[#ffffff]/30'
          } border`}
        >
          {/* Centered image */}
          <Image
          //@ts-expect-error vbbb
            src={message?.fileUrl}
            alt="Chat content"
            className="relative max-w-44 max-h-28 rounded-lg"
          />
        </div>
        <button
        //@ts-expect-error bfbfg
          onClick={() => handleDownload(message?.fileUrl)}
          className="px-4 py-2 mr-7 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download Image
        </button>
      </div>
    );
  };

  const renderChannelMessages = (message: Message) => {
    return (
      <div
        className={`mt-5 ${message.senderId !== userData?.id ? "text-left" : "text-right"} flex flex-col `}
      >
        <div>
          <div
            className={`${
              message.senderId === userData?.id
                ? 'bg-[#8417ff]/10 text-[#8417ff] border-[#8417ff]/50'
                : ' bg-[#ffffff]/30 text-white/90 border-white/70'
            } border inline-block p-4 rounded-lg my-2 max-w-[60%] break-words shadow-md`}
          >
            {message.content ? message.content : message.text}
          </div>
        </div>
      </div>
    );
  };

  const renderDmessage = (message: Message) => {
    return (
      <>
        <div
          className={`${
            message.sender === selectedChatData.id
              ? ' flex items-center text-left justify-start'
              : 'flex items-center text-right justify-end'
          }`}
        >
          {message.fileUrl ? (
            <RenderImages message={message} />
          ) : (
            <div
              className={`${
                message.sender !== selectedChatData.id
                  ? 'bg-[#8417ff]/10 text-[#8417ff] border-[#8417ff]/50'
                  : ' bg-[#ffffff]/30 text-white/90 border-white/70'
              } border inline-block p-4 rounded-lg my-2 max-w-[60%] break-words shadow-md`}
            >
              {message.content ? message.content : message.text}
            </div>
          )}
        </div>
        <div className="text-xs text-end mr-20 mt-4 text-gray-300">
          {moment(message.timestamp).format('LT')}
        </div>
      </>
    );
  };

  return (
    <div
      className="xl:w-[76vw]  h-[100vw] bg-black text-white flex flex-col  p-4 overflow-y-auto"
      style={{ maxHeight: '80vh' }} // Adjust container height dynamically
    >
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
}

export default Chat;


