# 🎬 Movie Ticket Booking Platform

A **full-stack movie ticket booking platform** built with **React, Node.js, Express, and MongoDB**, enabling users to browse movies, select seats, and book tickets online seamlessly.  

This project simulates a real-world ticket booking experience with **seat selection, booking history, authentication, and responsive UI**.

---

## 📝 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Learning Outcomes](#learning-outcomes)
- [Contact](#contact)

---

## 🌟 Features

- **Browse Movies:** View currently playing movies with details like title, genre, duration, and poster.  
- **Seat Selection:** Select available seats in real-time for each show.  
- **Booking Tickets:** Complete ticket bookings and view your booking history.  
- **Authentication:** Secure Login and Registration for users.  
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices.  
- **Payment Integration:** Supports demo or real payment gateway (Stripe or other).  
- **Admin Dashboard (Optional):** Manage movies, shows, and bookings.  

---

## 🛠 Tech Stack

- **Frontend:** React, React Router, CSS, HTML  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Vercel (Frontend), [Backend Hosting Platform]  

---

## 📂 Project Structure
movie-ticket-booking/
│
├── backend/ # Node.js backend
│ ├── config/ # DB connection & environment variables
│ ├── controllers/ # Controller logic for API endpoints
│ ├── models/ # MongoDB models (User, Booking, Movie)
│ ├── routes/ # API routes
│ ├── middleware/ # Auth middleware
│ └── server.js # Entry point for backend
│
├── frontend/ # React frontend
│ ├── public/ # Public assets
│ ├── src/ # React components & pages
│ │ ├── components/ # Reusable components (Navbar, Footer, Seats, etc.)
│ │ ├── pages/ # Pages (Home, MovieDetail, Booking, Login, Register)
│ │ ├── context/ # React Context or Redux store
│ │ └── App.js # Main React component
│ └── package.json
│
└── README.md


---

## ⚡ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/movie-ticket-booking.git
cd movie-ticket-booking

