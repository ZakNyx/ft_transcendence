import React, { FC } from 'react';
import classes from "./Password.module.css"

const Password: FC = () => {
    return (
        <div>
            <div className={classes.info} >
                <label> Create password </label>
                <input type="password" name="name" className={classes.inputs} required />
            </div>
            <div className={classes.info} >
                <label> Confirm password </label>
                <input type="password" name="name" className={classes.inputs} required />
            </div>
        </div>
    )
}

export default Password;