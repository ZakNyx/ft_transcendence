import NavBar from "../../components/Navbar"
import { useContext, useEffect, useState, useCallback } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import './chat.css';
import ScrollableFeed from 'react-scrollable-feed';
import { UserContext, currentUserType } from './userContext';
import { FaUserLargeSlash } from 'react-icons/fa6';
import { IoMdExit } from 'react-icons/io';
import  webSocket  from "../../components/socketManager";
import { FaUserFriends, FaUserPlus } from 'react-icons/fa';
import { BiLeftArrow, BiSearchAlt, BiSolidUserDetail } from 'react-icons/bi';
import { TbPencilPlus, TbUsersPlus } from 'react-icons/tb';
const urlgrouimg = '/assets/img/profile-group.png'

export const ChatConversation = (props: { isGroup: boolean, reload: boolean }) => {
  const params = useParams();
  const userId = params.userId;
  const [friend, setFriend] = useState<{ id: string, img: string, username: string, roomName: string, online: boolean }>();
  const [message, setMessage] = useState('');
  const [listMessages, setListMessage] = useState<{}[]>([]);
  const { fetchData }: any = useContext(UserContext) as currentUserType;
  const isGroup = props.isGroup;

  // console.log('conversstation ------------ ')
  const socket = webSocket.getSocket();
  useEffect(() => {
    if (!socket) {
      webSocket.connect();
      // console.log('chat convertation socket')
    }
  }, [socket])
  // console.log(isGroup);
  const leaveRoom = () => {
    socket?.emit(`leaveRoom`, { roomName: friend?.roomName });
  }

  const sendMsg = (e: any) => {
    e.preventDefault();
    if (!message)
      return;
    // console.log("send .............");
    const data = isGroup ? { message: message, roomName: userId } : { message: message, user2: userId };
    socket?.emit(`${isGroup ? 'textRoom' : 'Dms'}`, data)
    // console.log(socket)
    if (!socket?.connected)
      return;
    setListMessage(arr => [...arr, { isMe: true, msg: message, date: '' }])
    setMessage('');
  }
  socket?.off(`receive`).on(`receive`, (args: any) => {
    // console.log("recive ==----= ", args);
    // console.log(args, friend?.id, 'sender --', args);
    if (args.sender !== friend?.id)
      return;
    setListMessage(arr => [...arr, { id: args.sender.id, isMe: false, img: args.img, username: friend?.username, msg: args.message, date: '' }])
    // setListMessage(data)
  });

  const blockhandler = async () => {
    await fetchData(`/auth-user/block/${friend?.id}`).then((ress: any) => {
      // console.log("block ress = ", ress);
    }).catch((err: any) => {
      // console.log("blcok error = ", err);
    })
  }
  const hundlerChat = () => {
    document.getElementById("Conversation")?.classList.add("hide-scope");
    var Conver = document.getElementById("chatList");
    if (Conver?.classList.contains('hide-scope')) {
      Conver.classList.remove('hide-scope');
    }
  }
  // ----- drop down ----- //
  const hundlerDropdown = () => {
    document.getElementById("listDropdownEdit")?.classList.toggle("showDropdown");
  }
  const getNewGame = (id: string) => {
    socket?.emit(`getnewgame`, { playerId: id });
  }

  const getMsgsFriendChat = useCallback(async () => {
    await fetchData(`/auth-user/chat/${isGroup ? 'group' : 'user'}/${userId}`).then((ress: any) => {
      // console.log("list friend chat ", ress);
      if (ress?.messages.length > 0) {
        setListMessage(ress.messages);
      }
      else
        setListMessage([]);
      setFriend({ id: ress.id, img: ress.img, username: ress.username, roomName: ress.username, online: ress.online });
    })
      .catch((err: any) => console.error(err));
  }, [isGroup, userId])

  useEffect(() => {
    // console.log(' use Effect chat conv')
    // setListMessage([]);
    var Conver = document.getElementById("Conversation");
    if (Conver?.classList.contains('hide-scope')) {
      Conver.classList.remove('hide-scope');
    }

    getMsgsFriendChat();
  }, [userId, fetchData, getMsgsFriendChat]);

  return (
    <div id='Conversation' className='background-image conversation hide-scope'>
      <NavBar/>
      <div className='header-chat'>

        <div className='img-header-user' >
          <BiLeftArrow className=' icon-drop-down icons-header-chat icon-return-list' onClick={hundlerChat} />
          <div className='profile-section d-flex clm-center row-center'>
            {isGroup ? <img className='img-conversation-friend' width={'45px'} src={urlgrouimg} alt='user' />
              : <NavLink to={`/userProfile/${friend?.id}`} className={'image-list-profile'}>
                <img className='img-conversation-friend' width={'45px'} src={friend?.img} alt='user' />
                <div className={`status-circle ${friend?.online ? ` bg-green` : ' bg-gray'}`}>
                </div>
              </NavLink>
            }
          </div>
          <div className='title-with-check-isLogin'>
            <h2 className='name-chat-friend'>  {friend?.username}</h2>
            {isGroup || !friend ? null :
              <p>{friend?.online ? 'online' : 'offline'}</p>
            }
          </div>
        </div>
        <div className='menu-chat-friend'>
          {isGroup || !friend ? null :
            <img alt='icon-controle' src='/assets/img/controle-icon.svg' className='icons-header-chat' onClick={() => getNewGame(friend.id)} />
          }
          <div className='detailNavDropdown'>
            <img alt='icon-edit' src='/assets/img/more-vertical.svg' onClick={hundlerDropdown} className='icon-drop icons-header-chat icon-chat-conv-detail' />
            <div id='listDropdownEdit' className='drop-down-list'>
              {isGroup ? <>
                <NavLink className={'list-item'} to={`/chat/group/setting/${friend?.id}`} >
                  <FaUserFriends className='icon-drop-down' />
                  Members</NavLink>
                <NavLink className={'list-item'} to={`/chat/group/addmember/${friend?.id}`} >
                  <FaUserPlus className='icon-drop-down' />
                  Add Member</NavLink>
                <div className={'list-item'} onClick={leaveRoom} >
                  <IoMdExit className='icon-drop-down' />
                  Exit Group</div>
              </> :
                <>
                  <NavLink to={`/userProfile/${friend?.id}`} className={'list-item'} >
                    {/* <FontAwesomeIcon className='icon-drop-down' icon={faUser} /> */}
                    <BiSolidUserDetail className='icon-drop-down' />
                    Show Profile</NavLink>
                  {/* <div className={'list-item'} ><FontAwesomeIcon className='icon-drop-down' icon={faUserMinus} />
                    Delete Friend</div> */}
                  <div className={'list-item'} onClick={blockhandler}>
                    {/* <FontAwesomeIcon className='icon-drop-down' icon={faBan} /> */}

                    <FaUserLargeSlash className='icon-drop-down' />

                    Block friend</div>
                </>}
            </div>
          </div>
        </div>
      </div>
      <div className='messages'>
        <ScrollableFeed >
          {listMessages?.length > 0 ? listMessages.map((mes: any, i) => !(mes.isMe) ?
            <div className='l-block-message' key={`${i} + ${mes.id}`}>
              <img className='img-conversation-friend' src={mes.img} alt='user' />
              <p className='m-l'> <span className='time-message'>{mes.date} </span> {mes.msg}</p>
            </div> :
            <div className='r-block-message' key={`${i} + ${mes.id}`}>
              <p className='m-r'>{mes.msg}  <span className='time-message'>{mes.date} </span></p>
            </div>
          ) : null}

        </ScrollableFeed>
      </div>
      <form className='send-conversation' onSubmit={sendMsg}>
        <input type='text' className='input-search' value={message} placeholder='write message...' onChange={(val) => setMessage(val.target.value)} />
        <button type="submit" className='btn-send'>
          <img className='icon-send' src='/assets/img/send.svg' alt='send' />

          {/* <FontAwesomeIcon icon={faPaperPlane} className='icon-send' /> */}
        </button>
      </form>
    </div>
  )
}

