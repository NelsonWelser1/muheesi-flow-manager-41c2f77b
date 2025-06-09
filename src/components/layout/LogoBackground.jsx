
import React from 'react';

const LogoBackground = () => {
  return (
    <div 
      className="fixed inset-0 opacity-10 bg-no-repeat bg-center bg-contain pointer-events-none z-0" 
      style={{
        backgroundImage: `url('/__ MUHEESI KKG-Tri-company logoes - png.png')`,
        backgroundSize: '40%',
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed'
      }} 
    />
  );
};

export default LogoBackground;
