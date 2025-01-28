import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/configStore';
import { addChannel, addChatData, addChatType } from '@/store/context';
import { createAxios } from '@/utils/constants';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { Channel } from '@/store/context'; // Import Channel type from Redux slice

function AllChannels() {
  const dispatch = useDispatch();
  const { userData, selectedChatData, channel } = useSelector((state: RootState) => state.counter);


  const getChannels = async () => {
      
    try {
      const response = await createAxios.post('/getChannels', {
        userId: userData?.id,
      });
      dispatch(addChannel(response.data));
    } catch (error) {
      console.log('Error while fetching saved channels: ' + error);
    }
  };

  useEffect(() => {
    
    getChannels();
  }, [selectedChatData, userData?.id]);

  const handleSelectToChat = (contact: Channel) => {
    dispatch(addChatType('channel'));
    //@ts-expect-error ikbnib
    dispatch(addChatData(contact));
  };

  const renderContacts = () => {
    return channel.map((contact: Channel, index: number) => (
      <div
        key={index}
        onClick={() => handleSelectToChat(contact)}
        className="flex items-center gap-4 p-4 rounded-lg cursor-pointer bg-gray-800 hover:bg-indigo-600 transition-all"
      >
        <Avatar className="w-12 h-12 flex justify-center items-center rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
          <AvatarFallback className="uppercase w-12 h-12 text-gray-100 text-md bg-gray-500 flex items-center justify-center">
            {contact?.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-gray-200">
          <h3 className="text-base font-semibold">{contact.name}</h3>
        </div>
      </div>
    ));
  };

  return (
    <div className="h-full w-full bg-gray-900 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      {channel.length > 0 ? (
        renderContacts()
      ) : (
        <p className="text-gray-400 text-center mt-4">No channels found.</p>
      )}
    </div>
  );
}

export default AllChannels;


