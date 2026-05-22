# MovieMuse — Personalized Movie Recommendation Platform

MovieMuse is a full-stack, Netflix-style personalized movie recommendation platform developed as a bachelor thesis / graduation project. The project combines recommendation system techniques, modern frontend development, backend API engineering, authentication, email verification, Stripe subscription payments, premium feature access, movie analytics, and database-backed personalized user features.

MovieMuse is designed to demonstrate how a real-world movie recommendation product can be built using machine learning, data processing, external APIs, secure user accounts, and subscription-based access control.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Objectives](#project-objectives)
- [Main Features](#main-features)
- [Recommendation System](#recommendation-system)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Folder Structure](#project-folder-structure)
- [Backend Structure Explained](#backend-structure-explained)
- [Frontend Structure Explained](#frontend-structure-explained)
- [Dataset Structure](#dataset-structure)
- [Environment Variables](#environment-variables)
- [How to Run the Project](#how-to-run-the-project)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
- [Email Verification Flow](#email-verification-flow)
- [Favorites Flow](#favorites-flow)
- [Stripe Subscription Flow](#stripe-subscription-flow)
- [Premium Feature Access](#premium-feature-access)
- [Analytics Dashboard](#analytics-dashboard)
- [Testing Guide](#testing-guide)
- [Demo Scenario](#demo-scenario)
- [Academic Value](#academic-value)
- [Future Improvements](#future-improvements)
- [Project Status](#project-status)

---

## Project Overview

MovieMuse is a personalized movie recommendation platform that helps users discover movies through content-based filtering, collaborative filtering, hybrid recommendation logic, and enriched movie metadata from TMDB.

The application provides a Netflix-inspired user interface where users can browse movies, search for a movie, view detailed movie information, receive similar recommendations, save favorite movies, register and verify their email, subscribe to premium access, and view a premium analytics dashboard.

The project is not only a movie recommendation system, but also a complete full-stack software product that includes real user flows, protected routes, backend persistence, payment integration, and data analytics.

---

## Project Objectives

The main objectives of MovieMuse are:

1. Build a complete full-stack web application for movie recommendations.
2. Apply recommendation system techniques using real movie datasets.
3. Provide a clean, responsive, Netflix-style user interface.
4. Implement real authentication using JWT.
5. Add email verification during registration.
6. Store user-specific favorites in the backend database.
7. Integrate Stripe Checkout for premium subscription payments.
8. Restrict premium features based on subscription status.
9. Provide analytics based on the movie dataset.
10. Demonstrate strong software engineering structure suitable for a bachelor thesis.

---

## Main Features

### Movie Browsing

Users can browse:

- Popular movies
- Top-rated movies
- A dynamic hero movie on the homepage
- Movie posters, ratings, and release years
- Responsive movie rows and cards

### Movie Details

Each movie details page includes:

- Movie title
- Poster image
- Backdrop image
- Overview
- Genres
- Runtime
- Release year
- Rating
- Popularity
- Director
- Top cast
- Trailer link
- Parental advisory
- Similar movies
- Add/remove favorite button

### Smart Search

MovieMuse search is designed as a discovery experience, not only a basic search.

When the user searches for a movie:

1. The system finds the closest matching movie.
2. The matched movie is displayed as the main result.
3. Similar/recommended movies are displayed below it.
4. The user can filter and sort recommended movies.

Example:

```txt
User searches: Avatar
↓
MovieMuse finds Avatar as the matched movie
↓
MovieMuse displays similar sci-fi/action/adventure movies
```

### Favorites

Authenticated users can:

- Add movies to favorites
- Remove movies from favorites
- View saved favorites
- Refresh the page without losing favorites
- Logout and login again while keeping saved favorites

Favorites are stored in the backend database and linked to the authenticated user.

### Authentication

MovieMuse includes real authentication:

- Register account
- Generate verification code
- Verify email
- Login with JWT
- Logout
- Protected endpoints
- Authenticated profile page

### Premium Subscription

MovieMuse includes a Stripe-powered premium subscription flow:

- Pricing page
- Stripe Checkout session
- Payment success page
- Payment cancel page
- Subscription confirmation
- Premium profile status
- Premium badge
- Premium-only analytics access

### Analytics Dashboard

Premium users can access analytics such as:

- Total movies
- Average rating
- Average popularity
- Total votes
- Movies with revenue
- Total revenue
- Genre distribution
- Rating distribution
- Movie count by year

---

## Recommendation System

MovieMuse includes three recommendation approaches:

### 1. Content-Based Filtering

Content-based filtering recommends movies similar to a selected movie based on movie metadata.

The system uses:

- Overview
- Genres
- Keywords
- Cast
- Director

The metadata is combined into one text representation. Then the system uses TF-IDF vectorization and cosine similarity to find movies with similar content.

#### Content-Based Flow

```txt
Movie metadata
↓
Clean and combine text features
↓
Convert text into TF-IDF vectors
↓
Calculate cosine similarity between movies
↓
Return top similar movies
```

#### Example

```txt
Input movie: Avatar

Features used:
- Science Fiction
- Adventure
- Action
- Alien planet
- Space travel
- James Cameron
- Main cast

Output:
Movies with similar content, genre, and theme.
```

### 2. Collaborative Filtering

Collaborative filtering recommends movies based on user rating behavior.

This approach uses MovieLens ratings data to find relationships between movies based on how users rated them.

#### Collaborative Filtering Flow

```txt
User ratings
↓
Create user-movie rating matrix
↓
Calculate item similarity
↓
Recommend movies similar to movies the user liked
```

This method focuses on user behavior rather than only movie metadata.

### 3. Hybrid Recommendation

The hybrid recommendation system combines multiple signals:

- Collaborative filtering score
- Movie rating score
- Popularity score

This creates a more balanced recommendation result.

#### Example Formula

```txt
Final Score = 0.60 collaborative score
            + 0.25 rating score
            + 0.15 popularity score
```

The hybrid approach improves recommendation quality by combining user behavior, movie quality, and general popularity.

---

## System Architecture

MovieMuse follows a client-server architecture.

```txt
React Frontend
    ↓
Axios API Requests
    ↓
FastAPI Backend
    ↓
Services / ML Logic / Database
    ↓
SQLite Database + CSV Datasets + External APIs
```

### Main Components

```txt
Frontend:
- Displays the user interface
- Handles routing
- Sends API requests
- Stores JWT token
- Shows movie cards, details, search results, favorites, profile, pricing, and analytics

Backend:
- Provides REST API endpoints
- Handles authentication
- Sends verification emails
- Processes recommendation logic
- Connects to the database
- Integrates Stripe
- Integrates TMDB

Database:
- Stores users
- Stores subscriptions
- Stores favorites

Datasets:
- TMDB 5000 movies dataset
- TMDB credits dataset
- MovieLens ratings dataset
- MovieLens movies dataset
- MovieLens links dataset

External APIs:
- TMDB API for movie enrichment
- Stripe API for subscription checkout
- Resend SMTP for email verification
```

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Fast frontend development server |
| React Router | Page routing |
| Axios | API requests |
| Tailwind CSS | Styling and responsive design |
| Lucide React | Icons |
| Local Storage | Storing JWT token and user session |

### Backend

| Technology | Purpose |
|---|---|
| FastAPI | Backend REST API framework |
| Python | Backend programming language |
| SQLAlchemy | ORM and database models |
| SQLite | Local development database |
| Pydantic | Request and response validation |
| JWT | Authentication token system |
| Python-Jose | JWT encoding and decoding |
| Passlib | Password hashing |
| Stripe SDK | Subscription checkout integration |
| SMTP / Resend | Email verification delivery |
| Uvicorn | ASGI server |

### Machine Learning / Data

| Technology | Purpose |
|---|---|
| Pandas | Loading and processing datasets |
| Scikit-learn | TF-IDF and similarity calculations |
| TF-IDF Vectorizer | Transforming text into vectors |
| Cosine Similarity | Measuring movie similarity |
| MovieLens Dataset | Ratings and collaborative filtering |
| TMDB 5000 Dataset | Movie metadata and credits |

### External Services

| Service | Purpose |
|---|---|
| TMDB API | Posters, backdrops, trailers, cast, movie details |
| Stripe | Premium subscription checkout |
| Resend | Email verification delivery |

---

## Project Folder Structure

```txt
MovieMuse/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── subscription.py
│   │   │   └── favorite.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth_routes.py
│   │   │   ├── movie_routes.py
│   │   │   ├── recommendation_routes.py
│   │   │   ├── analytics_routes.py
│   │   │   ├── tmdb_routes.py
│   │   │   ├── payment_routes.py
│   │   │   └── favorite_routes.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth_schema.py
│   │   │   └── favorite_schema.py
│   │   │
│   │   ├── services/
│   │   │   ├── movie_service.py
│   │   │   ├── tmdb_service.py
│   │   │   ├── analytics_service.py
│   │   │   └── email_service.py
│   │   │
│   │   ├── utils/
│   │   │   ├── security.py
│   │   │   └── auth_dependency.py
│   │   │
│   │   └── ml/
│   │       ├── content_based.py
│   │       ├── collaborative.py
│   │       └── hybrid.py
│   │
│   ├── requirements.txt
│   ├── .env
│   └── moviemuse.db
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js
│   │   │   ├── authApi.js
│   │   │   ├── movieApi.js
│   │   │   ├── paymentApi.js
│   │   │   └── favoriteApi.js
│   │   │
│   │   ├── components/
│   │   │   ├── MovieCard.jsx
│   │   │   ├── MovieRow.jsx
│   │   │   └── PremiumGate.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MovieDetails.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentCancel.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── authStorage.js
│   │   │   └── favorites.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   ├── tmdb/
│   │   ├── tmdb_5000_movies.csv
│   │   └── tmdb_5000_credits.csv
│   │
│   └── movielens/
│       ├── movies.csv
│       ├── ratings.csv
│       ├── links.csv
│       └── tags.csv
│
├── README.md
└── .gitignore
```

---

## Backend Structure Explained

### `backend/app/main.py`

This is the main FastAPI entry point.

Responsibilities:

- Creates the FastAPI application
- Adds CORS middleware
- Creates database tables
- Registers all route files
- Defines root endpoint
- Defines health check endpoint

### `backend/app/database.py`

This file handles database configuration.

Responsibilities:

- Loads `DATABASE_URL`
- Creates SQLAlchemy engine
- Creates database session
- Defines `Base`
- Provides `get_db()` dependency for routes

### `backend/app/models/`

This folder contains SQLAlchemy database models.

### `models/user.py`

Stores registered user data.

Responsible for:

- User id
- Name
- Email
- Hashed password
- Email verification status
- Verification code
- Verification expiration date
- Account creation date

### `models/subscription.py`

Stores Stripe subscription data.

Responsible for:

- User subscription relationship
- Stripe customer id
- Stripe subscription id
- Subscription status
- Current period end
- Created and updated timestamps

### `models/favorite.py`

Stores authenticated user favorite movies.

Responsible for:

- User id
- Movie id
- Movie title
- Poster URL
- Backdrop URL
- Release date
- Rating
- Overview
- Created date

Each user can save the same movie only once.

### `backend/app/routes/`

This folder contains backend API endpoints.

### `routes/auth_routes.py`

Handles authentication endpoints.

Responsible for:

- Registering users
- Generating verification code
- Verifying email
- Logging users in
- Resending verification code

### `routes/movie_routes.py`

Handles local movie search and movie-related routes.

Responsible for:

- Searching local movie dataset
- Returning formatted movie data
- Supporting frontend search functionality

### `routes/recommendation_routes.py`

Handles recommendation endpoints.

Responsible for:

- Content-based recommendations
- Collaborative recommendations
- Hybrid recommendations

### `routes/analytics_routes.py`

Handles movie analytics endpoints.

Responsible for:

- Dataset overview
- Genre distribution
- Rating distribution
- Year distribution
- Revenue-related insights

### `routes/tmdb_routes.py`

Handles TMDB API endpoints.

Responsible for:

- Popular movies
- Top-rated movies
- TMDB movie details
- Similar movies
- Posters
- Backdrops
- Trailers
- Cast information

### `routes/payment_routes.py`

Handles Stripe subscription endpoints.

Responsible for:

- Creating Stripe Checkout sessions
- Confirming checkout sessions
- Returning current user subscription status
- Handling Stripe webhook events

### `routes/favorite_routes.py`

Handles database-backed favorites.

Responsible for:

- Getting authenticated user's favorites
- Adding a movie to favorites
- Removing a movie from favorites
- Checking if a movie is already favorited

### `backend/app/schemas/`

This folder contains Pydantic schemas for request and response validation.

### `schemas/auth_schema.py`

Defines authentication schemas.

Includes:

- Register request
- Verify email request
- Login request
- Resend code request
- User response
- Auth response

### `schemas/favorite_schema.py`

Defines favorite schemas.

Includes:

- Favorite create request
- Favorite response

### `backend/app/services/`

This folder contains business logic and third-party service integrations.

### `services/movie_service.py`

Responsible for:

- Loading local movie datasets
- Searching movies
- Formatting movie data
- Preparing data used by routes and recommendations

### `services/tmdb_service.py`

Responsible for communicating with TMDB API.

Used for:

- Movie posters
- Movie backdrops
- Movie trailers
- Cast data
- Director data
- Movie metadata enrichment

### `services/analytics_service.py`

Responsible for calculating dataset statistics.

Used for:

- Overview metrics
- Genre counts
- Rating distribution
- Year distribution
- Revenue insights

### `services/email_service.py`

Responsible for email verification.

Used for:

- Generating verification codes
- Setting code expiration
- Building email content
- Sending verification emails through SMTP
- Printing fallback code if SMTP fails

### `backend/app/utils/`

This folder contains reusable backend utilities.

### `utils/security.py`

Responsible for:

- Hashing passwords
- Verifying passwords
- Creating JWT access tokens

### `utils/auth_dependency.py`

Responsible for:

- Reading JWT token from requests
- Decoding JWT token
- Loading the current authenticated user
- Protecting private API endpoints

### `backend/app/ml/`

This folder contains recommendation algorithms.

### `ml/content_based.py`

Responsible for content-based recommendation.

Uses:

- Movie overview
- Genres
- Keywords
- Cast
- Director
- TF-IDF
- Cosine similarity

### `ml/collaborative.py`

Responsible for collaborative filtering.

Uses:

- MovieLens user ratings
- User-movie interactions
- Item similarity

### `ml/hybrid.py`

Responsible for hybrid recommendations.

Combines:

- Collaborative score
- Rating score
- Popularity score

---

## Frontend Structure Explained

### `frontend/src/App.jsx`

Defines all frontend routes.

Routes include:

```txt
/
/movie/:id
/search
/favorites
/analytics
/register
/verify-email
/login
/pricing
/payment-success
/payment-cancel
/profile
```

The analytics route is protected by the `PremiumGate` component.

### `frontend/src/api/`

This folder contains frontend API clients.

### `api/axios.js`

Creates the Axios instance.

Responsible for:

- Setting backend base URL
- Attaching JWT token automatically
- Sending authenticated requests

### `api/authApi.js`

Responsible for:

- Register API request
- Verify email API request
- Login API request
- Resend verification code API request

### `api/movieApi.js`

Responsible for:

- Popular movies request
- Top-rated movies request
- Movie search request
- Movie details request
- Similar movies request
- Content recommendation request

### `api/paymentApi.js`

Responsible for:

- Creating Stripe Checkout session
- Confirming Stripe Checkout session
- Getting current subscription status

### `api/favoriteApi.js`

Responsible for:

- Getting user favorites
- Adding a favorite movie
- Removing a favorite movie
- Checking favorite status

### `frontend/src/components/`

This folder contains reusable frontend components.

### `components/MovieCard.jsx`

Displays a single movie card.

Shows:

- Poster
- Title
- Rating
- Release year
- Link to movie details page

### `components/MovieRow.jsx`

Displays a group of movie cards.

Used for:

- Popular movies
- Top-rated movies
- Similar movies
- Favorite movies

### `components/PremiumGate.jsx`

Protects premium pages.

Behavior:

```txt
Logged out user → Login required
Logged in free user → Upgrade required
Premium user → Show protected page
```

Used to protect:

```txt
/analytics
```

### `frontend/src/pages/`

This folder contains main application pages.

### `pages/Home.jsx`

The homepage.

Includes:

- Navbar
- Search bar
- Premium/profile/favorites navigation
- Dynamic hero movie
- Popular movies row
- Top-rated movies row

### `pages/MovieDetails.jsx`

Displays detailed movie information.

Includes:

- Poster
- Backdrop
- Overview
- Genres
- Rating
- Runtime
- Trailer
- Cast
- Director
- Parental advice
- Similar movies
- Add/remove favorite button

### `pages/SearchResults.jsx`

Displays smart search results.

Includes:

- Main matched movie
- Similar recommended movies
- Filter by genre
- Sort by recommendation, rating, popularity, or newest

### `pages/Favorites.jsx`

Displays authenticated user's favorite movies.

Favorites are loaded from the backend database.

### `pages/Analytics.jsx`

Displays movie dataset analytics.

This page is premium-only.

### `pages/Register.jsx`

Handles new user registration.

### `pages/VerifyEmail.jsx`

Handles email verification code submission.

### `pages/Login.jsx`

Handles user login.

### `pages/Pricing.jsx`

Displays premium subscription plan and starts Stripe Checkout.

### `pages/PaymentSuccess.jsx`

Confirms Stripe Checkout and activates premium subscription.

### `pages/PaymentCancel.jsx`

Displays cancelled payment state.

### `pages/Profile.jsx`

Displays user account information.

Includes:

- User name
- Email
- Email verification status
- Favorite count
- Subscription status
- Premium status

### `frontend/src/utils/`

This folder contains frontend helper functions.

### `utils/authStorage.js`

Responsible for:

- Saving JWT token
- Saving user data
- Getting current user
- Checking login status
- Logging out user

### `utils/favorites.js`

Previously used for localStorage favorites.

The final version uses backend database-backed favorites for authenticated users.

---

## Dataset Structure

MovieMuse uses two main datasets.

### TMDB 5000 Dataset

Located in:

```txt
data/tmdb/
```

Files:

```txt
tmdb_5000_movies.csv
tmdb_5000_credits.csv
```

Used for:

- Movie metadata
- Genres
- Keywords
- Overview
- Cast
- Crew
- Director
- Content-based filtering
- Analytics

### MovieLens Dataset

Located in:

```txt
data/movielens/
```

Files:

```txt
movies.csv
ratings.csv
links.csv
tags.csv
```

Used for:

- Collaborative filtering
- User rating behavior
- MovieLens-to-TMDB mapping
- Hybrid recommendation logic

---

## Environment Variables

Create a `.env` file inside:

```txt
backend/.env
```

Example:

```env
DATABASE_URL=sqlite:///./moviemuse.db

JWT_SECRET_KEY=change_this_to_a_long_random_secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=1440

TMDB_ACCESS_TOKEN=your_tmdb_read_access_token

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id
FRONTEND_URL=http://localhost:5173

SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASSWORD=your_resend_api_key
SMTP_FROM=onboarding@resend.dev
```

### Important Environment Notes

Do not commit `.env` to GitHub.

The `.env` file contains private credentials such as:

- JWT secret
- TMDB access token
- Stripe secret key
- Stripe webhook secret
- SMTP password

Make sure `.gitignore` contains:

```txt
.env
backend/.env
frontend/.env
venv/
node_modules/
moviemuse.db
__pycache__/
```

---

## How to Run the Project

The frontend and backend must run in separate terminals.

### Backend Setup

Open terminal 1:

```bash
cd ~/Desktop/MovieMuse/backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate virtual environment:

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Run backend server:

```bash
uvicorn app.main:app --reload --port 8001
```

Backend runs at:

```txt
http://127.0.0.1:8001
```

FastAPI Swagger documentation:

```txt
http://127.0.0.1:8001/docs
```

Health check:

```txt
http://127.0.0.1:8001/health
```

### Frontend Setup

Open terminal 2:

```bash
cd ~/Desktop/MovieMuse/frontend
```

Install frontend dependencies:

```bash
npm install
```

Run frontend development server:

```bash
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

---

## Required Development Terminals

Keep two terminals open during development:

```txt
Terminal 1:
Backend FastAPI server

Terminal 2:
Frontend Vite server
```

Example:

```txt
Terminal 1:
cd ~/Desktop/MovieMuse/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8001

Terminal 2:
cd ~/Desktop/MovieMuse/frontend
npm run dev
```

---

## API Documentation

FastAPI automatically provides API documentation at:

```txt
http://127.0.0.1:8001/docs
```

From Swagger UI, developers can test:

- Authentication
- Movie APIs
- Recommendation APIs
- Favorite APIs
- Payment APIs
- Analytics APIs

---

## Main API Endpoints

### Authentication

```txt
POST /auth/register
POST /auth/verify-email
POST /auth/login
POST /auth/resend-code
```

### Movies

```txt
GET /movies/search
GET /tmdb/popular
GET /tmdb/top-rated
GET /tmdb/movie/{movie_id}
GET /tmdb/movie/{movie_id}/similar
```

### Recommendations

```txt
GET /recommendations/content/{movie_title}
GET /recommendations/collaborative/{user_id}
GET /recommendations/hybrid/{user_id}
```

### Favorites

```txt
GET /favorites/me
POST /favorites
DELETE /favorites/{movie_id}
GET /favorites/check/{movie_id}
```

### Payments

```txt
POST /payments/create-checkout-session
POST /payments/confirm-checkout-session
GET /payments/my-subscription
POST /payments/webhook
```

### Analytics

```txt
GET /analytics/overview
GET /analytics/genres
GET /analytics/ratings
GET /analytics/years
```

---

## Authentication Flow

```txt
User registers
↓
Backend creates user with is_verified = false
↓
Backend generates verification code
↓
Email service sends code
↓
User enters code
↓
Backend verifies code
↓
User becomes verified
↓
Backend returns JWT token
↓
Frontend stores token
↓
User can access protected features
```

---

## Email Verification Flow

MovieMuse supports email verification through SMTP.

During development, if SMTP fails, the backend prints the verification code in the terminal as a fallback.

### Resend Testing Limitation

If using Resend with:

```env
SMTP_FROM=onboarding@resend.dev
```

Resend may only allow sending test emails to the verified account email.

To send emails to any user, a custom domain must be verified in Resend.

---

## Favorites Flow

```txt
Logged-in user opens movie details
↓
Frontend checks if movie is already favorite
↓
User clicks Add to Favorites
↓
Frontend sends POST /favorites
↓
Backend stores movie in favorites table
↓
User opens Favorites page
↓
Frontend sends GET /favorites/me
↓
Backend returns saved movies
```

If the user is not logged in:

```txt
Click Add to Favorites
↓
Redirect to Login
```

---

## Stripe Subscription Flow

```txt
User opens Pricing page
↓
User clicks Start Premium Checkout
↓
Frontend calls backend
↓
Backend creates Stripe Checkout Session
↓
User is redirected to Stripe Checkout
↓
User pays using test card
↓
Stripe redirects to Payment Success page
↓
Frontend confirms checkout session with backend
↓
Backend stores subscription as active
↓
User profile shows Premium
↓
Premium-only features become accessible
```

---

## Stripe Test Card

Use the following test card in Stripe Checkout:

```txt
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVC: Any 3 digits
ZIP Code: Any value
```

Example:

```txt
Expiry: 12/34
CVC: 123
ZIP: 12345
```

---

## Premium Feature Access

Premium access is controlled using subscription status.

The frontend calls:

```txt
GET /payments/my-subscription
```

If the user is premium:

```json
{
  "is_premium": true,
  "status": "active"
}
```

If the user is not premium:

```json
{
  "is_premium": false,
  "status": "inactive"
}
```

---

## PremiumGate Component

The `PremiumGate` component protects premium routes.

Used for:

```txt
/analytics
```

Behavior:

```txt
Not logged in → show Login Required
Logged in but not premium → show Upgrade Required
Premium user → show Analytics Dashboard
```

---

## Analytics Dashboard

The analytics dashboard is a premium-only page.

It provides insights about the movie dataset, such as:

- Number of movies
- Average rating
- Average popularity
- Total votes
- Movies with revenue
- Genre distribution
- Rating distribution
- Yearly movie distribution

This demonstrates the data analytics side of the project.

---

## Testing Guide

### Test Authentication

1. Open the frontend.
2. Click Register.
3. Enter name, email, and password.
4. Check email or backend terminal for the verification code.
5. Enter the verification code.
6. Confirm user is redirected/logged in.
7. Logout.
8. Login again.

### Test Favorites

1. Login.
2. Open any movie details page.
3. Click Add to Favorites.
4. Button should change to Remove Favorite.
5. Refresh page.
6. Button should still show Remove Favorite.
7. Open Favorites page.
8. Saved movie should appear.
9. Remove movie.
10. Favorites page should update.

### Test Premium Subscription

1. Login.
2. Open Pricing page.
3. Click Start Premium Checkout.
4. Use Stripe test card.
5. Complete payment.
6. Redirect to success page.
7. Open Profile page.
8. Confirm Premium status is active.

### Test Premium Analytics Gate

1. Logout.
2. Open `/analytics`.
3. Confirm Login Required appears.
4. Login as non-premium user.
5. Confirm Upgrade Required appears.
6. Login as premium user.
7. Confirm Analytics Dashboard appears.

### Test Smart Search

1. Search for a movie such as:

```txt
Avatar
```

2. Confirm the matched movie appears at the top.
3. Confirm similar recommendations appear below.
4. Use filters and sorting.
5. Open a recommended movie details page.

---

## Demo Scenario

A recommended demo flow:

```txt
1. Open homepage
2. Show dynamic movie hero
3. Search for Avatar
4. Explain content-based discovery
5. Open movie details
6. Show poster, trailer, cast, parental advice, similar movies
7. Register new user
8. Show email verification
9. Login
10. Add movie to favorites
11. Refresh to prove database persistence
12. Open Profile
13. Show verified status and favorites count
14. Open Pricing
15. Complete Stripe checkout using test card
16. Open Profile and show Premium
17. Open Analytics Dashboard
18. Explain premium feature gating
```

---

## Academic Value

MovieMuse demonstrates important software engineering and data science concepts.

### Software Engineering Concepts

- Full-stack architecture
- REST API design
- Component-based frontend development
- Authentication and authorization
- Database modeling
- External API integration
- Payment integration
- Protected routes
- Responsive UI design

### Machine Learning Concepts

- Recommendation systems
- Content-based filtering
- Collaborative filtering
- Hybrid recommendation logic
- Feature extraction
- TF-IDF vectorization
- Cosine similarity
- Dataset preprocessing

### Data Analytics Concepts

- Dataset summary statistics
- Genre distribution
- Rating analysis
- Popularity analysis
- Revenue analysis

### Product Concepts

- Freemium model
- Premium features
- User accounts
- Favorites
- Subscription access
- Personalized experience

---

## Future Improvements

Possible future improvements include:

- Deploy backend to Railway or AWS
- Deploy frontend to Vercel
- Replace SQLite with PostgreSQL for production
- Add password reset
- Add real email domain verification
- Add user movie ratings
- Add personalized recommendations based on favorites
- Add watch history
- Add admin dashboard
- Add recommendation explanation text
- Add AI-generated movie summaries
- Add review and comment system
- Add production Stripe webhook handling
- Add Docker setup
- Add CI/CD pipeline
- Add unit and integration tests

---

## Project Status

MovieMuse currently includes:

```txt
Completed:
- Full-stack React + FastAPI application
- Movie browsing
- Movie details
- TMDB integration
- Content-based recommendations
- Collaborative recommendations
- Hybrid recommendations
- Smart search discovery
- User registration
- Email verification
- JWT login
- Stripe subscription checkout
- Premium profile
- Premium-only analytics
- Database-backed favorites
- Responsive frontend design
```

---

## Summary

MovieMuse is a complete full-stack recommendation platform that demonstrates how machine learning, backend APIs, frontend engineering, authentication, subscription systems, and user-specific data can be combined into one practical product.
