import React from "react";
import { Link, useNavigate } from "react-router-dom";
import signupImage1 from "../assets/signup_image1.jpg";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    axios
      .post("http://localhost:3001/api/auth/register", { 
        username, 
        email, 
        password 
      })
      .then((result) => {
        console.log(result);
        if (result.data.message === "Account created successfully") {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
        }
      });
  };

  return (
    <div className="min-h-screen flex">
      {/* Image Column - Background */}
      <div
        className="w-1/2 bg-cover bg-center border-r border-black"
        style={{ backgroundImage: `url(${signupImage1})` }}
      ></div>

      {/* Form Column */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-[#fffdef]">
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl mb-10 text-left">Sign Up for Kurullo.lk</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Username</label>
            <input
              type="text"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Email</label>
            <input
              type="email"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-start space-y-1">
            <label className="text-left w-full">Password</label>
            <input
              type="password"
              className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mb-11 w-full bg-amber-900 rounded text-white py-2 px-4 hover:bg-amber-800 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Create account
          </button>

          <span>
            Already have an account?
            <button className="ml-5 border rounded border-black bg-[#f8eec8] px-4 py-2  hover:border-black hover:bg-amber-100 transition-colors">
              <Link to="/login">Sign in</Link>
            </button>
          </span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;