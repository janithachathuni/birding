import React from "react";
import { Link } from 'react-router-dom';
import signupImage1 from '../assets/signup_image1.jpg';

const SignUp = () => {
    return(
        <div className="min-h-screen flex">
            {/* Image Column - Background */}
            <div 
                className="w-1/2 bg-cover bg-center border-r border-black"
                style={{ backgroundImage: `url(${signupImage1})` }}
            ></div>

            {/* Form Column */}
            <div className="w-1/2 flex items-center justify-center p-10">
                <form className="w-full max-w-md space-y-4">
                    <h1 className="text-3xl mb-10 text-left">Sign Up for Kurullo.lk</h1>

                    <div className="flex space-x-4">  {/* This container makes children side by side */}
                        <div className="flex-1 flex flex-col items-start space-y-1">
                            <label className="text-left w-full">First Name</label>
                            <input 
                            type="text"
                            className="border rounded border-amber-900 p-2  w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>

                        <div className="flex-1 flex flex-col items-start space-y-1">
                            <label className="text-left w-full">Last Name</label>
                            <input 
                            type="text"
                            className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                    <label className="text-left w-full">Username</label>
                    <input 
                        type="text"
                        className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                    <label className="text-left w-full">Email</label>
                    <input 
                        type="email"
                        className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                    <label className="text-left w-full">Password</label>
                    <input 
                        type="password"
                        className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    </div>

                    <button 
                    type="submit"
                    className="w-full bg-amber-900 rounded text-white py-2 px-4 hover:bg-amber-800 transition-colors mt-6 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    >
                    Create account
                    </button>

                    <span>Already have an account? 
                        <button className="ml-5 border rounded border-black bg-[#f8eec8] px-4 py-2  hover:border-black hover:bg-amber-100 transition-colors">
                            <Link to="/login" >Sign in</Link>
                        </button>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default SignUp;