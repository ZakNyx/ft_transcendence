import React, { FC, useRef, useState } from 'react';
import classes from './NewChannel.module.css';
import Password from './Password';

interface NewChannelProps {
  OpenClose: () => void;
}

const NewChannel: FC<NewChannelProps> = (props) => {
  const [choice, setChoice] = useState<boolean>(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const statusInputRef = useRef<HTMLDivElement>(null);

  const SubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredName = nameInputRef.current!.value;
    const enteredDescription = descriptionInputRef.current!.value;
    const enteredStatus = statusInputRef.current!;

    const data = {
      name: enteredName,
      description: enteredDescription,
      status: enteredStatus,
    };
    console.log(enteredStatus);
  };

  return (
    <div>
      <div onClick={props.OpenClose} className={classes.backdrop}></div>
      <div className={classes.card}>
        <form className={classes.createForm} onSubmit={SubmitHandler}>
          <div className={classes.text}>Create new channel</div>
          <h5>
            Channels are where your team communicate, They're best when to
            organized around topic
          </h5>
          <div className={classes.info}>
            <label> Channel name </label>
            <input
              type="text"
              name="name"
              className={classes.inputs}
              required
              ref={nameInputRef}
            />
          </div>
          <div className={classes.info}>
            <label>
              {' '}
              Description <span>(optional)</span>{' '}
            </label>
            <textarea
              type="text"
              name="description"
              required
              ref={descriptionInputRef}
            />
          </div>
          <div className={classes.info}>
            <label> Status </label>
            <div ref={statusInputRef}>
              <div className={classes.status}>
                <input
                  type="radio"
                  name="status"
                  onChange={() => setChoice(false)}
                />
                <label>public</label>
              </div>
              <div className={classes.status}>
                <input
                  type="radio"
                  name="status"
                  onChange={() => setChoice(false)}
                />
                <label>private</label>
              </div>
              <div className={classes.status}>
                <input
                  type="radio"
                  name="status"
                  onChange={() => setChoice(true)}
                />
                <label>protected</label>
              </div>
            </div>
          </div>
          {choice ? <Password /> : null}
          <div className={classes.info}>
            <label>
              {' '}
              Add people <span>(You can skip this step for now) </span>
            </label>
            <input
              type="text"
              name="name"
              className={classes.inputs}
            />
          </div>
          <div className={classes.buttons}>
            <button onClick={props.OpenClose} id={classes.cancel}>
              Cancel
            </button>
            <button id={classes.create}>Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChannel;