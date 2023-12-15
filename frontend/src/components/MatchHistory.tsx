import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { myGameOppName } from "../pages/variables";

interface GameData {
  id: number;
  ingame: boolean;
  Me: string;
  MyOpponent: string;
  MyScore: string;
  MyOpponentScore: string;
  users: any;
}
interface UserData {
  userID: string;
  username: string;
  profilePicture: string;
  displayname: string;
  gamesPlayed: number;
  wins: number;
  loses: number;
  winrate: number;
  elo: number;
  status2fa: boolean;
  secret2fa: boolean;
  secretAuthUrl: boolean;
}

const MatchHistory = () => {
  const [gameData, setGameData] = useState<any>();
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [oppPicture, setOppPicture] = useState<string | null>(null);
  const [myName, setMyName] = useState<string>("");
  const [myOpponentName, setMyOpponentName] = useState<string>("");
  const [myScore, setMyScore] = useState<string>("");
  const [myOpponentScore, setMyOpponentScore] = useState<string>("");
  let Playerusername = localStorage.getItem("Username");
  let { username } = useParams(); // Get the username parameter from the URL
  if (!username) {
    username = "me";
  }

  
  useEffect(() => {
    // Function to fetch user picture
    const fetchUserPicture = async () => {
      const tokenCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));
      
      try {
        if (tokenCookie) {
          const token = tokenCookie.split("=")[1];
          const response = await axios.get(
            `http://localhost:3000/profile/${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
            );
            setUser(response.data);
            setUserPicture(response.data.picture);
          } else {
            // Handle the case when there is no token (e.g., display a placeholder image)
            setUserPicture("../../images/default.png");
          }
        } catch (error) {
          // Handle errors gracefully (e.g., display an error message to the user)
          console.error("Error fetching user picture:", error);
        }
      };
      
      // Call the fetchUserPicture function
      fetchUserPicture();
    }, [username]);
    
    // useEffect(() => {
      //   // Function to fetch user picture
      useEffect(() => {
        const fetchData = async () => {
          try {
            if(user) {const response = await axios.get(
              `http://localhost:3000/games/user/${user.username}`, // Update the URL to match your API endpoint
            );
            setGameData(response.data);
            console.log(gameData);}
          } catch (error) {
            console.error("Error fetching game data:", error);
          }
        };
    
        fetchData();
      }, [user]);
      //   const fetchUserPicture = async () => {
  //     const tokenCookie = document.cookie
  //       .split("; ")
  //       .find((cookie) => cookie.startsWith("token="));

  //     try {
  //       if (tokenCookie) {
  //         const token = tokenCookie.split("=")[1];
  //         const response = await axios.get(
  //           `http://localhost:3000/profile/${myGameOppName}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           },
  //         );
  //         setOppPicture(response.data.picture);
  //       } else {
  //         // Handle the case when there is no token (e.g., display a placeholder image)
  //         setOppPicture("../../images/default.png");
  //       }
  //     } catch (error) {
  //       // Handle errors gracefully (e.g., display an error message to the user)
  //       console.error("Error fetching user picture:", error);
  //     }
  //   };

    // Call the fetchUserPicture function
  //   fetchUserPicture();
  // }, []);

  useEffect(() => {
    if (gameData) {
      gameData.map((match: any, index: any) => {
        if (match.player1 === user?.username) {
          console.log(match.player1 + "   " + user?.username)
          setMyName(match.player1);
          setMyScore(match.score1);
          setMyOpponentName(match.player2);
          setMyOpponentScore(match.score2);
        }
        if (match.player2 === user?.username) {
          setMyName(match.player2);
          setMyScore(match.score2);
          setMyOpponentName(match.player1);
          setMyOpponentScore(match.score1);
        }
        });

        console.log("hnaaaaa",user?.username ,gameData)
    }
  }, [myName, myOpponentName, myScore, myOpponentScore, username, gameData]);

  const getOpponentImage = (game : any) => {
    if (game?.users?.[0]?.username === user?.username) {
      return game?.users?.[1]?.image || null;
    } else {
      return game?.users?.[0]?.image || null;
    }
  }

  return (
    <div className="background-gray rounded-[30px] h-[44vh] p-6 mt-6 mx-auto lg:max-w-[95%] shadow-[0px_10px_20px_20px_#00000024] animate-fade-in-top overflow-y-scroll">
      <h1 className="text-gray-200 font-[Rubik] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl mb-4 ">
        Match History
      </h1>
      <ul className="space-y-4">
        {gameData &&
          gameData.map((match: any, index: any) => (
            <li
              key={index}
              className={`flex items-center justify-between text-gray-100 font-[Rubik] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl rounded-md p-3 ${
                (match.score1 == 5 && match.player1 == user?.username) ||
                (match.player2 == user?.username && match.score2 == 5)
                  ? "linear-grad-green"
                  : "lenin-grad-red"
              }`}
            >
              <div className="flex items-center space-x-2">
                <img
                  src={userPicture || "../../images/default.png"}
                  alt={`Your profile`}
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-gray-200 text-base">
                  {match.player1 == user?.username
                    ? match.player1
                    : match.player2}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">
                  {match.player1 == user?.username
                    ? match.score1
                    : match.score2}
                </span>
                <span className="text-gray-500">-</span>
                <span className="text-red-500">
                  {match.player1 != user?.username
                    ? match.score1
                    : match.score2}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <img
                  src={getOpponentImage(match) || "../../images/default.png"}
                  alt={`Your profile`}
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-gray-200 text-base">
                  {match.player1 != user?.username
                    ? match.player1
                    : match.player2}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MatchHistory;
