import React from "react";
import Navbar from "../components/Navbar";
import '../styles/globals.css';

const About = () => {
  return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>Informacje</h1>
        <p>Autor: Jakub Miśta</p>
        <p>Email: jakub.mista@microsoft.wsei.edu.pl</p>
        <p>Nr albumu: 13748</p>
      </div>
    </div>
  );
};

export default About;
