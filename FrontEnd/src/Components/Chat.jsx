import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import useUserData from "./utils/UserData";

const Chat = () => {
  const { userData } = useUserData();
  const [usersdata, setUsersData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const handleResize = () => {
    setIsMobileView(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSidebarUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/myfriends/${userData?._id}`
      );
      setUsersData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchSidebarUsers();
    }
  }, [userData]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && selectedUser && userData) {
      const handlePersonalMessage = (receivedMessage) => {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      };
      socket.emit("joinPersonalChat", {
        userId: userData._id,
        otherUserId: selectedUser._id,
      });

      socket.on("personalMessage", handlePersonalMessage);

      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `http://localhost:4000/chat/personalMessages/${userData._id}/${selectedUser._id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching personal messages:", error);
        }
      };

      fetchMessages();

      return () => {
        socket.off("personalMessage", handlePersonalMessage);
      };
    }
  }, [socket, selectedUser, userData]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim() !== "" && selectedUser) {
      const message = {
        senderId: userData._id,
        receiverId: selectedUser._id,
        text: newMessage.trim(),
        timestamp: new Date(),
      };

      socket.emit("personalMessage", message);
      setNewMessage("");
    }
  }, [newMessage, selectedUser, userData, socket]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const handleGoBack = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:px-10 px-2 py-2 lg:py-10 flex h-screen">
      {(!selectedUser || !isMobileView) && (
        <div className="w-full md:w-[23vw] px-2 bg-pink-900 h-full md:block">
          <div className="flex py-2 px-2 justify-between">
            <h2 className=" text-2xl font-semibold text-white">Chats</h2>
            {isMobileView && (
              <div
                className="flex gap-2 p-2 rounded-sm border"
                onClick={() => navigate(`/profile`)}
              >
                <h2 className="text-white tracking-wider">{userData?.name}</h2>
                <div
                  className="w-7 h-7 bg-cover"
                  style={{
                    backgroundImage: `url(${userData?.profilePic})`,
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
            )}
          </div>
          <div>
            {usersdata ? (
              usersdata.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-2 hover:bg-pink-800 cursor-pointer"
                  onClick={() => handleUserSelect(user)}
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.profilePic}
                    alt={user.name}
                  />
                  <span className="ml-3 text-white">{user.name}</span>
                </div>
              ))
            ) : (
              <p className="text-white">Loading users...</p>
            )}
          </div>
        </div>
      )}
      {selectedUser && (
        <div className="w-full md:w-[77vw]">
          <div className="grid w-full">
            <div className="flex items-center p-4 border-b">
              {isMobileView && (
                <button className="mr-4 flex items-center text-2xl font-semibold">
                  <span onClick={handleGoBack} className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-7 h-7 transform rotate-180"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                      ></path>
                    </svg>
                  </span>
                </button>
              )}
              <img
                className="w-12 h-12 rounded-full"
                src={selectedUser.profilePic}
                alt={selectedUser.name}
              />
              <h2 className="ml-4 text-lg font-semibold">
                {selectedUser.name}
              </h2>
            </div>
            <div className="overflow-auto h-[76vh] lg:h-[69vh] myPosts p-5">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <h2 className="text-2xl text-center text-gray-400 font-semibold tracking-wider">
                    No messages yet
                  </h2>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-2 ${
                      message?.senderId === userData._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2.5 ${
                        message?.senderId === userData._id
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <img
                        className="w-8 h-8 rounded-full"
                        src={
                          message?.senderId === userData._id
                            ? userData.profilePic
                            : selectedUser.profilePic
                        }
                        alt="profile"
                      />
                      <div
                        className={`flex flex-col w-full max-w-[320px] leading-1.5 px-4 py-3 border-gray-200 ${
                          message?.senderId === userData._id
                            ? "bg-gray-700 text-white rounded-s-xl rounded-e-xl"
                            : "bg-gray-100 text-black rounded-e-xl rounded-s-xl"
                        }`}
                      >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm font-semibold">
                            {message?.senderId === userData._id
                              ? "You"
                              : selectedUser.name}
                          </span>
                        </div>
                        <p className="text-sm font-normal py-2.5">
                          {message?.text}
                        </p>
                        <span className="text-sm text-end font-normal text-gray-500 dark:text-gray-400">
                          {new Date(message?.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="px-4 lg:py-3 flex gap-3 items-center">
              <input
                type="text"
                className="w-full px-2 py-2 font-light rounded bg-white border focus:outline-none focus:border-blue-500"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-black text-white rounded-sm cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
