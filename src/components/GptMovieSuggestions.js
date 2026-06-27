import { useSelector } from 'react-redux'
import MovieList from './MovieList';

const GptMovieSuggestions = ({isLoading,error,onRetry}) => {
  const {movieNames , movieResults} = useSelector((store) => store.gpt);
  if(isLoading) return (
    <div className='p-4 mx-4 bg-black text-white bg-opacity-70' >
      {[...Array(5)].map((_,rowIndex) => (
        <div key={rowIndex} className="px-4">
          <div className="w-48 h-8 my-5 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex overflow-hidden gap-3">
            {[...Array(6)].map((_,cardIndex) => (
              <div key={cardIndex} className="w-40 md:w-48 lg:w-52 h-60 md:h-72 lg:h-80 flex-shrink-0 bg-gray-700 rounded-md animate-pulse"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  if(error) return (
    <div className='p-4 mx-4 bg-black text-white bg-opacity-70' >
      <div className="flex items-center gap-4 px-4 py-5">
        <p>{error}</p>
        <button onClick={onRetry} tabIndex={0} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 outline-none">Retry</button>
      </div>
    </div>
  );
  if(!movieNames) return null;
  return (
    <div className='p-4 mx-4 bg-black text-white bg-opacity-70' >
      <div>
        {movieNames.map((movieName,index) => (
          <MovieList key={index} title={movieName} movies={movieResults[index]}/>
        ))}
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
