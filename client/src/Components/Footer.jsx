import React from "react";
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container  text-white py-10 font-karla"
        style={{
            backgroundImage: "linear-gradient(45deg, rgb(0, 0, 0), rgb(2, 48, 32), rgb(2, 48, 32))",
        color: "azure",
        }}
    >
      <div className="container mx-auto">
        {/* Contact Information */}
        <div className="text-center mb-8 ">
          <p className="mb-2">
            Get in touch.{" "}
            <a href="tel:+12033022" className="underline hover:text-gray-300">
              Call +1 20 330 22
            </a>{" "}
            or{" "}
            <a href="mailto:volunteer@hh.com" className="underline hover:text-gray-300">
              email volunteer@hh.com
            </a>{" "}
            anytime.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col sm:flex-row justify-center space-y-8 sm:space-y-0 sm:space-x-20 text-center">
          {/* About Us */}
          <div>
            <h5 className="font-bold mb-3">About Us</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-gray-300">
                  Our Organization
                </Link>
                
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  How we Work
                </a>
              </li>
            </ul>
          </div>
          {/* Start Now */}
          <div>
            <h5 className="font-bold mb-3">Start Now</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/findOpportunities" className="hover:text-gray-300">
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link to="/recruitVolunteers" className="hover:text-gray-300">
                  Recruit Volunteers
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h5 className="font-bold mb-3">Legal</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Template Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-500 pt-2 text-center text-gray-400">
          <p>
            Copyright © Studio Corvus. Powered by{" "}
            <a href="#" className="underline hover:text-gray-300">
              Webflow
            </a>
            .{" "}
            <a href="#" className="underline hover:text-gray-300">
              Image Licensing Info
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;