import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUserData from "./utils/UserData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserProfile() {
  const { id } = useParams();
  const { user, valid, userData, loading, error, getUserdata } = useUserData();
  const [userProfileData, setUserProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const notify = (message) => toast(message);

  const followThisUser = async () => {
    if (!userData) {
      notify("You must be logged in to follow users.");
      navigate("/login");
      return;
    }

    try {
      const action = isFollowing ? "unfollow" : "follow";
      const response = await axios.post(
        `https://you-and-me-jg8p.onrender.com/users/${action}/${userProfileData._id}`,
        { userid: userData._id }
      );

      notify(response.data.message);
      if (action === "follow") {
        setUserProfileData((prevData) => ({
          ...prevData,
          followers: [...prevData.followers, userData._id],
        }));
      } else {
        setUserProfileData((prevData) => ({
          ...prevData,
          followers: prevData.followers.filter(
            (followerId) => followerId !== userData._id
          ),
        }));
      }

      setIsFollowing((prevState) => !prevState);
    } catch (err) {
      console.log(`Error while ${isFollowing ? "unfollowing" : "following"} the user`, err);
      notify(`Error while ${isFollowing ? "unfollowing" : "following"} the user`);
    }
  };

  useEffect(() => {
    const fetchUserProfileData = async () => {
      try {
        const response = await axios.get(
          `https://you-and-me-jg8p.onrender.com/users/myprofile/${id}`
        );
        
        const profileData = response.data;
        setUserProfileData(profileData);

        // Check if the current user is following this profile
        if (userData) {
          setIsFollowing(profileData.followers.includes(userData._id));
        }
      } catch (err) {
        console.log("Error while getting the profile data", err);
        notify("Error while getting the profile data");
      }
    };

    fetchUserProfileData();
  }, [id, userData]); 
  
  if (!userProfileData) return <div>Loading...</div>;

  return (
    <div className="px-10 py-10 bg-pink-800 w-screen h-screen">
      <ToastContainer />
      <div className="flex flex-col items-center gap-9 mt-20 lg:mt-28">
        <img
          className="w-32 h-32 rounded-full"
          src={userProfileData?.profilePic}
          alt="Profile"
        />
        <h2 className="text-center text-3xl font-bold text-white">
          {userProfileData?.name}
        </h2>
      </div>
      <div className="flex justify-center gap-10 mt-8 text-xl font-semibold text-white">
        <div>
          <h2 className="text-center">{userProfileData?.followers?.length}</h2>
          <h2>Followers</h2>
        </div>
        <div>
          <h2 className="text-center">{userProfileData?.following?.length}</h2>
          <h2>Following</h2>
        </div>
      </div>
      <div className="flex justify-center gap-10 mt-10">
        <button
          className="px-5 w-40 py-2 border text-white"
          onClick={followThisUser}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        <button
          className="px-5 w-40 py-2 bg-white text-pink-950"
          onClick={() => navigate(`/chat`)}
        >
          Message
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
