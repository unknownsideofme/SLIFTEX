import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="about-us">
        <h1 >Sliftex</h1>
          
        </div>
        <div className="quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/service">Services</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="/service">About</a></li>
          </ul>
        </div>
        <div className="follow-us">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="#facebook"><i class="fa-brands fa-facebook"></i></a></li>
            <li><a href="#twitter"><i class="fa-brands fa-twitter"></i></a></li>
            <li><a href="#instagram"><i class="fa-brands fa-instagram"></i></a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 SIH. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;