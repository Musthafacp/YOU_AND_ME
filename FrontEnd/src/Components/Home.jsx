import axios from "axios";
import React, { useEffect, useState } from "react";
import chat from "../Assets/send.png";
import { useNavigate } from "react-router-dom";
import useUserData from "./utils/UserData";
function Home() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { userData } = useUserData();

  const fetchUsersData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/${userData?._id}`
      );
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData && userData._id) {
      fetchUsersData();
    }
  }, [userData]);

  const sendMessage = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div
      className="px-5 py-5 sm:px-10 sm:py-10 h-screen w-screen bg-contain bg-no-repeat "
      style={{
        backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/005/083/786/original/you-and-me-calligraphic-inscription-with-smooth-lines-vector.jpg)`,
        backgroundPosition : "center",
      }}
    >
      <nav className="bg-pink-600 px-5 py-3 sm:px-10">
        <ul className="flex justify-evenly text-white items-center font-bold text-base sm:text-lg">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer" onClick={() => navigate("/chat")}>Chats</li>
          <li
            onClick={() => {
              navigate("/profile");
            }}
            className="cursor-pointer flex items-center gap-3 text-pink-950"
          >
            <img
              src={userData?.profilePic}
              className="w-10 h-10 rounded-full"
              alt=""
            />
            <h2 className="text-white">{userData?.name}</h2>
          </li>
        </ul>
      </nav>
      <h2 className="text-2xl font-bold mt-5 sm:text-4xl">Users</h2>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users &&
          users.map((user) => {
            return (
              <div
                key={user._id}
                onClick={() => {
                  navigate(`/userprofile/${user._id}`);
                }}
                className="shadow-md py-5 bg-white flex gap-5 px-5 rounded-sm shadow-pink-950"
              >
                <img
                  className="w-16 h-16 rounded-sm sm:w-20 sm:h-20"
                  src={user.profilePic}
                  alt=""
                />
                <div className="w-full">
                  <div>
                    <h2 className="font-semibold text-sm sm:text-base">
                      {user.name}
                    </h2>
                    <h2 className="text-sm sm:text-base">{user.email}</h2>
                  </div>
                  <div className="mt-2 flex justify-end w-full">
                    <img
                      className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                      onClick={() => sendMessage(user._id)}
                      src={chat}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Home;
