import React, { useState } from "react";
import useUserData from "./utils/UserData";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid"; 
import axios from "axios";
import { imDB } from "./Firebase/firebase";

function Profile() {
  const { userData } = useUserData();
  const [editMode, setEditMode] = useState(false);
  const [editedProfilePic, setEditedProfilePic] = useState(null); // Set initial state to null
  const [editedName, setEditedName] = useState(userData?.name || "");

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setEditedProfilePic(file);
  };

  const handleSave = async () => {
    if (editedProfilePic) {
      const imgS = ref(imDB, `images/${v4()}`);
      try {
        const uploadData = await uploadBytes(imgS, editedProfilePic);
        const imageUrl = await getDownloadURL(uploadData.ref);

        console.log(imageUrl);
        
        const response = await axios.patch(
          `http://localhost:4000/users/updateProfile/${userData._id}`,
          { imageUrl, name: editedName }
        );

        console.log(response.data);
        window.location.reload();
      } catch (err) {
        console.log("Error while updating the profile picture", err);
      }
    } else {
      try {
        const response = await axios.patch(
          `http://localhost:4000/users/updateProfile/${userData._id}`,
          { name: editedName }
        );

        console.log(response.data);
        window.location.reload();
      } catch (err) {
        console.log("Error while updating the name", err);
      }
    }

    setEditMode(false);
  };

  return (
    <div className="px-4 py-8 md:px-10 md:py-10 bg-pink-800 w-screen h-screen">
      <div className="flex flex-col items-center gap-6 mt-16 md:mt-20 lg:mt-28">
        {editMode ? (
          <input
            className="w-24 h-24 md:w-32 md:h-32 flex pl-4 pt-10 rounded-full border-2 border-gray-300"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        ) : (
          <img
            className="w-24 h-24 md:w-32 md:h-32 rounded-full"
            src={userData?.profilePic}
            alt="Profile"
          />
        )}
        {editMode ? (
          <input
            className="w-1/4 px-4 py-2 outline-none rounded-sm"
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="New Name"
          />
        ) : (
          <h2 className="text-center text-2xl md:text-3xl font-bold text-white">
            {userData?.name}
          </h2>
        )}
      </div>
      <div className="flex justify-center gap-8 mt-6 md:gap-10 md:mt-8 text-lg md:text-xl font-semibold text-white">
        <div>
          <h2 className="text-center">{userData?.followers.length}</h2>
          <h2>Followers</h2>
        </div>
        <div>
          <h2 className="text-center">{userData?.following.length}</h2>
          <h2>Following</h2>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-8 md:mt-10">
        {editMode ? (
          <>
            <button
              className="px-4 py-2 lg:w-1/4 md:px-5 md:py-2.5 border tracking-wider text-pink-950 bg-white"
              onClick={handleSave}
            >
              SAVE
            </button>
            <button
              className="px-4 py-2 lg:w-1/4 md:px-5 md:py-2.5 border tracking-wider text-white"
              onClick={handleEditToggle}
            >
              CANCEL
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 lg:w-1/4 md:px-5 md:py-2.5 border text-white"
            onClick={handleEditToggle}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
