# Getting Started
- Create react app
- Configured tailwind

# Planning & Features
- Before Login
    - Header
    - bg-screen
    - Login form
    - Redirect to Login screen
- After Authentication
    - Browse feature
    - Header
    - Main movie
        - trailer running in background
        - title & description of that movie
        -Movie suggestions
            - Movies List
- NetflixGPT
    - Search Bar
    -   Movie Suggestions

# Step-by-Step Featuring
- Header
- Routing of App
- Login Form
- Sign up Form
- Form Validation
- useRef Hook
- Firebase setup
- Deploying app to production
- Create sign up user account 
- Implent sign in user api
- created redux store with userSlice
- implememnted sign out
- updated profile api call with redirecting to browse page if signed up
- Fetch from TMDB Movies 
- BugFix : sign up user's displname and profile picture update
- BugFix : if use isn't logged in ,redirect/browse to Login page and if logged in redirect to browse page 
- Unsubscribed to the onAuthStateChange callback
Added the hardcoded values to the constants file
- Register TMDB API and create an app and get access token
- Get data from TMDB now playing movies list 
- Custom hook for nowPlayingMovies
- Create a movieSlice
- Update store with movie data
- Planning for Maincontainer and SecondaryContainer
- Fetch data for trailer video
- Update store with trailer video data
- Embedded youtube video & make it autoplay and mute
- Tailwind classes to make it look main container look awesome
- Build Secondary Component
- Build Movie List and Movie Card
- TMDB img CDN_URL
- usePopularMovies Custom hook

# steps for deployment
- Install firebase CLI - 'npm install -g firebase-tools'
- Firebase Login - 'firebase login'
- Initialize Firebase - 'firebase init',then select hoisting
- Deploy commad - 'firebase deploy'