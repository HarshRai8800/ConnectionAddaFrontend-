import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  content?: string;
  sender?: string;
  senderId?: string;
  recipent?: string;
  fileUrl?: string;
  timestamp?:Date;
  text?:string
}

export interface Channel {
  admin: number;
  name: string;
  members: [];
}

interface counter {
  userData: {
    id: undefined | string;
    email: null | string;
    firstname: string;
    lastname: string;
    image: string | undefined;
    profileSetup: string | null;
  } | null;
  contacts: [];
  selectedChatData: {
    id: string;
    fileUrl: string | null;
    image: null | string;
    firstname: null | string;
    lastname: string | null;
    name: string | null;
  };
  selectedChatType: string;
  messages: Message[];
  receivedMessage: string;
  channel: Channel[];
  sideBarContact: boolean | null;
  sideBarChannel: boolean | null;
  isVerified?: string;
}

const initialState: counter = {
  userData: null,
  contacts: [],
  selectedChatData: { id: "", fileUrl: null, lastname: null, firstname: null, name: null, image: null },
  selectedChatType: "",
  messages: [],
  receivedMessage: "",
  channel: [],
  sideBarContact: true,
  sideBarChannel: false,
  isVerified: undefined,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addUserData: (state, actions: PayloadAction<typeof initialState.userData>) => {
      state.userData = actions.payload;
    },
    addMessage: (state, actions: PayloadAction<Message>) => {
      state.messages = [...state.messages, actions.payload];
    },
    changeSideBarContact: (state: counter, action: PayloadAction<boolean | null>) => {
      state.sideBarContact = action.payload;
    },
    changeSideBarChannel: (state: counter, action: PayloadAction<boolean | null>) => {
      state.sideBarChannel = action.payload;
    },
    addChannel: (state: counter, actions: PayloadAction<Channel[]>) => {
      state.channel = actions.payload;
    },
    replceMessageHistory: (state: counter, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addContacts: (state: counter, actions: PayloadAction<[]>) => {
      state.contacts = actions.payload;
    },
    changeMessageStatus: (state: counter) => {
      state.receivedMessage = String(Math.random() * 100);
    },
    addChatData: (state: counter, actions: PayloadAction<typeof initialState.selectedChatData>) => {
      state.selectedChatData = actions.payload;
    },
    addChatType: (state: counter, action: PayloadAction<string>) => {
      state.selectedChatType = action.payload;
    },
    removeChat: (state: counter) => {
      state.selectedChatData = { id: "", fileUrl: null, lastname: null, firstname: null, name: null, image: null };
      state.selectedChatType = "";
      state.messages = [];
      state.receivedMessage = "";
      state.channel = [];
    }
  },
});

export const { addChannel, changeSideBarChannel, changeSideBarContact, addMessage, addChatData, addChatType, addUserData, removeChat, replceMessageHistory, changeMessageStatus, addContacts } = counterSlice.actions;

export default counterSlice.reducer;
