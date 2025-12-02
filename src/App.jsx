
import './App.css'
import { Routes, Route } from 'react-router';
import { useContext } from 'react';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/DashboardPage';
import ProfilePage from './components/ProfilePage/ProfilePage';
import AddApplicationPage from './components/AddApplicationPage/AddApplicationPage'
import SingleApplicationPage from './components/SingleApplication/SingleApplication';


import { UserContext } from './contexts/UserContext';



const App = () => {

  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <main className="main-content">
      <Routes>
        <Route path='/dashboard' element={user ? <Dashboard /> : <SignInForm /> } />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-application" element={<AddApplicationPage />} />
        <Route path="/application/:id" element={<SingleApplicationPage />} />

      </Routes>
      <Footer />
      </main>
     
    </>
  );
};

export default App;
