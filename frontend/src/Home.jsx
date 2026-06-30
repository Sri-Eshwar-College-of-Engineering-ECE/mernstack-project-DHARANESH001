import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to Skill Tracker</h1>
      <button onClick={() => navigate("/login")}>Start to Develop Skill</button>
    </div>
  );
};

export default Home;
