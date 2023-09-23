import React, { useState } from "react";

export default function BlockButton() {
    const [state, setState] = useState<boolean>(false)
    const handleState = () => {
        setState(!state)
        console.log(state)
    }
    return (
        <div>
            <button onClick={handleState} className={`${
                state
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } transition-all rounded-3xl text-gray-200 font-montserrat p-1.5`}>
                {state ? "Unblock" : "Block"}
            </button>
        </div>
    )
}