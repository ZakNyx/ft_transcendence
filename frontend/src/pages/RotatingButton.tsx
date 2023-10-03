import React from 'react';

const RotatingButton: React.FC = () => {
    return (
        <button
            type="button"
            className="bg-violet-400/50 text-white py-2 px-4 rounded-full flex items-center justify-center border-solid border-2 
                border-blue-500"
            disabled
        >
            <svg
                className="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
            </svg>
            Waiting for your opponent to join...
        </button>
    );
};

export default RotatingButton;