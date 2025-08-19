import React from 'react'
import { IMG_CDN_URL } from '../utils/constants';

const MovieCard = ({posterPath}) => {
    return( 
    <div className="w-40 md:w-48 lg:w-52 flex-shrink-0 cursor-pointer transform transition duration-300 hover:scale-105">
        <img className="w-full h-auto rounded-md" alt='movie card' src={IMG_CDN_URL + posterPath}/>
    </div>
  );
};

export default MovieCard;