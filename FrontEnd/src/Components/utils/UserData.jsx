import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useUserData = () => {
  const [user, setUser] = useState(null);
  const [valid, setValid] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserdata = async (id) => {
    try {
      const response = await axios.get(
        `https://you-and-me-jg8p.onrender.com/users/myprofile/${id}`
      );
      setUserData(response.data);
    } catch (err) {
      console.log("Error while getting the profile data", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching user data...");
      try {
        const response = await axios.post(
          "https://you-and-me-jg8p.onrender.com/users/tokenvalidate",
          {},
          { withCredentials: true }
        );
        const { user, valid } = response.data;
        console.log(response.data);
        setUser(user);
        if (user) {
          getUserdata(user._id);
        }
        setValid(valid);
      } catch (error) {
        Cookies.remove("token");
        console.error("Error in post request", error.response.data);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { user, valid, userData, loading, error, setLoading, setUserData };
};

export default useUserData;
