import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const tokenCookie = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("token="));
  console.log(tokenCookie);
  useEffect(() => {
    if (tokenCookie) {
      navigate("/home");
    }
  }, [navigate, tokenCookie]);
  return (
    <div className="grid grid-cols-6 grid-rows-5 gap-0 h-screen relative custom-gradient">
      {/* Import Google Fonts */}
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');
      </style>
      {/* Logo */}
      <img
        className="absolute top-2 left-2 w-32 h-auto"
        src="../public/images/pingpong.png"
        alt="Ping Pong"
      />

      {/* Center Image with Animation */}
      <div className="col-span-2 row-span-4 row-start-2 flex justify-center items-center animate-float">
        <img
          className="max-w-full max-h-full"
          src="../public/images/PPimg.png"
          alt="Ping pong bats and balls"
        />
      </div>

      {/* Main Content */}
      <div className="col-span-4 row-span-5 col-start-3 bg-npc-black opacity-95 h-screen rounded-bl-3xl rounded-tl-3xl flex flex-col justify-center items-center">
        <h1 className="text-npc-purple text-base sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-8 text-center whitespace-nowrap">
          Play PONG with your friends
        </h1>
        <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1673790452bf538aaef1e49f04a19251ad49e71f28904d907a7039619261c115&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code">
          <button className="relative bg-npc-purple hover:bg-purple-hover hover:translate-y-[-6px] transition-all active:bg-purple-active hover:cursor-pointer text-black font-bold shadow-but text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:p-3 xl:p-4 rounded-lg flex items-center">
            {/* 42 Logo */}
            <img
              className="w-10 h-10 mr-4"
              src="../public/images/42_Logo.svg.png"
              alt="42 Logo"
            />
            Sign in with 42
          </button>
        </a>
      </div>
    </div>
  );
}

// https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-fc5e1f6b7adf4e8a71272ed39555392c3ab4980710ae3924ec3bcec7462509b9&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fredirect&response_type=code
