import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>0927 504 1084</p>
            <p>Open: 12PM - 10PM</p>
            <p>Email: Brunobrian05@gmail.com</p>
            <p>2 Homeowners Drive, Marikina City, Philippines, 1800</p>
          </div>
          <div className="footer-section">
            <h4>Social</h4>
            <a href="https://www.facebook.com/profile.php?id=61576343903474" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </div>
          <div className="footer-section">
            <h4>JoJo's Bizarre Coffee</h4>
            <p>Where every sip is an adventure.</p>
          </div>
        </div>
        <div className="footer-bottom">
          © JoJo's Bizarre Coffee — All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
