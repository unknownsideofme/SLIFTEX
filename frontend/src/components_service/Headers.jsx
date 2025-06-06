import React from 'react';
import image from '../assets/image.png'; // ✅ import the image

function Headers() {
  return (
    <div className='h-auto w-100vw bg-[#fefffe] flex justify-center'>
      <img src={image} alt="Header" />
    </div>
  );
}

export default Headers;
