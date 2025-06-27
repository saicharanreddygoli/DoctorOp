# MediCareBook Frontend (React App)

This is the frontend application for the MediCareBook Doctor Appointment Booking System. It provides the user interface for users, doctors, and administrators to interact with the backend API.

## Technologies Used

*   **React:** JavaScript library for building user interfaces.
*   **React Router DOM (v6):** Handles client-side routing and navigation within the single-page application.
*   **Vite:** Fast development build tool used for bundling and serving the application.
*   **Axios:** Promise-based HTTP client used to make API calls to the backend server.
*   **React Bootstrap:** A component library for building responsive UIs with Bootstrap styles.
*   **Ant Design:** A component library used for specific UI elements like Tabs, Badge, TimePicker, and message popups.
*   **@mui/icons-material:** Provides Material Design icons.
*   **dayjs:** A lightweight date/time library, used here primarily with Ant Design's date/time pickers.

## Project Structure
Use code with caution.
frontend/
├── public/ # Static assets (index.html, favicon, images)
├── src/
│ ├── components/ # Reusable React components
│ │ ├── admin/ # Components specific to the Admin Dashboard
│ │ │ ├── AdminAppointments.jsx # View all appointments (Admin)
│ │ │ ├── AdminDoctors.jsx # View/manage doctor applications (Admin)
│ │ │ ├── AdminHome.jsx # Admin Dashboard layout and navigation
│ │ │ ├── AdminRegister.jsx # Form to create new admin accounts (Admin only)
│ │ │ └── AdminUsers.jsx # View all user accounts (Admin)
│ │ ├── common/ # Components shared across roles or for public access
│ │ │ ├── Home.jsx # Landing page
│ │ │ ├── Login.jsx # Login form
│ │ │ ├── Notification.jsx # Display user/admin notifications
│ │ │ └── Register.jsx # Public registration form (User/First Admin)
│ │ └── user/ # Components specific to the Standard User/Doctor view
│ │ ├── AddDocs.jsx # (Appears unused/empty in provided code)
│ │ ├── ApplyDoctor.jsx # Form to apply as a doctor (User)
│ │ ├── DoctorList.jsx # Card component for displaying a single doctor (User)
│ │ ├── UserAppointments.jsx # View user's or doctor's appointments
│ │ └── UserHome.jsx # User/Doctor Dashboard layout and navigation
│ ├── App.css # Custom CSS styles
│ ├── App.jsx # Main application component, sets up React Router
│ ├── index.css # Global default styles
│ └── main.jsx # Entry point, mounts the React app (includes global CSS imports)
├── .env # Environment variables (backend API URL)
├── index.html # Main HTML file
└── package.json # Project dependencies and scripts
Generated code
## Setup

1.  **Clone the repository:** If not already done, clone the entire project.
    ```bash
    git clone <repository_url>
    cd <project_directory>/frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Create `.env` file:** Create a file named `.env` in the `frontend` directory.
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
    *   Replace `http://localhost:5000` with the base URL and port where your backend API is running. Ensure `/api` is included if that's your backend's base API path.

## Running the Frontend

*   Make sure your backend server is running (see backend README).
*   In your terminal, navigate to the `frontend` directory.
*   Run the development server:
    ```bash
    npm run dev
    ```
*   Vite will output the local URL where the app is running (e.g., `http://localhost:5173/`). Open this URL in your web browser.

## Application Flow and Pages

### Public Access

*   `/`: Landing page (`Home.jsx`).
*   `/login`: Login page (`Login.jsx`). Allows authentication for all user types (User, Doctor, Admin).
*   `/register`: Registration page (`Register.jsx`).
    *   Allows creating a new account as a "User" or "Admin".
    *   **Special Logic:** The backend is configured so that the **very first user** to register can successfully claim the "Admin" role by selecting it on this form. Subsequent attempts to register with `type: 'admin'` will be rejected by the backend.
    *   Successful registration redirects to `/login`.

### Authenticated Access

*   Authentication is handled by JWTs stored in `localStorage`. The `axiosConfig.js` utility automatically attaches the token to outgoing requests.
*   Protected routes in `App.jsx` ensure users are redirected to `/login` if they are not authenticated or try to access an unauthorized role's page.

#### User/Doctor Dashboard (`/userhome`)

Accessible after logging in as a User or Doctor. Uses `UserHome.jsx` as the main layout component. The sidebar and content shown adapt based on the user's `isdoctor` status (obtained from `localStorage`).

*   **User Views (`isdoctor: false`):**
    *   Home: Displays available approved doctors (`DoctorList` components).
    *   Appointments: Shows appointments booked *by* the user (`UserAppointments`).
    *   Apply doctor: Shows the form to apply to become a doctor (`ApplyDoctor`).
*   **Doctor Views (`isdoctor: true`):**
    *   Home: May show a simplified dashboard or instructions (as implemented in `UserHome.jsx`).
    *   Appointments: Shows appointments booked *with* the doctor by patients (`UserAppointments` - table adapts). Allows approving/rejecting appointments and downloading documents.
    *   Apply doctor: This option is hidden.
*   **Common to User/Doctor Home:**
    *   Notifications: Accessible via the header icon, renders `Notification.jsx`.
    *   Logout: Accessible from the sidebar.

#### Admin Dashboard (`/adminhome`)

Accessible after logging in as an Admin (`type: 'admin'`). Uses `AdminHome.jsx` as the main layout component.

*   Appointments: View all appointments in the system (`AdminAppointments.jsx`).
*   Doctors: View and manage doctor applications (`AdminDoctors.jsx`). Approve or reject them.
*   Users: View a list of all user accounts (`AdminUsers.jsx`).
*   Create Admin: Access a form to create *new* admin user accounts (`AdminRegister.jsx`). This is protected on the backend.
*   Notifications: Accessible via the header icon, renders `Notification.jsx`.
*   Logout: Accessible from the sidebar.

## Development Notes

*   The initial admin account is created via the public `/register` page by being the first user to select the "Admin" type. Subsequent admin creation is done through the `/adminhome/adminregister` page (which uses a protected backend route).
*   Authentication state in the frontend is primarily managed via `localStorage` and checked by `App.jsx` on route changes/reloads. A more robust solution would involve React Context for reactive state management across components without full reloads.
*   Backend error handling includes specific status codes and messages for common failures (validation, conflicts, not found, unauthorized). Frontend uses Ant Design `message` to display these.
