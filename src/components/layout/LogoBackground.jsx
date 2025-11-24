
import React from 'react';

const LogoBackground = () => {
  return (
    <>
      {/* Subtle animated gradient overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 animate-pulse" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 70%)',
          animationDuration: '8s'
        }}
      />
      
      {/* Reduced opacity trio logo background */}
      <div 
        className="fixed inset-0 opacity-5 bg-no-repeat bg-center bg-contain pointer-events-none z-0 transition-opacity duration-1000" 
        style={{
          backgroundImage: `url('/__ MUHEESI KKG-Tri-company logoes - png.png')`,
          backgroundSize: '40%',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          filter: 'contrast(0.9) brightness(1.1)'
        }} 
      />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </>
  );
};

export default LogoBackground;
