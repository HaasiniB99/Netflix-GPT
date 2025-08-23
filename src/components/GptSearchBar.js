import Header from './Header'
import GptMovieSuggestions from './GptMovieSuggestions'

{/* <Header/>
<GptSearchBar/>
<GptMovieSuggestions/> */}

const GptSearchBar = () => {
  return (
    <div>
        <Header/>
        <GptSearchBar/>
        <GptMovieSuggestions/>
    </div>
  );
};

export default GptSearchBar;