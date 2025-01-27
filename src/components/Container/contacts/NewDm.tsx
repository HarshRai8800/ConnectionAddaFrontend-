import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "../../ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { createAxios } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { addChatData, addChatType } from "@/store/context";
import { useToast } from "@/hooks/use-toast";
import Lottie from "react-lottie";
import animationData from "@/utils/animation/Animation - 1736859700036.json";
import { RootState } from "@/store/configStore";

interface Contact {
  id: number;
  contacts: string;
  email: string;
  firstname: string;
  lastname: string;
  image: string;
}

function NewDm() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.counter);
  const [contacts, setContacts] = useState<string>("");
  const [allcontacts ,setAllContacts] = useState<Contact[]>([]);
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  const [openNewModalContact, setOpenNewModalContact] = useState(false);
console.log(allcontacts)
  const { toast } = useToast();
  const session = useSession();

  // Fetch contacts logic
  useEffect(() => {
    const searchNewContact = async () => {
      try {
        const response = await createAxios.post("/seacrhContacts", {
          email: session?.data?.user?.email,
          searchTerms: contacts,
        });
        if (response.status === 200) {
          setSearchedContacts(response.data.contacts);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error searching contacts",
          description: "Unable to fetch contact data. Please try again later.",
        });
        throw error
      }
    };

    const timeoutId = setTimeout(() => {
      if (contacts) searchNewContact();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [contacts, session?.data?.user?.email, toast]);

  // Fetch all contacts
  const email = session.data?.user.email;
  useEffect(() => {
    if (!email) return;
    const getAllContacts = async () => {
      try {
        const response = await createAxios.post("/findAllContact", {
          email,
        });
        if (response.status === 200) {
          setAllContacts(response.data);
        } else {
          toast({
            variant: "destructive",
            title: "Saved Contacts Could Not Be Found",
            description: "Try Again Later.",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching contacts",
          description: "Unable to fetch contact data. Please try again later.",
        });
        throw error
      }
    };

    getAllContacts();
  }, [email, toast]);

  // Select contact logic
  const selectContact = async (contact: Contact) => {
    try {
      const response = await createAxios.post("/addContact", {
        userEmail: session.data?.user.email,
        contactEmail: contact.email,
        userId: userData?.id,
      });

      if (response.status === 200) {
        dispatch(addChatType("contact"));
        dispatch(addChatData(response.data));
        toast({
          variant: "default",
          className: "bg-green-400",
          title: "Contact has been added to the list.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Contact has already been added.",
      });
      throw error
    }
    setOpenNewModalContact(false);
    setSearchedContacts([]);
  };

  return (
    <div>
      {/* Add Contacts Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          onClick={() => setOpenNewModalContact(true)}
        >
          <Plus size={20} />
          <span>Add Contacts</span>
        </button>
      </div>

      {/* Dialog for adding new contacts */}
      <Dialog open={openNewModalContact} onOpenChange={setOpenNewModalContact}>
        <DialogContent className="bg-zinc-800 flex flex-col border-none w-[400px] h-[400px] text-white">
          <DialogHeader>
            <DialogTitle>Please Select a Contact</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 text-white bg-[#2c2e3b] border-none"
              onChange={(e) => setContacts(e.target.value)}
            />
          </div>
          {searchedContacts.length > 0 ? (
            <ScrollArea className="h-[200px] w-[350px] rounded-md border-none p-4">
              <div className="flex flex-col gap-5">
                {searchedContacts.map((search, index) => (
                  <div
                    key={index}
                    onClick={() => selectContact(search)}
                    className="flex gap-3 items-center cursor-pointer"
                  >
                    <div className="w-full h-16 gap-5 p-4 bg-[#3e404d] flex items-center rounded-lg relative">
                      <Avatar className="size-10 md:size-12 flex items-center justify-center border rounded-full overflow-hidden">
                        <AvatarImage
                          className="md:size-12 size-10"
                          src={search.image}
                        />
                      </Avatar>
                      <div className="flex gap-1 flex-col items-center text-sm justify-center">
                        <div>
                          {search.firstname} {search.lastname}
                        </div>
                        <div>{search.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center mt-16 justify-center h-24 bg-zinc-800 rounded-lg">
              <div className="w-48 mb-6">
                <Lottie options={{ animationData }} />
                <div className="text-center mt-0 text-lg flex items-center justify-center text-purple-400">
                  Search Contacts
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NewDm;

