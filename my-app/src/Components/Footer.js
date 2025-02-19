import React from "react";

const Footer = () => {
  return (
    <footer style={{ color: "#000", padding: "1rem", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        <div>
          <a href="#" style={{ color: "#000", margin: "0 10px", textDecoration: "none" }}>Privacy Policy</a>
          <a href="#" style={{ color: "#000", margin: "0 10px", textDecoration: "none" }}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
