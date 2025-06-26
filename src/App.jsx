// src/App.jsx
// REMOVE the import for BrowserRouter as Router from here
import { Routes, Route, Navigate } from "react-router-dom";
// import "./App.css"; // App.css imported in main.jsx - keep consistent
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import UserHome from "./components/user/UserHome";
import AdminHome from "./components/admin/AdminHome";
import { useState } from "react"; // Import useState
import './App.css'; // Import App.css here if not doing it in main.jsx

function App() {
  // Read initial state from localStorage once on App mount
  const getInitialAuthState = () => {
    try {
      const userDataString = localStorage.getItem("userData");
      const token = localStorage.getItem("token");
      // Check for both token and userData
      if (token && userDataString) {
        const userData = JSON.parse(userDataString);
         // Check if user data has the 'type' property
         if (userData && userData.type) {
             return { userLoggedIn: true, userType: userData.type };
         } else {
             // UserData exists but is missing type or is malformed
             console.warn("localStorage has userData but missing type. Clearing...");
              localStorage.removeItem("userData");
              localStorage.removeItem("token");
              return { userLoggedIn: false, userType: null };
         }
      }
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      // Clear potentially corrupt data
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
    }
    return { userLoggedIn: false, userType: null };
  };

  // Initialize auth state
  const { userLoggedIn, userType } = getInitialAuthState();
  // No need for useState for this approach, as Login/Register force a reload
  // if they succeed, causing App to remount and re-read initial state.

  // console.log('App Mounted - Auth State:', { userLoggedIn, userType }); // Debugging line

  return (
    // The main div remains
    <div className="App">
      {/* REMOVED <Router> wrapper here */}

      {/* The content that contains Routes */}
      <div className="route-content">
        <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<Home />} />

          {/* Redirect logged-in users away from login/register */}
          {userLoggedIn ? (
              <>
                  <Route path="/login" element={<Navigate to={userType === 'admin' ? '/adminhome' : '/userhome'} replace />} />
                  <Route path="/register" element={<Navigate to={userType === 'admin' ? '/adminhome' : '/userhome'} replace />} />
              </>
          ) : (
               <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
               </>
          )}

          {/* Protected Routes */}
          <Route
            path="/adminhome"
            element={userLoggedIn && userType === 'admin' ? <AdminHome /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/userhome"
            element={userLoggedIn && userType === 'user' ? <UserHome /> : <Navigate to="/login" replace />}
          />

          {/* Fallback route */}
           {/* Redirect to appropriate home if logged in, otherwise to login */}
          <Route path="*" element={userLoggedIn ? <Navigate to={userType === 'admin' ? '/adminhome' : '/userhome'} replace /> : <Navigate to="/login" replace />} />

        </Routes>
      </div>

      {/* Footer outside of Routes, but still within the main App div */}
      <footer className="bg-light text-center text-lg-start">
        <div className="text-center p-3">© {new Date().getFullYear()} Copyright: MediCareBook</div>
      </footer>
    </div>
  );
}

export default App;