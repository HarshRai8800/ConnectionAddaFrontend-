import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addContacts, addChatData, addChatType } from '@/store/context';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { createAxios } from '@/utils/constants';
import { RootState } from '@/store/configStore';

// Define the type for a contact
interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  image?: string;
}

function AllContacts() {
  const dispatch = useDispatch();
  const { userData, contacts, selectedChatData } = useSelector((state: RootState) => state.counter);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const response = await createAxios.post('/findAllContact', {
          email: userData?.email,
        });
        console.log(response.data);
        dispatch(addContacts(response.data));
      } catch (error) {
        console.log('Error while fetching saved contacts: ' + error);
      }
    };

    getContacts();
  }, [selectedChatData, dispatch, userData]);

  const handleSelectToChat = (contact: Contact) => {
    dispatch(addChatType('contact')); // Assuming this action takes a string
    //@ts-expect-error onibn
    dispatch(addChatData(contact)); // Assuming this action takes a `Contact` object
  };

  const renderContacts = () => {
    console.log(contacts);
    return contacts.map((contact: Contact) => (
      <div
        key={contact.id}
        onClick={() => handleSelectToChat(contact)}
        className="flex items-center gap-4 p-4 hover:bg-gray-800 rounded-lg cursor-pointer transition-all"
      >
        <Avatar className="size-14 flex justify-center items-center rounded-full overflow-hidden bg-gray-700">
          {contact.image ? (
            <AvatarImage className="size-14" src={contact.image} />
          ) : (
            <AvatarFallback className="uppercase text-gray-100 text-sm bg-gray-500 flex items-center justify-center">
              {contact.firstname.substring(0, 2)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-gray-200">
          <h3 className="text-base font-semibold">
            {contact.firstname} {contact.lastname}
          </h3>
          <p className="text-xs text-gray-400">{contact.email}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="h-full w-full bg-gray-900 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      {contacts.length > 0 ? (
        renderContacts()
      ) : (
        <p className="text-gray-400 text-center mt-4">No contacts found.</p>
      )}
    </div>
  );
}

export default AllContacts;


