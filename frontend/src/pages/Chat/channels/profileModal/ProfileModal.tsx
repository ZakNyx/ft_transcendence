import React from 'react';
import ChannelInfo from './ChannelInfo';
import classes from './ProfileModal.module.css';

interface ProfileModalProps {
  OpenClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.OpenClose}></div>
      <div className={classes.card}>
        <div onClick={props.OpenClose} className={classes.close}> <i className="fa-solid fa-xmark"></i></div>
        <ChannelInfo />
      </div>
    </div>
  );
};

export default ProfileModal;
