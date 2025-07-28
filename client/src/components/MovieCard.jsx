// import React from 'react'
// import { assets } from '../assets/assets'
// import { useNavigate } from 'react-router-dom'
// import { StarIcon } from 'lucide-react'

// const MovieCard = ({movie}) => {
//     const navigate=useNavigate()
//   return (
//     <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66'>

//       <img 
//   onClick={() => {
//     navigate(`/movies/${movie?._id}`);
//     scrollTo(0, 0);
//   }}
//   src={movie?.backdrop_path} 
//   alt="" 
//   className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer" 
// />


// <p className='font-semibold mt-2 truncate'>{movie.title}</p>
// <p className='text-sm text-gray-400 mt-2'>
//     {new Date(movie.release_date).getFullYear()}.{movie.genres.slice(0,2).map(genre => genre.name).join(" | ")}.{movie.runtime}</p>

// <div>
//     <button onClick={()=>{navigate(`/movies/${Movies._id}`);scrollTo(0,0)}} className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Buy Tickets</button>
//         <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
//             <StarIcon className='w-4 h-4 text-primary fill-primary'/>
//             {movie.vote_average.toFixed(1)}
//         </p>
    
// </div>



//     </div>
//   )
// }

// export default MovieCard

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const {image_base_url}=useAppContext()

  // Guard clause to avoid rendering if movie is not ready
  if (!movie) return null;

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">

      {/* Safe image render */}
      {movie.backdrop_path && (
        <img
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          src={image_base_url+movie.backdrop_path}
          alt={movie.title || "Movie Poster"}
          className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
        />
      )}

      {/* Title */}
      <p className="font-semibold mt-2 truncate">{movie.title || "Untitled"}</p>

      {/* Release date, genres, runtime */}
      <p className="text-sm text-gray-400 mt-2">
        {movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown Year"}
        {" • "}
        {Array.isArray(movie.genres)
          ? movie.genres.slice(0, 2).map((genre) => genre.name).join(" | ")
          : "Genres Unknown"}
        {" • "}
        {movie.runtime ? `${timeFormat(movie.runtime)} min` : "Duration Unknown"}
      </p>

      {/* Buy Button + Rating */}
      <div className="mt-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        {typeof movie.vote_average === "number" && (
          <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
            <StarIcon className="w-4 h-4 text-primary fill-primary" />
            {movie.vote_average.toFixed(1)}
          </p>
  )}
      </div>
    </div>
  );
};

export default MovieCard;

