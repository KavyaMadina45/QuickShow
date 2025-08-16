//first get all movie list
import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { getOccupiedSeats } from "./bookingControllers.js";



import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === "ECONNRESET",
});

export const getNowPlayingMovies = async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY || "5ecd245745e9f2fa35fad827dc959f4a";

    if (!apiKey) {
      console.error("❌ TMDB_API_KEY is undefined");
      return res.status(500).json({ success: false, message: "TMDB API key not found." });
    }

    const { data } = await axios.get("https://api.themoviedb.org/3/movie/now_playing", {
      params: {
        api_key: apiKey,
        language: "en-US",
        page: 1,
      },
      timeout: 5000, // 5 seconds timeout
    });

    res.status(200).json({ success: true, movies: data.results });
  } catch (error) {
    console.error("❌ Error fetching now playing movies:", error.message);
    console.error(error.response?.data || error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch now playing movies.",
    });
  }
};









//API to add a new show to the database

// export const addShow=async(req,res)=>{
//     try{
//         const { movieId, showsInput, showPrice } = {
//             movieId: req.body.movieId?.id || req.body.movieId,
//             showsInput: req.body.showsInput,
//             showPrice: req.body.showPrice,
//           };
          

//         let movie= await Movie.findById(movieId)

//         if(!movie){
//             //fetch movie details and credits from TMDB API
//             const [movieDetailsResponse,movieCreditsResponse]=await Promise.all([
//                 axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
//                     headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
//                     }),
//                     //add another api call
//                     axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{
//                         headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
//                     })
//             ]);


//             const movieApiData=movieDetailsResponse.data;
//             const movieCreditsData=movieCreditsResponse.data;


//             const movieDetails={
//                 _id:movieId,
//                 title:movieApiData.title,
//                 overview:movieApiData.overview,
//                 poster_path:movieApiData.poster_path,
//                 backdrop_path:movieApiData.backdrop_path,
//                 genres:movieApiData.genres,
//                 casts:movieCreditsData.cast,
//                 release_date:movieApiData.release_date,
//                 original_language:movieApiData.original_language,
//                 tagline:movieApiData.tagline || "",
//                 vote_average:movieApiData.vote_average,
//                 runtime:movieApiData.runtime,
//             }

//             //Add movie to the database
//             movie=await Movie.create(movieDetails);
//         }

//         const showsToCreate=[];
//         showsInput.forEach(show=>{
//             const showDate=show.date;
//             show.time.forEach((time)=>{
//                 const dateTimeString=`${showDate}T${time}`;
//                 showsToCreate.push({
//                     movie:movieId,
//                     showDateTime:new Date(dateTimeString),
//                     showPrice,
//                     occupiedSeats:{}
//                 })
//             })
//         });


//         if(showsToCreate.length > 0){
//             await Show.insertMany(showsToCreate);
//         }

//         res.json({success:true,message:"Show Added Successfully!"})
//     }catch(error){
//         console.error(error);
//         res.json({success:false,message:error.message})
//     }
// }


export const addShow = async (req, res) => {
  try {
    // Safely extract movieId from body
    const movieId = req.body.movieId;

    const { showsInput, showPrice } = req.body;


    if (!movieId) {
      return res.status(400).json({ success: false, message: "Invalid movie ID" });
    }

    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch from TMDb v3 using API key in query
      const apiKey = process.env.TMDB_API_KEY;

      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieApiData.id.toString(),
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      // Save movie in DB
      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
showsInput.forEach((show) => {
  const showDate = show.date;
  show.times.forEach((time) => {
    const dateTimeString = `${showDate}T${time}`;
    showsToCreate.push({
      movie: movie._id, // ✅ Use movie._id from DB
      showDateTime: new Date(dateTimeString),
      showPrice,
      occupiedSeats: {},
    });
  });
});

    

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show Added Successfully!" });
  } catch (error) {
    console.error("❌ Error in addShow:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};










// API to get all shows from the database
export const getShows=async(req,res)=>{
    try{
        const shows=await Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime:1});
        //filter nique shows
        const uniqueShows=new Set(shows.map(show=>show.movie))
        res.json({success:true,shows:Array.from(uniqueShows)})
    }
    catch(error){
        console.error(error);
        res.json({success:false,message:error.message});
    }   
}

//API to get a single show from the database
export const getShow=async(req,res)=>{
    try{
        const {movieId}=req.params;
        //get all upcoming shows for the movie
        const shows=await Show.find({movie:movieId,showDateTime:{$gte:new Date()}})

        const movie=await Movie.findById(movieId);
        const dateTime={};

        shows.forEach((show)=>{
            const date=show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date]=[]
            }
            dateTime[date].push({time: show.showDateTime,showId:show._id})
        })
        res.json({success:true,movie,dateTime})
    }
    catch(error){
        console.error(error);
        res.json({success:false,message:error.message});
    }
}














