import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImage1 from "../assets/signup_image1.jpg";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  // Update this to match your backend port (likely 3000)
  const apiUrl = "http://localhost:3001/api/auth/login";
  console.log("Making request to:", apiUrl);

  axios
    .post(apiUrl, { email, password })
    .then((result) => {
      console.log("Full login response:", result);
      console.log("Response data:", result.data);
      console.log("User data:", result.data.user);

      // Check if the response contains user data with role information
      if (result.data && result.data.user) {
        // Log the user data before storing
        console.log("Storing user data:", result.data.user);
        console.log("isFirstLogin:", result.data.user.isFirstLogin);
        console.log("profileCompleted:", result.data.user.profileCompleted);
        
        //store user data in local storage
        localStorage.setItem("user", JSON.stringify(result.data.user));
        
        // Verify what was stored
        const storedUser = localStorage.getItem("user");
        console.log("Stored in localStorage:", storedUser);
        console.log("Parsed stored user:", JSON.parse(storedUser));
        
        // Check if user has admin role
        if (result.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/birder/dashboard");
        }
      } 
      // Handle legacy "Success" response for backward compatibility
      else if (result.data === "Success") {
        console.log("Legacy response received");
        navigate("/birder/dashboard");
      } 
      // Handle invalid credentials
      else {
        console.log("Invalid response structure:", result.data);
        alert("Invalid credentials");
      }
    })
    .catch((err) => {
      console.log("Login error:", err);
      console.log("Error response:", err.response);
      alert("Login failed. Please try again.");
    });
};

  return (
    <div className="min-h-screen flex">
      {/* Image Column - Background */}
      <div className="relative w-1/2 border-r border-black group">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${signupImage1})` }}
        />
        <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-0" />
        <div className="relative h-full flex flex-col justify-between p-10 text-white">
          <div className="p-4 rounded-lg max-w-max">
            <p className="text-xl font-bold">Blue-Tailed Bee Eater</p>
            <p className="italic">Merops phillipinus</p>
          </div>
          <div className="p-4 rounded-lg max-w-max self-end flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Thalangama Lake</span>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-[#fffdef]">
        <form
          className="w-full max-w-md space-y-4"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl mb-10 text-left">Sign in to your account</h1>

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Email</label>
            <input
              type="email"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Password</label>
            <input
              type="password"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-900 rounded text-white py-2 px-4 hover:bg-amber-800 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Submit
          </button>

          <Link
            to="/forgot-password-page1"
            className="-mt-[10px] text-amber-800 hover:text-amber-600 block"
          >
            Forgot password?
          </Link>

          <br />

          <span>
            Don't have an account?
            <button className="ml-5 border rounded border-amber-900 bg-[#f8eec8] px-4 py-2 hover:border-black hover:bg-amber-100 transition-colors">
              <Link to="/sign-up">Sign up</Link>
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;