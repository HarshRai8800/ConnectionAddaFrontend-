import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { addChatType, addMessage } from '@/store/context';
import { useSocket } from '@/context/SocketContext';
import { createAxios } from '@/utils/constants';
import { RootState } from '@/store/configStore';



function Message() {
  const selector = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();
  const socket = useSocket();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState<string>('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmoji = (emoji: { emoji: string }) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async () => {
    if (selector.selectedChatType === 'contact') {
      dispatch(addChatType('contact'));
      dispatch(
        addMessage({
          sender: selector.userData?.id,
          //@ts-expect-error vfdvbd
          recipent: selector.selectedChatData,
          content: message,
        })
      );

      socket?.emit('sendMessage', {
        senderId: selector.userData?.id,
        content: message,
        recipientId: selector.selectedChatData.id,
        messageType: 'contact',
        fileUrl: undefined,
      });
      setMessage('');
    } else {
      dispatch(addChatType('channel'));
      dispatch(
        addMessage({
          senderId: selector.userData?.id,
          //@ts-expect-error vfdvdf
          recipent: selector.selectedChatData,
          content: message,
        })
      );
      socket?.emit('send_channel_message', {
        senderId: selector.userData?.id,
        content: message,
        channelId: selector.selectedChatData.id,
        messageType: 'channel',
        fileUrl: undefined,
      });
      setMessage('');
    }
  };

  const handleAttachmentClick = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await createAxios.post('/uploadImage', formData);

        if (response.status === 200) {
          if (selector.selectedChatType === 'contact') {
            dispatch(addChatType('contact'));
            dispatch(
              addMessage({
                sender: selector.userData?.id,
                 //@ts-expect-error vdfvfv
                recipent: selector.selectedChatData,
                content: undefined,
                fileUrl: response.data.url,
              })
            );

            socket?.emit('sendMessage', {
              senderId: selector.userData?.id,
              content: undefined,
              recipientId: selector.selectedChatData.id,
              messageType: 'contact',
              fileUrl: response.data.url,
            });
            setMessage('');
          } else {
            dispatch(addChatType('channel'));
            dispatch(
              addMessage({
                senderId: selector.userData?.id,
                //@ts-expect-error vdfvf
                recipent: selector.selectedChatData,
                content: undefined,
                fileUrl: response.data.url,
              })
            );
            socket?.emit('send_channel_message', {
              senderId: selector.userData?.id,
              content: undefined,
              channelId: selector.selectedChatData.id,
              messageType: 'channel',
              fileUrl: response.data.url,
            });
            setMessage('');
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-[10vw] w-full flex bg-bl justify-center items-center border-1">
      <div className="flex justify-center bg-transparent absolute bottom-12 rounded-md items-center w-[50%]">
        {/* Input Field */}
        <Input
          type="text"
          className="bg-[#3b3d47] text-white placeholder-white border-0 pr-20 pl-4"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Icons in End Corner */}
        <div className="absolute right-72 flex items-center gap-3">
          <button
            onClick={handleAttachmentClick}
            className="text-blue-400 cursor-pointer focus:border-none text-lg focus:outline-none focus:text-white duration-300 transition-all"
          >
            <GrAttachment />
          </button>
          <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={handleAttachmentChange}
          />
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="focus:border-none focus:outline-none text-lg text-yellow-300 focus:text-white duration-300 transition-all"
          >
            <RiEmojiStickerLine />
          </button>
          <div ref={emojiRef} className="absolute bottom-16 right-0">
            {emojiPickerOpen && (
              <EmojiPicker
                onEmojiClick={handleEmoji}
                autoFocusSearch={false}
              />
            )}
          </div>
        </div>
        <div
          onClick={handleSendMessage}
          className="text-neutral-300 focus:border-none focus:outline-none flex items-center justify-center bg-purple-600 p-3 rounded-md focus:text-white duration-300 transition-all ml-4"
        >
          <IoSend />
        </div>
      </div>
    </div>
  );
}

export default Message;
