import React, { createContext, FC, ReactNode, useState } from "react";

interface User {
  conversationId: number;
  userId: number;
  name: string;
}

interface DataContextProps {
  data: User[];
  selectedConversation: User;
  addUser: (user: User) => void;
  setConversation: (convId: number) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataContextProviderProps {
  children: ReactNode;
}

const DataContextProvider: FC<DataContextProviderProps> = (props) => {
  const [userData, setUserData] = useState<User[]>([
    { conversationId: 0, userId: 1, name: "zihirri" },
    { conversationId: 1, userId: 5, name: "cjad" },
    { conversationId: 2, userId: 9, name: "ie-laabb" },
  ]);

  const [selectedConv, setSelectedConv] = useState<User>(userData[0]);

  const addUserHandler = (user: User) => {
    setUserData((previousData) => [...previousData, user]);
  };

  const setConversation = (convId: number) => {
    const selectedConversation = userData.find(
      (user) => user.conversationId === convId
    );
    if (selectedConversation) {
      setSelectedConv(selectedConversation);
    }
  };

  const contextValue: DataContextProps = {
    data: userData,
    addUser: addUserHandler,
    selectedConversation: selectedConv,
    setConversation: setConversation,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {props.children}
    </DataContext.Provider>
  );
};

export { DataContext, DataContextProvider };
