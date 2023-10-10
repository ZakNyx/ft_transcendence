import React, { FC } from 'react';
import classes from './ProfileModal.module.css';

interface ProfileModalProps {
  OpenClose: () => void;
}

const ProfileModal: FC<ProfileModalProps> = (props) => {
  return (
    <div>
      <div onClick={props.OpenClose} className={classes.backdrop}></div>
      <div className={classes.card}>
        <div onClick={props.OpenClose} className={classes.close}>
          <i className="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
