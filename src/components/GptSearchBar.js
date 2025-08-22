import React from 'react'
import Header from './Header'
import GptMovieSuggestions from './GptMovieSuggestions'

const GptSearchBar = () => {
  return (
    <div>
        <Header/>
        <GptSearchBar/>
        <GptMovieSuggestions/>
    </div>
  )
}

export default GptSearchBar