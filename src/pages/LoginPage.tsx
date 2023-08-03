import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="grid grid-cols-6 grid-rows-5 gap-0 h-screen relative">
            <img
                className="absolute top-2 left-2 w-32 h-auto"
                src="../public/images/pingpong.png"
                alt="Ping Pong"
            />
            <div className="col-span-2 row-span-4 row-start-2 flex justify-center items-center">
                <img className="max-w-full max-h-full"
                    src="../public/images/PPimg.png"
                    alt="Ping pong bats and balls" />
            </div>
            <div className="col-span-4 row-span-5 col-start-3 bg-npc-black h-screen rounded-bl-3xl rounded-tl-3xl flex flex-col justify-center items-center">
                <h1 className="text-npc-purple text-base sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8">Play PONG with your friends</h1>
                <Link to="/home">
          <button className="relative bg-npc-purple hover:bg-purple-hover hover:cursor-pointer text-black font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
            <img
              className="w-10 h-10 mr-4"
              src="../public/images/42_Logo.svg.png"
              alt="42 Logo"
            />
            Sign in with 42
          </button>
        </Link>
      </div>
    </div>
  );
}