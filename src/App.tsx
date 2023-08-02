function App() {

  return (
    <>
      <RightGrid />
    </>
  );
}
function RightGrid() {
  return (
    <div className="grid grid-cols-6 grid-rows-5 gap-0 h-screen ">
      <div className="col-span-2 row-span-4 row-start-2 flex justify-center items-center">
        <img className="max-w-full max-h-full" src="../public/images.png/PPimg.png" alt="Ping pong bats and balls" />
      </div>
      <div className="col-span-4 row-span-5 col-start-3 bg-npc-black  h-screen rounded-bl-3xl rounded-tl-3xl"></div>
    </div>
  );
}

export default App;