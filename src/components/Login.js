import { useState } from "react";
import Header from "./Header";

const Login = () => {

    const [isSignInForm,setSignInForm] = useState(true);

    const toggleSignInForm = () => {
        setSignInForm(!isSignInForm);
    }

    return(
        <div>
            <Header/>
            <div className="absolute">
                <img src="https://assets.nflxext.com/ffe/siteui/vlv3/258d0f77-2241-4282-b613-8354a7675d1a/web/IN-en-20250721-TRIFECTA-perspective_cadc8408-df6e-4313-a05d-daa9dcac139f_large.jpg" alt="bg-logo"  className="w-full h-screen object-cover"/>       
            </div>
            <div >
                <form className="bg-black p-12 absolute w-4/12 bg-opacity-80 m-36 mx-auto right-0 left-0 text-white">

                    <h1 className="text-4xl ml-8 font-semibold">{isSignInForm ? "Sign In" : "Sign Up"}</h1>

                    {!isSignInForm && (< input type="text" placeholder="Enter Full Name" className="py-3 px-2 mt-9 ml-8 w-4/5 bg-gray-600 bg-opacity-40 rounded-sm"/>)}

                    <input type="text" placeholder="Email or mobile number " className="py-3 px-2 mt-5 ml-8 w-4/5 bg-gray-600 bg-opacity-40 rounded-sm"/>

                    <input type="text" placeholder="Password" className="py-3 px-2 mt-5 ml-8 w-4/5 bg-gray-600 bg-opacity-40 rounded-sm"/>

                    <button className="py-2 mt-5 ml-8 text-white  bg-red-600 w-4/5 text-center rounded-md">{isSignInForm ? "Sign In" : "Sign Up"}</button>

                    

                    <p className="text-white font-normal mt-10 ml-8 cursor-pointer ">
                        <span className="text-gray-400">{isSignInForm ? "New to Netflix ?  " : "Already registered !"}</span>
                        <span className=" hover:underline cursor-pointer" onClick={toggleSignInForm}>{isSignInForm ? "Sign up now." : "Sign In now."}</span>
                    </p>

                </form>
            </div>
        </div>
    );
};
export default Login;