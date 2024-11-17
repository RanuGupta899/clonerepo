import React from 'react'
import  './hero.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
function Hero() {
  return (
    <div className='hero-container'>
        <div className='heading-section'>
        <h1>Welcome to the Dashboard</h1>
        </div>
     <div className='sub-heading'><p>Explore your Dashboard metrics and insights here</p></div>   
     <div className='grid'>
     <div className='box-1'></div>
        <div className='box-1'></div>
        <div className='box-1'></div>
     </div>
     <div className='grid-1'>
     <div className='box-1'></div>
        <div className='box-1'></div>
        
     </div>
       
     
    </div>
  )
}

export default Hero
