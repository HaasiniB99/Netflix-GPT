import React from 'react'
import { IMG_CDN_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { openMovieDetail } from '../utils/movieDetailSlice';

const MovieCard = ({posterPath,title,movieId}) => {
  const dispatch = useDispatch();
  if(!posterPath) return null;
    return( 
    <div
      tabIndex={0}
      onClick={() => movieId && dispatch(openMovieDetail(movieId))}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && movieId) {
          e.preventDefault();
          dispatch(openMovieDetail(movieId));
        }
      }}
      className="w-40 md:w-48 lg:w-52 flex-shrink-0 cursor-pointer transform transition duration-300 hover:scale-105 focus:ring-2 focus:ring-red-500 rounded-md outline-none"
    >
        <img className="w-full h-auto rounded-md" alt={title} src={IMG_CDN_URL + posterPath}/>
    </div>
  );
};

export default MovieCard;
