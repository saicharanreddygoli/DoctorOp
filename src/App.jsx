// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import UserHome from "./components/user/UserHome";
import AdminHome from "./components/admin/AdminHome";
// UserAppointments is rendered INSIDE UserHome now, so no direct route needed
// import UserAppointments from "./components/user/UserAppointments";


function App() {
  // Basic check if token/userData exists in localStorage
  // CHANGED from const to let so it can be reassigned in the catch block
  let userLoggedIn = !!localStorage.getItem("userData");
  let userType = null;
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    userType = userData?.type;
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    // Handle case of invalid localStorage data, e.g., clear it
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    // This assignment is now valid
    userLoggedIn = false;
    userType = null;
  }


  return (
    <div className="App">
      <Router>
        {/* Renamed this div class to avoid conflict with layout 'content' */}
        <div className="route-content">
          <Routes>
            {/* Public Routes */}
            <Route exact path="/" element={<Home />} />

            {/* If logged in, redirect from Login/Register to respective home */}
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
            {/* If not logged in, redirect protected routes to login */}
            <Route
              path="/adminhome"
              element={userLoggedIn && userType === 'admin' ? <AdminHome /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/userhome"
              element={userLoggedIn && userType === 'user' ? <UserHome /> : <Navigate to="/login" replace />}
            />
             {/* UserAppointments is now rendered within UserHome, no separate route needed */}
            {/* <Route
              path="/userappointments" // Adjusted path
              element={userLoggedIn && userType === 'user' ? <UserAppointments /> : <Navigate to="/login" replace />}
            /> */}


            {/* Fallback route for unmatched paths */}
            {/* Consider a 404 component or redirect */}
             <Route path="*" element={userLoggedIn ? <Navigate to={userType === 'admin' ? '/adminhome' : '/userhome'} replace /> : <Navigate to="/login" replace />} />

          </Routes>
        </div>
        <footer className="bg-light text-center text-lg-start">
          <div className="text-center p-3">© {new Date().getFullYear()} Copyright: MediCareBook</div> {/* Dynamic Year */}
        </footer>
      </Router>
    </div>
  );
}

export default App;