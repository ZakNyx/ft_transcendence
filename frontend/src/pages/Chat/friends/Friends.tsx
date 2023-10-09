import React, { useContext } from 'react';
import Chat from './chat/Chat';
import { DataContext } from './data_context/data-context';
import FriendCard from './FriendCard';
import classes from './Friends.module.css';
import NavBar from '../../../components/Navbar';

function Friends() {
  const dataContextVar = useContext(DataContext);
  console.log(dataContextVar);

  return (
    <div className='background-image min-h-screen'>
      <NavBar />
    <div className={`${classes.mainCard} background-image min-h-screen`}>
      {/* <NavBar /> */}
      <div className={classes.friendList}>
        <input type="text" /* value="" */ placeholder="  Search..." />
        {dataContextVar?.data.map((user) => (
          <FriendCard key={user.conversationId} user={user} />
          ))}
      </div>
      
      {dataContextVar?.selectedConversation && <Chat user={dataContextVar.selectedConversation} />}
    </div>
          </div>
  );
}

export default Friends;
