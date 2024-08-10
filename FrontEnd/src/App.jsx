import React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./Components/Authontication/SignIn";
import SignUp from "./Components/Authontication/SignUp";
import Landing from "./Components/Landing";
import Home from "./Components/Home";
import Chat from "./Components/Chat";
import Profile from "./Components/Profile";
import UserProfile from "./Components/UserProfile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/userprofile/:id" element={<UserProfile />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      {/* <Route path="/chat/:id" element={<Chat />} /> */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
