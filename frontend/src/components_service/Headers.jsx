import React from 'react';
  import image from '../assets/image.png'; // ✅ import the image

  function Headers() {
    return (
      <div className='h-auto w-full bg-[#fefffe] flex justify-center items-center py-4'>
        <div className='flex items-center gap-4'>
          <img 
            src="https://mib.gov.in/themes/custom/unee/images/ministry-emblem-img.svg" 
            alt="Government of India Emblem" 
            className='w-20'
            style={{ height: '125px' }}
          />
          <div className='flex flex-col'>
            <h1 
              className='text-black font-normal mb-3' 
              style={{
                fontSize: '1.2rem',
                lineHeight: '18px',
                letterSpacing: '-0.08px'
              }}
            >
              Government of India
            </h1>
                        <h2 
                className='text-black'
                style={{
                  fontWeight: '700',
                  fontSize: '1.37em',
                  fontFamily: 'Noto Sans, sans-serif',
                  marginBottom: '-4px'
                }}
              >
                Ministry of
              </h2>
              <h3 
                className='text-black'
                style={{
                  fontWeight: '700',
                  fontSize: '1.37em',
                  fontFamily: 'Noto Sans, sans-serif'
                }}
              >
                Information and Broadcasting
              </h3>
          </div>
        </div>
      </div>
    );
  }
    
  export default Headers;