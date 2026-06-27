
import { useState } from "react";
import {useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer"; 
import { BACKDROP_CDN_URL } from "../utils/constants";



const VideoBackground = ({movieId,backdropPath,title}) => {

    const trailerVideo = useSelector((store) => store.movies.trailerVideo);
    const [iframeFailed,setIframeFailed] = useState(false);
    useMovieTrailer(movieId);
    const videoKey = trailerVideo?.site === "YouTube" ? trailerVideo?.key : null;
    const showVideo = videoKey && !iframeFailed;
    const fallbackImage = backdropPath ? BACKDROP_CDN_URL + backdropPath : null;
    const youtubeParams = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      loop: "1",
      playlist: videoKey || "",
      modestbranding: "1",
      rel: "0",
      iv_load_policy: "3",
      disablekb: "1",
      fs: "0",
      playsinline: "1",
      enablejsapi: "0",
    });

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
        {fallbackImage && (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={fallbackImage}
            alt={title || "Movie backdrop"}
          />
        )}
        {showVideo && (
          <iframe 
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
            src={"https://www.youtube.com/embed/" + videoKey + "?" + youtubeParams.toString()} 
            title={title ? title + " trailer background" : "Trailer background"}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex="-1"
            aria-hidden="true"
            onError={() => setIframeFailed(true)}
          ></iframe>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
    </div>
  );
};

export default VideoBackground;
