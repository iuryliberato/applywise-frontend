import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-line"></div>

      <div className="footer-links">
        <a href="https://github.com/iuryliberato" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>

        <a href="https://iuryliberatodev.netlify.app/" target="_blank" rel="noopener noreferrer">
          Portfolio
        </a>
        <a href="mailto:iuryliberatocode@gmail.com">
          Contact
        </a>
      </div>
    </footer>
  );
};

export default Footer;
