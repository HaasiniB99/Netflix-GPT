import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { USER_AVATAR } from "../utils/constants";



const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);


  const handleClick = () => {
    signOut(auth).then(() => {//signed out
        navigate("/");
    }).catch((error) => {// An error happened.
        navigate("/error");
    });
  };

 

  return (
    <div>
   {user && (<div className="relative">
      <div onClick={() => setOpen(!open)} className="flex items-center gap-2 cursor-pointer" >
      <img
        src={USER_AVATAR}
        alt="user"
        className="w-9 h-9 rounded-md"
      />
      <i className={`bi ${!open ? "bi-caret-down-fill" : "bi-caret-up-fill"} ml-2`}></i>
      </div>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-black text-white rounded-md shadow-lg p-2 space-y-2">
          <p className=" px-3 py-1 hover:bg-gray-800 rounded">
            <i className="bi bi-pencil pr-2"></i>
            <span>Manage Profiles</span>
          </p>
          <p className="px-3 py-1 hover:bg-gray-800 rounded">
            <i className="bi bi-person pr-2"></i>
            Account
          </p>
          <p className="px-3 py-1 hover:bg-gray-800 rounded">
            <i className="bi bi-question-circle pr-2"></i>
            Help Center
          </p>
          <hr className="border-gray-700"/>
          <p onClick={handleClick} className="px-3 py-1 hover:bg-gray-800 rounded pl-6">Sign out of Netflix</p>
        </div>
      )}
    </div> 
    )}
    </div>
   
  );
};

export default UserMenu;