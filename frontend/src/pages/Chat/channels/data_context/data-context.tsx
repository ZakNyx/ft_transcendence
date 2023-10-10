import React, { createContext, FC, ReactNode, useState } from "react";

interface Channel {
    conversationId: number;
    channelId: number;
    name: string;
}

interface DataChannelContext {
    data: Channel[];
    selectedConversation: Channel;
    addChannel: (channel: Channel) => void;
    setConversation: (convId: number) => void;
}

const DataChannel = createContext<DataChannelContext | undefined>(undefined);

interface DataChannelProviderProps {
    children: ReactNode;
}

export const DataChannelProvider: FC<DataChannelProviderProps> = ({ children }) => {
    const [userData, setUserData] = useState<Channel[]>([
        { conversationId: 0, channelId: 1, name: "annoucement" },
        { conversationId: 1, channelId: 5, name: "general" },
        { conversationId: 2, channelId: 9, name: "random" }
    ]);
    const [selectedConv, setSelectedConv] = useState<Channel>(userData[0]);

    const addChannelHandler = (channel: Channel): void => {
        setUserData((previousData) => [...previousData, channel]);
    };

    const setConversation = (convId: number): void => {
        const selectedChannel = userData.find((user) => user.conversationId === convId);
        if (selectedChannel) {
            setSelectedConv(selectedChannel);
        }
    };

    const contextValue: DataChannelContext = {
        data: userData,
        addChannel: addChannelHandler,
        selectedConversation: selectedConv,
        setConversation: setConversation
    };

    return <DataChannel.Provider value={contextValue}>{children}</DataChannel.Provider>;
};

export default DataChannel;
