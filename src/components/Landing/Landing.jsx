// src/components/Landing.jsx
import { Link } from "react-router";

const Landing = () => {
    return (
      <main>
        <h1>Hello, you are on the landing page for visitors.</h1>
        <p>Sign up now, or sign in to see your super secret dashboard!</p>
        <ul>
            <li><Link to="/sign-in">Sign In</Link></li>
            <li><Link to="/sign-up">Sign Up</Link></li> 
        </ul>
      </main>
    );
  };
  
  export default Landing;
  
  