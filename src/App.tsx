import React from "react";

function App() {

  return (
    <>
    <RightGrid />
    </>
  );
}

function RightGrid() {
  return (
    <div className="grid grid-cols-6 grid-rows-4 gap-0">
      <div className="col-span-4 row-span-4 col-start-3 bg-npc-black opacity-95 h-screen rounded-bl-3xl rounded-tl-3xl"></div>
    </div>
  )
}
export default App
