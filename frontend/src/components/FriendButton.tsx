import React, { useState } from 'react';

function StateChangingButton() {
  const [currentState, setCurrentState] = useState<'add' | 'pending' | 'remove'>('add');

  const handleButtonClick = () => {
    // Toggle between states by using a switch statement
    switch (currentState) {
      case 'add':
        setCurrentState('pending');
        break;
      case 'pending':
        setCurrentState('remove');
        break;
      case 'remove':
        setCurrentState('add');
        break;
      default:
        setCurrentState('add');
    }
  };

  let buttonClassName = '';

  // Set the class name based on the currentState
  switch (currentState) {
    case 'add':
      buttonClassName = 'text-gray-200 bg-npc-purple hover:bg-purple-hover transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base';
      break;
    case 'pending':
      buttonClassName = 'text-gray-200 bg-gray-400 hover:bg-gray-500 transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base';
      break;
    case 'remove':
      buttonClassName = 'text-gray-200 bg-red-400 hover:bg-red-500 transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base';
      break;
    default:
      buttonClassName = 'text-gray-200 bg-npc-purple hover:bg-purple-hover transition-all font-montserrat p-1.5 rounded-lg sm:text-sm md:text-base';
  }

  return (
    <div className=''>
      <button
        className={buttonClassName}
        onClick={handleButtonClick}
      >
        {currentState === 'add' ? 'Add Friend' : currentState === 'pending' ? 'Cancel Request' : 'Remove Friend'}
      </button>
    </div>
  );
}

export default StateChangingButton;