export const ChatList = (props: { reload?: boolean, isGroup?: boolean }) => {
  console.log("------- chat List ----------");
  const { fetchData }: any = useContext(UserContext) as currentUserType;
  const [search, setSearch] = useState('');
  const [isChatList, setChatList] = useState(true);
  const [isGroup, setIsGroup] = useState(props.isGroup);
  const [listUserChat, setListUserChat] = useState([]);
  const [listGroupChat, setListGroupChat] = useState([]);

  const hundlerChat = () => {
    setIsGroup(isGroup);
    setChatList(!isChatList);
    document.getElementById("chatList")?.classList.add("hide-scope");
    var Conver = document.getElementById("Conversation");
    if (Conver?.classList.contains('hide-scope')) {
      Conver.classList.remove('hide-scope');
    }
  }

  const hundlerDropdown = () => {
    document.getElementById("CreateGroupDropdwon")?.classList.toggle("showDropdown");
  }

  const getListFriendChat = useCallback(async () => {

    await fetchData(`/auth-user/chat/${isGroup ? 'groups' : 'users'}`).then((data: any) => {
      if (data?.length > 0)
        !isGroup ? setListUserChat(data) : setListGroupChat(data);
      else {
        setListGroupChat([]);
        setListGroupChat([]);
      }
      console.log("chatlist ", data);
    })
      .catch((err: any) => console.error(err));

  }, [isGroup])

  useEffect(() => {
    // console.log('list chat use effect')
    var ChatLi = document.getElementById("chatList");
    if (ChatLi?.classList.contains('hide-scope')) {
      ChatLi.classList.remove('hide-scope');
    }
    document.getElementById("Conversation")?.classList.add("hide-scope");

    getListFriendChat();
    return () => {
    }
  }, [isGroup, fetchData, getListFriendChat, props?.reload])

  return (
    <div className='chat-container background-image'>
      <NavBar/>
      <div className='chat'>
        <div id='chatList' className='chat-list'>
          <div className='header-chat-list'>
            <div className='filter-and-editbtn'>
            </div>
            <div className='Search filter-chat-list mr-0 border-none d-flex row-center'>
              <BiSearchAlt className='icon-search' />
              <input className=' input-search' placeholder='Search chat' type='text' value={search} onChange={(val) => setSearch(val.target.value)} />
              <div className='d-flex bg-gray row-center btns-filter'>
                <button className={'btn pd-5 ' + (isGroup ? ' btn-second ' : ' btn-light ')} onClick={() => setIsGroup(false)} >Users</button>
                <button className={'btn pd-5 ' + (!isGroup ? ' btn-second ' : ' btn-light')} onClick={() => setIsGroup(true)}>Groups</button>
              </div>
              <div className='detailNavDropdown '>
                <img src='/assets/img/more-vertical.svg' alt='edit-icon' className='icon-drop icon-creat-group' onClick={hundlerDropdown} />
                <div id='CreateGroupDropdwon' className='drop-down-list'>
                  <NavLink className={'list-item'} to={'/chat/creatgroup'} onClick={() => hundlerChat()}>
                    <TbPencilPlus className='icon-drop-down' />
                    Creat Group</NavLink>
                  <NavLink className={'list-item'} to={'/chat/joingoup'} onClick={() => hundlerChat()}>
                    <TbUsersPlus className='icon-drop-down' />
                    Join Group</NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className='list-item-chat '>

            {(isGroup ? listGroupChat : listUserChat).filter((el: any) => (isGroup ? el?.id : el?.username).toLowerCase().indexOf(search.toLowerCase()) !== -1).map((user: any, i) => {
              return <NavLink to={`/chat/${isGroup ? 'groups/' : 'users/'}${user.id}`} className='block-user' key={i + user.id} onClick={() => hundlerChat()}>
                <div className='image-list-profile'>
                  <img className='' src={isGroup ? urlgrouimg : user.img} alt='profile' />
                  {isGroup ? null : <div className={`status-circle ${user?.online ? ` bg-green` : ' bg-gray'}`}>
                  </div>}
                </div>
                <div className='title-with-msg'>
                  <h2 className='name-user'>{isGroup ? user.id : user.username}</h2>
                  <p className='last-message-user'>{user.msg}</p>
                </div>
              </NavLink>
            }
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}


export const NewChat = () => {
  document.getElementById('root')?.classList.add('small-side-bar')

  return (
    <div id='Conversation' className='background-image conversation hide-scope d-flex w-screen h-screen '>
      <NavBar/>
      <div className='d-flex row-center vh-75 clm-center flex items-center h-[65vh]'>
        <NavLink to={'/chat/creatgroup'} className='btn btn-primary' > 
        <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
          Creat Group
        </button>
        </NavLink>
        <NavLink to={'/chat/joingoup'} className='btn btn-primary' > 
          <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all shadow-but active:bg-purple-active hover:cursor-pointer text-black font-[Roboto] font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
            Join Group
          </button>
        </NavLink>
      </div>
    </div>
  )
}

