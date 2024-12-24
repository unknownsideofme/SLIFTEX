import React from 'react'

import Navbar from "../components/Navbar"
import Content from '../components/Content'
import Card from "../components/Card"
import ToolsAndTech from '../components/ToolsAndTech'
import StepByStepGuide from '../components/StepByStepGuide'
import Footer from '../components/Footer'

const Home = () => {

  
  return (
    <>
     <Navbar />
      <Content />
     <ToolsAndTech />
     <StepByStepGuide />
      <Card />
      <Footer /> 
     
    
    </>
   
  )
}

export default Home
