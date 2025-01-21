import React from "react";
import { Link } from "react-router-dom";
import LogoPlaceholder from "../components/LogoPlaceholder";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <LandingBackground />
      <NavBar />
      {/* Main Content */}
      <div className="relative z-20 flex flex-col justify-center items-start md:px-[10%] px-6 py-12 min-h-screen">
        <h1 className="text-5xl font-extrabold text-white text-left">
          Saangee's Kitchen
        </h1>
        <p className="text-lg font-medium text-white mt-4">
          Authentic Indian home cooking in Livingston, NJ and surrounding areas.
        </p>
      </div>
    </div>
  );
}

function LandingBackground() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 55%)",
          backgroundColor: "#F98128",
        }}
      ></div>
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          clipPath: "polygon(0 55%, 100% 100%, 100% 100%, 0 100%)",
          backgroundColor: "#6CD0D0",
        }}
      ></div>
    </div>
  );
}

function NavBar() {
  return (
    <nav className="relative w-full flex justify-between items-center p-4">
      <LogoPlaceholder />
      <div>
        <Link
          className="px-4 py-2 bg-white text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-200"
          to="/auth"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
