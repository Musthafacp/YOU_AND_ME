import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "preline/preline";
import useUserData from "../utils/UserData";
function SignIn() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const { valid } = useUserData();
  const onClick = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (valid) {
      navigate("/home");
    }
  }, [valid]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://you-and-me-jg8p.onrender.com/users/getone",
        data,
        {
          withCredentials: true,
        }
      );
      Cookies.set("token", response.data.token);
      if (response.status === 201) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error in post request", error.response.error);
      setApiError(error.response.data.error);
    }
  };

  const toLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <>
      {alert && apiError && (
        <div className="absolute flex justify-center items-center w-full top-0">
          <div className="px-7 w-full lg:w-2/4 rounded-md py-2 bg-red-600 flex items-center justify-center text-center">
            <h2 className="text-sm lg:text-xl text-white font-thin tracking-widest">
              {apiError}
            </h2>
          </div>
        </div>
      )}

      <div
        className="w-full h-screen bg-pink-950 grid py-10 lg:py-28 justify-center lg:justify-end items-center bg-no-repeat bg-cover"
        style={{
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full flex lg:mt-0 px-5 lg:px-0 lg:pr-32">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-center md:mt-0 mt-20  items-center h-fit py-10 w-full lg:w-auto px-6 lg:px-10 bg-white rounded-3xl rounded-e-none shadow-xl flex-col"
          >
            <div className="text-start w-full">
              <h2 className="text-black font-poppins text-start text-xl lg:text-3xl font-bold">
                LOGIN
              </h2>
            </div>
            <div className="w-full mt-6">
              <input
                type="text"
                className="bg-white border outline-none w-full py-2 px-2 font-light"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                    message: "Invalid email",
                  },
                })}
              />
              <p className="text-red-500 text-xs ">
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </p>
            </div>

            <div className="w-full mt-5">
              <input
                type="password"
                className="bg-white border outline-none w-full py-2 px-2 font-light"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length is 4 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Maximum length is 20 characters",
                  },
                })}
              />
              <p className="text-red-500 text-xs">
                {errors.password && (
                  <span className="error-message">
                    {errors.password.message}
                  </span>
                )}
              </p>
            </div>

            <div className="flex mt-6 w-full gap-2 lg:gap-5">
              <button
                type="submit"
                className="bg-pink-900 duration-500 w-full text-xs lg:text-sm py-2 font-semibold tracking-wider text-white cursor-pointer"
              >
                LOGIN
              </button>
            </div>
            <div className="flex items-center mt-6 lg:mt-7 gap-2 lg:gap-3 w-full">
              <hr className="bg-blue-900 w-1/3 lg:w-32" />
              <span className="text-xs lg:text-sm">OR</span>
              <hr className="bg-blue-900 w-1/3 lg:w-32" />
            </div>

            <div
              onClick={() => toLogin()}
              className="gap-3 lg:gap-5 bg-white border font-poppins flex items-center justify-center rounded-2xl w-full mt-5 lg:mt-7 py-2 lg:py-4 cursor-pointer"
            >
              <svg
                className="google-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="1.4em"
                height="1.4em"
                version="1.1"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                    c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                    c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                    C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                    c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              <span className="text-xs lg:text-sm">Login with Google</span>
            </div>
            <div>
              <h1 className="mt-5 lg:mt-8 text-xs lg:text-sm">
                DON'T HAVE AN ACCOUNT?
                <span
                  onClick={onClick}
                  className="cursor-pointer font-semibold ml-1 font-poppins underline"
                >
                  SIGN UP
                </span>
              </h1>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
