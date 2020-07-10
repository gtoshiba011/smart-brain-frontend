import React from "react";

const Navigation = ({ isSignedIn, onRouteChange }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      <p
        onClick={() => onRouteChange("signin")}
        className="f3 link dim black underline pa3 pointer"
      >
        {isSignedIn ? "Sign Out" : "Sign In"}
      </p>
    </nav>
  );
};

export default Navigation;
