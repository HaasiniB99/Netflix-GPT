import React, { useEffect } from 'react';
import UserMenu from './UserMenu';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { addUser, removeUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import {LOGO} from '../utils/constants';


const Header = () => { 

  const navigate = useNavigate();
  const dispatch = useDispatch();

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {// User is signed in
            const {uid,email,displayName,photoURL} = user;
            dispatch(addUser({uid:uid,email:email,displayName:displayName,photoURL:photoURL}));
            navigate('/browse');
          }
          else {// User is signed out
            dispatch(removeUser());
            navigate('/');
          }
      });
      //React’s useEffect return function tells Firebase:
      //“stop notifying me about auth changes when this component(Header) is no longer in use.”
      return () => unsubscribe();//whatever you return runs when the component unmounts
      //The unsubscribe only runs when the whole React app(in this case:whole Header) unmounts (like when you close/reload the tab).
  },[]);

  return (
   <div className="flex justify-between items-center px-8 py-2 bg-gradient-to-b from-black z-10 absolute w-full">
  {/* Left - Logo */}
  <img 
    className="w-44 pl-6" 
    src={LOGO}
    alt="Netflix-logo"
  />

  {/* Right part */}
  <div className="flex items-center gap-14 text-white pr-8">
    <i className="bi bi-search text-xl"></i>
    <div className="relative cursor-pointer">
      <i className="bi bi-bell text-2xl"></i>
    </div>
    <UserMenu />
  </div>
  </div>
  );
};

export default Header;