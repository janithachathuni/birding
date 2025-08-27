import React from "react";
import { Link } from 'react-router-dom';
import signupImage1 from '../assets/signup_image1.jpg';
import { useState } from "react";
import axios from 'axios';

const SignUp = () => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register', {username, email, password})
        .then(result=> console.log(result))
        .catch(err=> console.log(err));
    }

    return(
        <div className="min-h-screen flex">
            {/* Image Column - Background */}
            <div 
                className="w-1/2 bg-cover bg-center border-r border-black"
                style={{ backgroundImage: `url(${signupImage1})` }}
            ></div>

            {/* Form Column */}
            <div className="w-1/2 flex items-center justify-center p-10 bg-[#fffdef]">
                <form className="w-full max-w-md space-y-4"
                onSubmit={handleSubmit}
                >
                    <h1 className="text-3xl mb-10 text-left">Sign Up for Kurullo.lk</h1>

                    <div className="flex flex-col items-start space-y-1">
                    <label className="text-left w-full">Username</label>
                    <input 
                        type="text"
                        className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                    <label className="text-left w-full">Email</label>
                    <input 
                        type="email"
                        className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    </div>

                    <div className="flex flex-col items-start space-y-1">
                    <label className="text-left w-full">Password</label>
                    <input 
                        type="password"
                        className="border rounded border-amber-900 p-2 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={(e) => setPassword(e.target.value)}
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