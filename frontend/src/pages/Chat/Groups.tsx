import NavBar from "../../components/Navbar"
import { useContext, useEffect, useState, useCallback } from 'react'
import './group.scss';
import {  useParams } from 'react-router-dom';
import { UserContext, currentUserType } from './userContext';
import webSocket from '../../components/socketManager';
import { BiSearchAlt } from 'react-icons/bi';
import { MdAddTask } from 'react-icons/md';
import { FaUserMinus, FaUserPlus, FaUserSlash } from 'react-icons/fa';


export const CreatGroup = () => {
  const [groupname, setGroupName] = useState('');
  const [password, setPassword] = useState('');
  const [typegroup, setGroupType] = useState('Public');
  const socket = webSocket.getSocket();
  useEffect(() => {
    if (!socket) {
      webSocket.connect();
      // console.log('check start game socket')
    }
  }, [socket])
  const hundlerChat = () => {
    document.getElementById("Conversation")?.classList.add("hide-scope");
    var Conver = document.getElementById("chatList");
    if (Conver?.classList.contains('hide-scope')) {
      Conver.classList.remove('hide-scope');
    }
  }
  const Ft_CreateGroup = () => {
    if (groupname) {
      // console.log('create group');
      const data = { roomName: groupname, password, roomType: typegroup }
      socket?.emit('createRoom', data);
    }
  }
  useEffect(() => {
    var Conver = document.getElementById("Conversation");

    if (Conver?.classList.contains('hide-scope')) {
      // console.log("remove comve")
      Conver.classList.remove('hide-scope');
    }
  }, [])
  return (
    <div id='Conversation' className='creatGroupcontainer hide-scope'>
    <NavBar/>
      <div className='group-update'>
        <h1>Creat new Group</h1>
        <div className='input'>
          <label htmlFor='groupname'> Group Name</label>
          <input type='text' className='txt-input' id='groupname' placeholder='name group' value={groupname} onChange={(val) => setGroupName(val.target.value)} />
        </div>
        <div className='input'>
          <label htmlFor='typegroup'> type Group</label>
          <select id='typegroup' placeholder='-------' onChange={(val) => setGroupType(val.target.value)} >
            <option value={'Public'}>Public</option>
            <option value={'Private'}>Private</option>
            <option value={'Protected'}>Protected</option>
          </select>
        </div>
        {typegroup === 'Protected' ?
          <div className='input'>
            <label htmlFor='passwodgroup'>group password</label>
            <input type='password' className='txt-input' id='passwodgroup' placeholder='password' value={password} onChange={(val) => setPassword(val.target.value)} />
          </div>
          : null}
        <div className='btns-create-group'>
          <button className='btn btn-second' onClick={hundlerChat} >Cancel</button>
          <button className='btn btn-primary' onClick={Ft_CreateGroup}>Create</button>
        </div>
      </div>
    </div>

  )
}


export const JoinGruop = (props:{reload: boolean}) => {
  const [typegroup, setGroupType] = useState('Public');
  const { fetchData }: any = useContext(UserContext) as currentUserType;
  const urlimg = '/assets/img/table-bal.jpg'
  const [listGroup, setListGroup] = useState([]);
  const [password, setPassword] = useState('')
  const [search, setSearch] = useState('');
  const socket = webSocket.getSocket();

  // console.log('reladodo')
  useEffect(() => {
    if (!socket) {
      webSocket.connect();
      // console.log('check start game socket')
    }
  }, [socket])

  const getListMembers = async () => {

    await fetchData(`/auth-user/chat/allrooms`).then((data: any) => {
      // console.log('here', data);
      if (data?.length > 0) {
        setListGroup(data);
      }
    })
      .catch((err: any) => console.error(err));
  }

  const Ft_joinGroup = (roomName: string) => {
    // console.log('join group');
    const data = { roomName: roomName, password }
    socket?.emit('joinRoom', data);
  }

  const hundlerChat = () => {
    document.getElementById("Conversation")?.classList.add("hide-scope");
    var Conver = document.getElementById("chatList");
    if (Conver?.classList.contains('hide-scope')) {
      Conver.classList.remove('hide-scope');
    }
  }
  useEffect(() => {
    var Conver = document.getElementById("Conversation");

    if (Conver?.classList.contains('hide-scope')) {
      // console.log("remove comve")
      Conver.classList.remove('hide-scope');
    }

    getListMembers();
  }, [fetchData, props])

  return (
    <div id='Conversation' className='joinGroupcontainer hide-scope'>
      <NavBar/>
      <div className='group-update'>
        <h1>Join Group</h1>
        <div className='input'>
          <div className=' join-input'>
            <div className='Search filter-chat-list mr-0 border-none d-flex row-center'>
              <BiSearchAlt className='icon-search' />
              <input className=' input-search' type='text' id='groupname' placeholder='Search group' value={search} onChange={(val) => setSearch(val.target.value)} />
            </div>
            <select className='bg-none ' id='typegroup' onChange={(val) => setGroupType(val.target.value)} >
              <option value={'All'}>All</option>
              <option value={'Public'}>Public</option>
              <option value={'Protected'}>Protected</option>
            </select>
          </div>
        </div>

        <div className='userList w-100 listGroupJoin'>
          {listGroup.filter((el: any) => !el?.ismember && (el?.roomName).toLowerCase().indexOf(search.toLowerCase()) !== -1).map((group: any, i) => {
            return <div className="user-profile " key={group?.id + `${i}`}>
              <span className="profil-img"><img src={urlimg}></img></span>
              <span className="profil-last">{group?.roomName}</span>
              {group.protected ?
                <span className='password-input'>
                  <input type='password' className='Input' value={password} placeholder='password' onChange={(val) => setPassword(val.target.value)} />
                </span> : null
              }
              <h5>M-C : {group.userscount}</h5>

              <span className="icons cursor-pointer" onClick={() => Ft_joinGroup(group?.roomName)}><MdAddTask />
              </span>
            </div>
          })}
        </div>
        <div className='btns-create-group'>
          <button className='btn btn-second' onClick={hundlerChat} >Cancel</button>
          {/* <button className='btn create-btn'>Join</button> */}
        </div>
      </div>
    </div>

  )
}

