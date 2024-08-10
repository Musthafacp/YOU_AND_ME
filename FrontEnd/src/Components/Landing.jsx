import React from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen bg-pink-950 flex items-center flex-col gap-8 p-4">
      <h2 className="text-4xl md:text-5xl lg:text-6xl text-white text-center font-bold font-mono mt-44 md:mt-44 lg:mt-56">
        YOU & ME
      </h2>
      <button
        onClick={() => {
          navigate("/login");
        }}
        className="px-4 py-2 mt-5 md:px-6 md:py-3 w-full max-w-xs md:max-w-sm lg:max-w-md bg-white text-pink-950 rounded-sm hover:bg-pink-900 hover:text-white transition duration-300"
      >
        Let's get Started
      </button>
    </div>
  );
}

export default Home;
