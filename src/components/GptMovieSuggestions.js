import { useSelector } from 'react-redux'
import MovieList from './MovieList';

const GptMovieSuggestions = () => {
  const {movieNames , movieResults} = useSelector((store) => store.gpt);
  if(!movieNames) return null;
  return (
    <div className='p-4 m-4 bg-black text-white -mt-16 bg-opacity-70' >
      <div>
        {movieNames.map((movieName,index) => (
          <MovieList key={index} title={movieName} movies={movieResults[index]}/>
        ))}
      </div>
    </div>
  );
};

export default GptMovieSuggestions;