export const GroupSettingGruop = (props:{reload:boolean}) => {
  const params = useParams();
  const groupId = params.id;
  const [members, setMembers] = useState([]);
  const { fetchData }: any = useContext(UserContext) as currentUserType;
  const [search, setSearch] = useState('');
  const socket = webSocket.getSocket();

  const deletemember = (member: any) => {
    // console.log('delete group');
    const data = { roomId: groupId, freindId: member.id };
    socket?.emit('kickUser', data);
  }

  const banemember = (member: any) => {
    // console.log('ban group');
    const data = { roomId: groupId, freindId: member.id }
    // console.log('data === ', data);
    socket?.emit('banUser', data);
  }

  const getListMembers = async () => {
    await fetchData(`/auth-user/chat/group/membres/${groupId}`).then((data: any) => {
      // console.log('here', data);
      if (data.members.length > 0) {
        setMembers(data.members);
      }
    })
      .catch((err: any) => console.error(err));
  }
  
  const UpdateMute = useCallback(async (member: any) => {
    /// ----- don't forget check if no update --- //
    const header = {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ id: member.id, roomId: groupId }),
      headers: { 'Content-Type': 'application/json' },
    };
    await fetchData(`/auth-user/chat/group/${!member.muted ? 'membermute' : 'memberunmute'}`, header).then((data: any) => {
      // console.log('here', data);
      getListMembers();
    })
      .catch((err: any) => console.error(err));

  }, [])

  const UpdateRole = useCallback (async (member: any, role: string) => {
    /// ----- don't forget check if no update --- //
    const header = {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ id: groupId, memberId: member.id, Role: role }),
      headers: { 'Content-Type': 'application/json' },
    };
    await fetchData(`/auth-user/chat/group/updateRole`, header).then((data: any) => {
      // console.log('here', data);
    })
      .catch((err: any) => console.error(err));
  },[])

  // const hundlerChat = () => {
  //   document.getElementById("Conversation")?.classList.add("hide-scope");
  //   var Conver = document.getElementById("chatList");
  //   if (Conver?.classList.contains('hide-scope')) {
  //     Conver.classList.remove('hide-scope');
  //   }
  // }
  // ------- handling dropdown
  const hundlerDropdown = (id: string) => {
    document.getElementById(id)?.classList.toggle("showDropdown");
  }
  const hundlerChat = () => {
    document.getElementById("Conversation")?.classList.add("hide-scope");
    var Conver = document.getElementById("chatList");
    if (Conver?.classList.contains('hide-scope')) {
      Conver.classList.remove('hide-scope');
    }
  }


  useEffect(() => {
    if (!socket) {
      webSocket.connect();
      // console.log('check socket')
    }
  }, [socket])

  useEffect(() => {
    var Conver = document.getElementById("Conversation");
    if (Conver?.classList.contains('hide-scope')) {
      // console.log("hide convirsation")
      Conver.classList.remove('hide-scope');
    }

    getListMembers();
  }, [fetchData, groupId, UpdateMute, UpdateRole, props])

  return (
    <div id='Conversation' className='joinGroupcontainer hide-scope'>
      <NavBar/>
      <div className='group-update d-flex-column row-center'>
        <div className='d-flex-column row-center'>
          <img src='/assets/img/kilwa.jpeg' className='' width={'100px'} alt='profile-goupe' />
          <h3 className='mr-10'>Group Name</h3>
        </div>

        <div className='input w-100'>
          <div className=' join-input'>
            <div className='Search filter-chat-list mr-0 border-none  d-flex row-center'>
              <BiSearchAlt className='icon-search' />
              <input className=' input-search' type='text' id='groupname' placeholder='Search group' value={search} onChange={(val) => setSearch(val.target.value)} />
            </div>
            <select className='bg-none ' id='typegroup' onChange={(val) => { }} >
              <option value={'All'}>All</option>
              <option value={'Admin'}>Admin</option>
              <option value={'Member'}>Member</option>
            </select>
          </div>
        </div>
        <div className='userList w-100 listGroupJoin list'>
          {members.filter((el: any) => (el?.username).toLowerCase().indexOf(search.toLowerCase()) !== -1).map((member: any, i) => {
            return <div className="user-profile " key={member?.id + `${i}`}>
              <span className="profil-img"><img src={member?.img}></img></span>
              <span className="profil-last">{member?.username}</span>
              {member.isMe || member.owner ? <span className='profil-last'>{member.owner ? 'Owner' : 'Admin'}</span> :
                <>
                  <span>
                    Mute :
                    <label className="toggle-switch mr-5">
                      <input type="checkbox" checked={member.muted} onChange={() => UpdateMute(member)} />
                      <div className="toggle-switch-background">
                        <div className="toggle-switch-handle"></div>
                      </div>
                    </label>
                  </span>
                  <select className='bg-none  pd-10' id='typegroup' onChange={(val) => UpdateRole(member, val.target.value)} >
                    {member.admin ?
                      <>
                        <option value={'Admin'}>Admin</option>
                        <option value={'Member'}>Member</option>
                      </> :
                      <>
                        <option value={'Member'}>Member</option>
                        <option value={'Admin'}>Admin</option>
                      </>}
                  </select>
                  <span className="icons cursor-pointer " onClick={() => deletemember(member)}><FaUserMinus /></span>
                  <span className="icons cursor-pointer" onClick={() => banemember(member)}><FaUserSlash /></span>
                </>
              }
            </div>
          })}
        </div>


      </div>
      <div>
        <button className='btn btn-second' onClick={hundlerChat} >Cancel</button>

      </div>
    </div>
  )
}

