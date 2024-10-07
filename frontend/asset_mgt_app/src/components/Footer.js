import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

function Footer() {
  return (
    <div>
      <footer className="main-footer">
        <center>
          <strong>
            Copyright © 2024 <Link to="/">Ofisi ya Mkuu wa Mkoa Kusini</Link>.
          </strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block"></div>
        </center>
      </footer>
    </div>
  );
}

export default Footer;
