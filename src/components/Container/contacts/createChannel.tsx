import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createAxios } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addChannel } from "@/store/context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multiselector";
import { RootState } from "@/store/configStore";

// Adjusted Option interface
export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

interface Contact {
  value: string;
  label: string;
  disable?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

function CreateChannel() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.counter);
  const [allContacts, setAllContacts] = useState<Option[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Option[]>([]);
  const [channelName, setChannelName] = useState<string>("");
  const [openNewChannelModal, setOpenNewChannelModal] = useState<boolean>(false);
  const { toast } = useToast();
  const getData = async () => {
    try {
      const response = await createAxios.post<Contact[]>("/channelContacts", {
        email: userData?.email,
      });
console.log(response.data)

      setAllContacts(  response.data);
    } catch (error) {
      console.log("Error while fetching saved contacts: ", error);
    }
  };

  useEffect(() => {
    
    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.trim() && selectedContacts.length > 0) {
        const response = await createAxios.post("/createChannel", {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
          id: userData?.id,
        });

        if (response.status === 200) {
          setChannelName("");
          setSelectedContacts([]);
          setOpenNewChannelModal(false);
          dispatch(addChannel(response.data));
          toast({
            variant: "default",
            title: "Channel has been created",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Please provide a channel name and select at least one contact.",
        });
      }
    } catch (error) {
      console.error("Error creating channel: ", error);
      toast({
        variant: "destructive",
        title: "Failed to create channel. Please try again later.",
      });
    }
  };

  return (
    <div>
      <div className="p-4 border-t border-gray-700">
        <button
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          onClick={() => setOpenNewChannelModal(true)}
        >
          <Plus size={20} />
          <span>Create Channel</span>
        </button>
      </div>

      <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>
        <DialogContent className="bg-zinc-800 flex flex-col border-none w-[400px] h-[400px] text-white">
          <DialogHeader>
            <DialogTitle>Please select contacts to add to the channel</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Enter Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">No results found</p>
              }
            />
          </div>
          <div className="mt-32">
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateChannel;

