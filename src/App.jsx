
import './App.css'
import { Routes, Route } from 'react-router';
import { useContext } from 'react';
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Footer from './components/Footer/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import ProfilePage from './components/ProfilePage/ProfilePage';


import { UserContext } from './contexts/UserContext';



const App = () => {

  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <main className="main-content">
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <SignInForm /> } />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
      </main>
     
    </>
  );
};

export default App;
