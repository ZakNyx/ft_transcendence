import React from 'react';
import classes from './Admins.module.css';

const AdminCard: React.FC = () => {
  return (
    <div className={classes.AdminsCard}>
      <img className={classes.AdminImage} alt="" src="https://i.pinimg.com/474x/ec/e2/b0/ece2b0f541d47e4078aef33ffd22777e.jpg" />
      <div>Admin</div>
    </div>
  );
};

const Admins: React.FC = () => {
  return (
    <div>
      <hr />
      <div className={classes.Admins}>
        {[...Array(12)].map((_, index) => (
          <div key={index}>
            <AdminCard />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admins;
