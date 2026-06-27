import React, { useEffect, useRef, useState } from 'react';
import UserMenu from './UserMenu';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { addUser, removeUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { API_OPTIONS, LOGO } from '../utils/constants';
import {
  addTitleSearchError,
  addTitleSearchResults,
  clearTitleSearchView,
  closeGptSearchView,
  startTitleSearch,
  toggleGptSearchView,
} from '../utils/gptSlice';


const Header = () => { 

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [showSearchInput,setShowSearchInput] = useState(false);
  const titleSearchText = useRef(null);
  


  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
    setShowSearchInput(false);
  };

  const handleHomeClick = () => {
    dispatch(closeGptSearchView());
    dispatch(clearTitleSearchView());
    setShowSearchInput(false);
    navigate('/browse');
  };

  const handleTitleSearchSubmit = async (e) => {
    e.preventDefault();
    const query = titleSearchText.current?.value.trim();
    if (!query) return;

    dispatch(startTitleSearch(query));
    dispatch(closeGptSearchView());
    navigate('/browse');

    try {
      const queryParams = new URLSearchParams({
        query,
        include_adult: "false",
        language: "en-US",
        page: "1",
      });
      const data = await fetch("https://api.themoviedb.org/3/search/movie?" + queryParams.toString(), API_OPTIONS);
      if (!data.ok) throw new Error("TMDB search failed");
      const json = await data.json();
      dispatch(addTitleSearchResults(json.results || []));
    } catch (err) {
      dispatch(addTitleSearchError("Something went wrong while searching. Please try again."));
    }
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
  },[dispatch, navigate]);

  return (
  <div className="flex justify-between items-center px-8 py-2 bg-gradient-to-b from-black z-50 absolute w-full">
    {/* Left - Logo */}
    <img className="w-44 pl-6" src={LOGO} alt="Netflix-logo" />

    {/* Right part */}
  { user && ( 
    <div className="flex items-center gap-7 text-white pr-8">
      <button type="button" onClick={handleHomeClick} className="bg-transparent text-white text-base font-medium hover:underline rounded-sm outline-none">
        Home
      </button>

      <button type="button" onClick={handleGptSearchClick} tabIndex={0} aria-label="Toggle GPT search" className="bg-transparent text-white rounded-full outline-none">
        <i className="bi bi-robot text-2xl cursor-pointer transition-transform duration-200 hover:scale-125"></i>
      </button>

      {showSearchInput && (
        <form onSubmit={handleTitleSearchSubmit} className="flex items-center">
          <input
            ref={titleSearchText}
            type="text"
            autoFocus
            placeholder="Search movies"
            className="w-48 px-3 py-2 rounded-l-md bg-black bg-opacity-70 border border-gray-600 text-white placeholder-gray-400 outline-none"
          />
          <button type="submit" aria-label="Submit movie search" className="px-3 py-2 rounded-r-md bg-red-600 text-white hover:bg-red-700 outline-none">
            <i className="bi bi-search"></i>
          </button>
        </form>
      )}

      <button type="button" onClick={() => setShowSearchInput(!showSearchInput)} tabIndex={0} aria-label="Search" className="bg-transparent text-white rounded-full outline-none">
        <i className="bi bi-search text-xl cursor-pointer transition-transform duration-200 hover:scale-125"></i>
      </button>

    <UserMenu />
    </div>
  )}
  </div>

  );
};

export default Header;