export const AddMemberGruop = (props:{reload:boolean}) => {
  const params = useParams();
  const groupId = params.id;
  const [users, steUsers] = useState([]);
  const { fetchData }: any = useContext(UserContext) as currentUserType;
  const socket = webSocket.getSocket();
  useEffect(() => {
    if (!socket) {
      webSocket.connect();
      // console.log('check start game socket')
    }
  }, [socket])
  const addMember = (memberId: string) => {
    const data = {
      user2: memberId,
      roomId: groupId
    }
    socket?.emit(`addUser`, data)
  }
  const hundlerChat = () => {
    document.getElementById("Conversation")?.classList.add("hide-scope");
    var Conver = document.getElementById("chatList");
    if (Conver?.classList.contains('hide-scope')) {
      Conver.classList.remove('hide-scope');
    }
  }
  useEffect(() => {

    var Conver = document.getElementById("Conversation");
    if (Conver?.classList.contains('hide-scope')) {
      // console.log("remove comve")
      Conver.classList.remove('hide-scope');
    }

    const getUsers = async () => {
      await fetchData(`/auth-user/chat/group/allusers/${groupId}`).then((data: any) => {
        // console.log('here', data);
        if (data?.length > 0) {
          steUsers(data);
        }
        else
          steUsers([]);
      })
        .catch((err: any) => console.error(err));
    }
    getUsers();
  }, [fetchData, groupId, props])
  return (
    <div id='Conversation' className='addNewMember hide-scope'>
      <NavBar/>
      <div className='listUsers pd-20 d-flex-column'>
        <div className='Search'>
          {/* <FontAwesomeIcon className='icon-search' icon={faSearch} /> */}
          <BiSearchAlt className='icon-search' />
          <input name="search" className='input-search' type='text' placeholder='search' />
        </div>
        <div className='userList w-100'>
          {users && users?.length > 0 ? users.map((user: any, i) => {
            return <div className="user-profile " key={user?.id + `${i}`}>
              <div className="profil-img"><img src={user?.avatar}></img></div>
              <p className="profil-last">{user?.username}</p>
              <div className="icons cursor-pointer" onClick={() => addMember(user.id)}><FaUserPlus /></div>
            </div>
          }) :
            <p className='mr-10 d-flex clm-center'>no user available</p>}
        </div>

      </div>
      <div>
        <button className='btn btn-second' onClick={hundlerChat} >Cancel</button>
      </div>
    </div>
  )
}