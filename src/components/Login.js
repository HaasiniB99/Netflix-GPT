import { useState,useRef } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile  } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BgLOGO, USER_AVATAR } from "../utils/constants";

const Login = () => {

    const [isSignInForm,setSignInForm] = useState(true);
    const [errorMessage,setErrorMessage] = useState(null);
    const dispatch = useDispatch();

    const toggleSignInForm = () => {
        setSignInForm(!isSignInForm);
    }

    const email = useRef(null);
    const password = useRef(null);
    const name = useRef(null);

    const handleBtnClick = () => {
        //validate form data
        // console.log(email.current.value);
        // console.log(password.current.value);

        const message = checkValidData(
            email.current?.value,
            password.current?.value,
            !isSignInForm ? name.current?.value : null
        );
        setErrorMessage(message);

        if(message) return;

        if(!isSignInForm){//Sign Up
            createUserWithEmailAndPassword(auth,email.current.value,password.current.value)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                //after successful user sign in,we're updating name and photo
                updateProfile(user, {
                displayName: name.current.value, photoURL: USER_AVATAR
                }).then(() => {
                    const {uid,email,displayName,photoURL} = auth.currentUser;
                dispatch(addUser({ uid:uid , email:email , displayName:displayName , photoURL:photoURL}));
                // Profile updated!
                }).catch((error) => {
                    setErrorMessage(errorMessage);
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorCode + "-" + errorMessage);
            });
        }else{//Sign in
            signInWithEmailAndPassword(auth, email.current.value,password.current.value)
            .then((userCredential) => {
                const user = userCredential.user;
             // ✅ Just dispatch and go to browse
                dispatch(addUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }));
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorCode + "-" + errorMessage);
             });
        }
    };
    
    return(
        <div>
            <Header/>
            <div className="absolute">
                <img src={BgLOGO} alt="bg-logo"  className="w-full h-screen object-cover"/>       
            </div>
            <div >
                <form onSubmit={(e) => e.preventDefault()} className="bg-black p-12 absolute w-4/12 bg-opacity-80 m-36 mx-auto right-0 left-0 text-white">

                    <h1 className="text-4xl ml-8 font-semibold">{isSignInForm ? "Sign In" : "Sign Up"}</h1>

                    {!isSignInForm && (< input type="text" ref={name} placeholder="Enter Full Name" className="py-3 px-2 mt-9 ml-8 w-4/5 bg-gray-600 bg-opacity-40 rounded-sm"/>)}

                    <input type="text" ref={email} placeholder="Email or mobile number " className="py-3 px-2 mt-5 ml-8 w-4/5 bg-gray-600 bg-opacity-40 rounded-sm"/>

                    <input type="password" ref={password} placeholder="Password" className="py-3 px-2 mt-5 ml-8 w-4/5 bg-gray-600 bg-opacity-40 rounded-sm"/>

                    <p className="text-red-600 p-4 ml-6 text-lg font-semibold">{errorMessage}</p>

                    <button onClick={handleBtnClick} className="py-2 mt-5 ml-8 text-white  bg-red-600 w-4/5 text-center rounded-md">{isSignInForm ? "Sign In" : "Sign Up"}</button>

                    

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