// src/App.jsx
// REMOVE the import for BrowserRouter as Router from here
import { Routes, Route, Navigate } from "react-router-dom"; // <-- Adjusted import
// import "./App.css";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import UserHome from "./components/user/UserHome";
import AdminHome from "./components/admin/AdminHome";
import './App.css';

function App() {
  let userLoggedIn = !!localStorage.getItem("userData");
  let userType = null;
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    userType = userData?.type;
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    userLoggedIn = false;
    userType = null;
  }

  return (
    // The main div remains
    <div className="App">
      {/* REMOVED <Router> wrapper here */}

      {/* The content that contains Routes */}
      <div className="route-content">
        <Routes>
          {/* Public Routes */}
          <Route exact path="/" element={<Home />} />

          {/* Redirect logic based on login status */}
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