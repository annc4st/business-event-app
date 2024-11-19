import React from 'react';
import './Hero.css'; 

const Hero = () => {
    return (
        <div className='hero-section'>

   
        <div className="hero">
         <img
        src="/pictures/Screenshot_247.svg"
        alt="Hero Large"
        className="hero-image hero-image-large"
      />
      <div className="hero-content">
        <h1>Welcome to Our Site</h1>
        <p>Your adventure starts here</p>
      </div>
        
        </div>
        </div>
    )
}

export default Hero;