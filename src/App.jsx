
import './App.css'
import { Routes, Route } from 'react-router';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/DashboardPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import AddApplicationPage from './components/AddApplicationPage/AddApplicationPage'
import SingleApplicationPage from './components/SingleApplication/SingleApplication';
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="main-content">
        <Routes>

          <Route path="/" element={<SignUpForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-application"
            element={
              <ProtectedRoute>
                <AddApplicationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/application/:id"
            element={
              <ProtectedRoute>
                <SingleApplicationPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
      <Footer />
    </div>
  );
};


export default App;
