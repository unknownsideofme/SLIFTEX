import React from 'react'
import "./ContentStyle.css"
const Content = () => {
  return (
    <div className='main-content'>
      <img alt='img' src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />

      <div className='content-text'>
        <h1>Discover your Title's Potential</h1>
        <p>Unlock the power of our advanced model to analyze the probability of your title's success. <br />
          Enter your title and let our technology provide you with insightful results, <br />
          perfect for your newspaper.
        </p>
        <a  className="show" href='/service'>
        Get Started
        </a>
      </div>
    </div>
  )
}

export default Content
