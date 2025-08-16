import React, { useEffect, useState } from 'react'

import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const MyBookings = () => {
  const currency=import.meta.env.VITE_CURRENCY 

  const {axios,getToken,user,image_base_url}= useAppContext()

  const [bookings,setBookings]=useState([])
  const [isLoading,setIsLoading]=useState(true)

  // const getMyBookings=async()=>{
  //   try {
  //     const {data}=await axios.get('/api/user/bookings',{
  //       headers:{Authorization:`Bearer ${await getToken()}`}})
  //       if(data.success){
  //         setBookings(data.bookings)
  //       }
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   setIsLoading(false)
  // }


  // const getMyBookings = async () => {
  //   try {
  //     const { data } = await axios.get("/api/user/bookings", {
  //       headers: { Authorization: `Bearer ${await getToken()}` },
  //     });
  
  //     if (data.success) {
  //       const enrichedBookings = await Promise.all(
  //         data.bookings.map(async (item) => {
  //           try {
  //             const movieRes = await axios.get(
  //               `https://api.themoviedb.org/3/movie/${item.show.movieId}`,
  //               {
  //                 headers: {
  //                   Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  //                 },
  //               }
  //             );
  //             item.show.movie = movieRes.data;
  //             return item;
  //           } catch (err) {
  //             console.log("Failed to fetch movie:", item.show.movieId);
  //             return item;
  //           }
  //         })
  //       );
  //       setBookings(enrichedBookings);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setIsLoading(false);
  // };
  
  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
  
      if (data.success) {
        const enrichedBookings = await Promise.all(
          data.bookings.map(async (item) => {
            try {
              // 🛡️ Safety check: skip if show or movieId is missing
              if (!item?.show?.movie?._Id){
                console.warn("Invalid booking without show or movieId:", item);
                return item; // skip enriching, return as-is
              }
  
              // ✅ Fetch movie details from TMDB
              const movieRes = await axios.get(
                `https://api.themoviedb.org/3/movie/${item.show.movieId}`,
                {
                  headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                  },
                }
              );
  
              // 🧠 Add movie details to show
              item.show.movie = movieRes.data;
              return item;
            } catch (err) {
              console.error("Failed to fetch movie:", item?.show?.movieId);
              return item;
            }
          })
        );
  
        setBookings(enrichedBookings);
      }
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }
  
    setIsLoading(false);
  };
  


  useEffect(()=>{
    if(user){
      getMyBookings()
    }
  },[user])

  return !isLoading  ? (
    <div className='relative px-6 md:ox-16 lg-px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px"/>
      <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>


       


{bookings.map((item, index) => {
  const show = item.show;
  const movie = show?.movie;

  return (
    <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
      
      {/* Left side */}
      <div className='flex flex-col md:flex-row'>
        <img
          src={movie ? image_base_url + movie.poster_path : '/default.jpg'}
          alt=""
          className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
        />
        <div className='flex flex-col p-4'>
          <p className='text-lg font-semibold'>{movie?.title || "N/A"}</p>
          <p className='text-gray-400 text-sm'>{movie?.runtime ? timeFormat(movie.runtime) : "N/A"}</p>
          <p className='text-gray-400 text-sm mt-auto'>{show?.showDateTime ? dateFormat(show.showDateTime) : "N/A"}</p>
        </div>
      </div>

      {/* Right side */}
      <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
        <div className='flex items-center gap-4'>
          <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
          {/* {!item.isPaid && <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>Pay Now</Link>} */}
        </div>
        <div className='text-sm'>
          <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
          <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
        </div>
      </div>
    </div>
  );
})}




    </div>
  ) : <Loading/>
}

export default MyBookings;
