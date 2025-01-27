import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RiCloseFill } from 'react-icons/ri';
import { removeChat } from '@/store/context';
import { RootState } from '@/store/configStore';

function Header() {
  const { selectedChatData, selectedChatType } = useSelector((state: RootState) => state.counter);
  const dispatch = useDispatch();

  return (
    <div className="h-[5vw] w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black shadow-lg flex items-center justify-between px-8 rounded-t-lg">
      {/* Left Section */}
      <div className="flex items-center gap-5">
        {selectedChatType === "contact" ? (
          <div className="flex items-center gap-4 p-3 bg-opacity-20 backdrop-blur-md rounded-lg shadow-md hover:bg-opacity-40 transition-all duration-300 cursor-pointer">
            
              {
                
                <Avatar   className="w-12 h-12 flex justify-center items-center rounded-full overflow-hidden  ">
                  {selectedChatData.image?<AvatarImage src={selectedChatData.image}/>:
                <AvatarFallback className="uppercase text-white font-bold text-lg bg-purple-600 flex items-center justify-center">
                {selectedChatData?.firstname?.substring(0, 2).toUpperCase()}
              </AvatarFallback>}
              </Avatar>
              }
              
          
            <div className="text-white">
              <h3 className="text-lg font-semibold">{`${selectedChatData.firstname} ${selectedChatData.lastname}`}</h3>
              <p className="text-sm text-gray-400">Contact</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-3 bg-opacity-20 backdrop-blur-md rounded-lg shadow-md hover:bg-opacity-40 transition-all duration-300 cursor-pointer">
            <Avatar className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden border-2 border-purple-500">
              {selectedChatData?.image ? (
                <AvatarImage src={selectedChatData.image} />
              ) : (
                <AvatarFallback className="uppercase text-white font-bold text-lg bg-purple-600 flex items-center justify-center">
                  {selectedChatData?.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-white">
              <h3 className="text-lg font-semibold">{selectedChatData?.name}</h3>
              <p className="text-sm text-gray-400">Channel</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(removeChat())}
          className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-full focus:outline-none hover:bg-gray-800"
        >
          <RiCloseFill className="text-4xl" />
        </button>
      </div>
    </div>
  );
}

export default Header;


