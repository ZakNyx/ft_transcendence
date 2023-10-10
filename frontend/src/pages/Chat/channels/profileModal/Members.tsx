import React, { FC } from 'react';
import classes from './Members.module.css';

interface MemberCardProps {
  imageSrc: string;
}

const MemberCard: FC<MemberCardProps> = ({ imageSrc }) => {
  return (
    <div className={classes.MembersCard}>
      <img className={classes.MemberImage} alt="" src={imageSrc}></img>
      <div>Member</div>
    </div>
  );
}

const Members: FC = () => {
  return (
    <div>
      <hr />
      <div className={classes.Members}>
        <div><MemberCard imageSrc="https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg" /></div>
        <div><MemberCard imageSrc="https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg" /></div>
      </div>
    </div>
  );
}

export default Members;