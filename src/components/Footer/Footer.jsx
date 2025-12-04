import './Footer.css'
import { Github, Globe, Mail, Linkedin } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-line"></div>

      <nav className="footer-links">
        <a
          href="https://github.com/iuryliberato"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={18} />
          GitHub
        </a>

        <a
          href="https://iuryliberatodev.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe size={18} />
          Portfolio
        </a>

        <a
          href="https://www.linkedin.com/in/iury-993/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin size={18} />
          LinkedIn
        </a>

        <a href="mailto:iuryliberatocode@gmail.com">
          <Mail size={18} />
          Contact
        </a>
      </nav>

      <p className="footer-copy">© {year} ApplyWise — Built by Iury Liberato</p>
    </footer>
  );
};

export default Footer;
