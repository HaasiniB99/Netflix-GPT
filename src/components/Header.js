import React, { useEffect } from 'react';
import UserMenu from './UserMenu';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { addUser, removeUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import {LOGO, SUPPORTED_LANGUAGES} from '../utils/constants';
import { toggleGptSearchView } from '../utils/gptSlice';
import { changeLanguage } from '../utils/configSlice';


const Header = () => { 

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  


  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

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
    <img className="w-44 pl-6" src={LOGO} alt="Netflix-logo" />

    {/* Right part */}
  { user && ( 
    <div className="flex items-center gap-14 text-white pr-8">
      {showGptSearch && (<div className="inline-flex items-center justify-center p-1 rounded-full border border-gray-400">
        <select onChange={handleLanguageChange} className="w-10 h-10 rounded-full bg-black text-white text-center cursor-pointer appearance-none outline-none">
            {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.identifier} value={lang.identifier}>
              {lang.name}
            </option>
            ))}
        </select>
      </div>)}

      <i onClick={handleGptSearchClick} className="bi bi-robot text-2xl cursor-pointer transition-transform duration-200 hover:scale-125"></i>

      <i className="bi bi-search text-xl cursor-pointer transition-transform duration-200 hover:scale-125"></i>

    <div className="relative cursor-pointer transition-transform duration-200 hover:scale-125">
      <i className="bi bi-bell text-2xl "></i>
    </div>
    <UserMenu />
    </div>
  )}
  </div>

  );
};

export default Header;