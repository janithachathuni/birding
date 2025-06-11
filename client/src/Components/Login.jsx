import React from "react";
import { Link } from 'react-router-dom';
import signupImage1 from '../assets/signup_image1.jpg';

const Login = () => {
    return(
        <div className="min-h-screen flex">
            {/* Image Column - Background */}
            <div className="relative w-1/2 border-r border-black group">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${signupImage1})` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-0" />
                
                {/* Bird Info */}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Thalangama Lake</span>
                    </div>
                </div>
            </div>

            {/* Form Column */}
            <div className="w-1/2 flex items-center justify-center p-10 bg-[#fffdef]">
                <form className="w-full max-w-md space-y-4">
                    <h1 className="text-3xl mb-10 text-left">Sign in to your account</h1>

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
                        Submit
                    </button>

                    <Link to="/" className="-mt-[10px] text-amber-800 hover:text-amber-600">Forgot password?</Link>
                    
                    <br/><br/><br/>

                    <span>Don't have an account? 
                        <button className="ml-5 border rounded border-amber-900 bg-[#f8eec8] px-4 py-2 hover:border-black hover:bg-amber-100 transition-colors">
                            <Link to="/signup">Sign up</Link>
                        </button>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Login;